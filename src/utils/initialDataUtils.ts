import { PostService } from '../services/postService.ts';
import { CategoryService } from '../services/categoryService.ts';
import { formatDate, getRelativeTime, slugify, getDateRangeInUnix } from './postUtils.ts';
import { Post } from '../types/post.ts';
import { InitialDataStructure } from '../types/initialData.ts';

interface ApiError {
    response?: {
        status?: number;
    };
    status?: number;
}

export default async function initialDataUtils(pathname: string, searchParams: URLSearchParams) {
    const utils = {
        formatDate,
        getRelativeTime,
        slugify,
        getDateRangeInUnix,
    };

    const initialData: InitialDataStructure = {};
    const postIdMatch = pathname.match(/\/post\/([^/]+)/);
    const categoryName = searchParams.get('category')?.toLowerCase() || '';
    const searchQuery = searchParams.get('query') || '';

    const headlinePage = parseInt(searchParams.get('headline_page') || '1', 10);
    const topPage = parseInt(searchParams.get('top_page') || '1', 10);
    const regularPage = parseInt(searchParams.get('regular_page') || '1', 10);
    const searchPage = parseInt(searchParams.get('search_page') || '1', 10);

    const getStatusCode = (error: unknown): number => {
        if (typeof error === 'object' && error !== null) {
            const err = error as ApiError;
            return err.response?.status || err.status || 500;
        }
        return 500;
    };

    try {
        try {
            const categoriesRes = await CategoryService.listCategories();
            initialData.categories = categoriesRes.data;
        } catch {
            initialData.generalError = true;
        }

        if (postIdMatch) {
            const postId = postIdMatch[1];
            let mainPost = null;
            try {
                const postData = await PostService.getPost(postId);
                if (postData) {
                    mainPost = {
                        ...postData,
                        content: postData.content,
                        createdAt: utils.formatDate(postData.createdAt),
                        updatedAt: postData.updatedAt ? utils.formatDate(postData.updatedAt) : '',
                    };
                    initialData.post = mainPost;
                    initialData.postError = null;

                    const correctSlug = utils.slugify(postData.title);
                    if (!pathname.includes(`/post/${postId}/${correctSlug}`)) {
                        return { redirect: { to: `/post/${postId}/${correctSlug}` } };
                    }
                }
            } catch (error) {
                const status = getStatusCode(error);
                initialData.post = null;
                initialData.postError = status;
                console.error(`SSR Error fetching post ${postId}:`, status);
            }
        } else if (pathname.startsWith('/berita')) {
            const currentCategory = categoryName;

            try {
                const headlineRes = await PostService.searchPost({
                    categoryName: currentCategory,
                    size: 1,
                    page: headlinePage,
                });

                initialData.posts_headline = {
                    data: headlineRes.data
                        ? headlineRes.data.map((p: Post) => ({
                              ...p,
                              createdAt: utils.getRelativeTime(p.createdAt),
                          }))
                        : [],
                    pagination: headlineRes.pagination,
                };
            } catch (error) {
                initialData.posts_headlineError = getStatusCode(error);
            }

            try {
                const topRange = searchParams.get('top_range') || 'all';
                const { start, end } = utils.getDateRangeInUnix(topRange);

                const headlinePostId = initialData.posts_headline?.data?.[0]?.id;
                const excludeIdsForTop = headlinePostId ? String(headlinePostId) : '';
                const topRes = await PostService.searchPost({
                    categoryName: currentCategory,
                    sort: '-view_count',
                    size: 3,
                    page: topPage,
                    startDate: start || undefined,
                    endDate: end || undefined,
                    excludeIds: excludeIdsForTop,
                });

                initialData.posts_top = {
                    data: topRes.data
                        ? topRes.data.map((p: Post) => ({
                              ...p,
                              createdAt: utils.getRelativeTime(p.createdAt),
                          }))
                        : [],
                    pagination: topRes.pagination,
                };
            } catch (error) {
                initialData.posts_topError = getStatusCode(error);
            }
        } else if (pathname.startsWith('/cari')) {
            try {
                const searchRes = await PostService.searchPost({
                    title: searchQuery,
                    categoryName: searchQuery,
                    userName: searchQuery,
                    summary: searchQuery,
                    page: searchPage,
                    size: 5,
                });

                initialData.posts_search = {
                    data: searchRes.data
                        ? searchRes.data.map((p: Post) => ({
                              ...p,
                              createdAt: utils.getRelativeTime(p.createdAt),
                          }))
                        : [],
                    pagination: searchRes.pagination,
                };
            } catch (error) {
                initialData.posts_searchError = getStatusCode(error);
            }
        }
    } catch {
        initialData.generalError = true;
    }

    if (postIdMatch || pathname.startsWith('/berita')) {
        try {
            const excludeIds = [
                ...(initialData.posts_headline?.data || []).map((p: Post) => p.id),
                ...(initialData.posts_top?.data || []).map((p: Post) => p.id),
                ...(initialData.post ? [initialData.post.id] : []),
            ]
                .filter((id): id is number => id != null)
                .join(',');

            const regularRes = await PostService.searchPost({
                categoryName: categoryName,
                size: 5,
                page: regularPage,
                excludeIds,
            });

            initialData.posts_regular = {
                data: regularRes.data
                    ? regularRes.data.map((p: Post) => ({
                          ...p,
                          createdAt: utils.getRelativeTime(p.createdAt),
                      }))
                    : [],
                pagination: regularRes.pagination,
            };
        } catch (error) {
            initialData.posts_regularError = getStatusCode(error);
        }
    }

    return initialData;
}
