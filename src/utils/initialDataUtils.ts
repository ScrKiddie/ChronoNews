import { PostService } from '../services/postService.ts';
import { CategoryService } from '../services/categoryService.ts';
import { formatDate, getRelativeTime } from './postUtils.ts';
import { slugify } from './postUtils.ts';
import { getDateRangeInUnix } from './postUtils.ts';
import { Post } from '../types/post.ts';
import { InitialDataStructure } from '../types/initialData.ts';

export default async function initialDataUtils(pathname: string, searchParams: URLSearchParams) {
    const utils = {
        formatDate,
        getRelativeTime,
        slugify,
        getDateRangeInUnix,
    };

    const initialData: InitialDataStructure = {};
    const postIdMatch = pathname.match(/\/post\/(\d+)/);
    const categoryName = searchParams.get('category')?.toLowerCase() || '';
    const searchQuery = searchParams.get('query') || '';

    const headlinePage = parseInt(searchParams.get('headline_page') || '1', 10);
    const topPage = parseInt(searchParams.get('top_page') || '1', 10);
    const regularPage = parseInt(searchParams.get('regular_page') || '1', 10);
    const searchPage = parseInt(searchParams.get('search_page') || '1', 10);

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

                    const correctSlug = utils.slugify(postData.title);
                    if (!pathname.includes(`/post/${postId}/${correctSlug}`)) {
                        return { redirect: { to: `/post/${postId}/${correctSlug}` } };
                    }
                }
            } catch {
                initialData.postError = true;
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
            } catch {
                initialData.posts_headlineError = true;
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
            } catch {
                initialData.posts_topError = true;
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
            } catch {
                initialData.posts_searchError = true;
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
        } catch {
            initialData.posts_regularError = true;
        }
    }

    return initialData;
}
