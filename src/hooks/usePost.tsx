import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PostService } from '../lib/api/postService.tsx';
import { CategoryService } from '../lib/api/categoryService.tsx';
import { truncateText } from '../lib/utils/truncateText.tsx';
import { Menu } from 'primereact/menu';
import { processContentForEditor } from '../lib/utils/contentProcessor.tsx';
import { slugify } from '../lib/utils/slugify.tsx';
import { getDateRangeInUnix } from '../lib/utils/dateUtils.tsx';
import { getRelativeTime, formatDate } from '../lib/utils/postUtils.tsx';
import { Post } from '../types/post.tsx';
import { MenuItem } from 'primereact/menuitem';
import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Category } from '../types/category.tsx';

const usePost = () => {
    const { pathname, search, state } = useLocation();
    const navigate = useNavigate();
    const queryParams = useMemo(() => new URLSearchParams(search), [search]);
    const params = useParams();

    const [headlinePostPage, setHeadlinePostPage] = useState(1);
    const [topPostPage, setTopPostPage] = useState(1);
    const [regularPostPage, setRegularPostPage] = useState(1);
    const [searchPostPage, setSearchPostPage] = useState(1);

    const isSearchPage = pathname === '/cari';
    const isPostPage = pathname.startsWith('/post/');
    const isHomePage = pathname === '/beranda';
    const isBeritaPage = pathname === '/berita';

    const getCategory = () => {
        if (isHomePage) return 'beranda';
        if (isBeritaPage) return queryParams.get('category')?.toLowerCase() || '';
        return '';
    };
    const currentCategory = getCategory();
    const postId = params.id;
    const slugFromUrl = params.slug;
    const searchQueryFromUrl = queryParams.get('query') || '';
    const topPostRange = queryParams.get('top_range') || 'all';

    const [activeIndex, setActiveIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState(searchQueryFromUrl);
    const menuRef = useRef<Menu>(null);
    const dropdownRef = useRef<Dropdown>(null);

    const { data: categories = [] } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: ({ signal }) =>
            CategoryService.listCategories(signal).then((res) => res.data || []),
    });

    const {
        data: mainPost,
        isLoading: isMainPostLoading,
        isError: isMainPostError,
        isFetching: isMainPostFetching,
    } = useQuery<Post | null>({
        queryKey: ['post', postId],
        queryFn: async () => {
            if (!postId) return null;
            await PostService.incrementViewCount(postId);
            const postData = await PostService.getPost(postId);
            return {
                ...postData,
                content: processContentForEditor(postData.content),
                createdAt: formatDate(postData.createdAt),
                updatedAt: postData.updatedAt ? formatDate(postData.updatedAt) : '',
            };
        },
        enabled: isPostPage && !!postId,
    });

    const {
        data: headlineResult,
        isLoading: isHeadlineLoading,
        isError: isHeadlineError,
    } = useQuery({
        queryKey: ['posts', 'headline', currentCategory, headlinePostPage],
        queryFn: ({ signal }) =>
            PostService.searchPost(
                {
                    categoryName: currentCategory === 'beranda' ? '' : currentCategory,
                    size: 1,
                    page: headlinePostPage,
                },
                signal
            ),
        enabled: !isPostPage && !isSearchPage,
    });
    const headlinePost: Post | null = useMemo(() => {
        const data = headlineResult?.data;
        return Array.isArray(data) && data.length > 0
            ? {
                  ...data[0],
                  createdAt: getRelativeTime(data[0].createdAt),
              }
            : null;
    }, [headlineResult]);

    const {
        data: topPostsResult,
        isLoading: isTopPostsLoading,
        isError: isTopPostsError,
    } = useQuery({
        queryKey: ['posts', 'top', currentCategory, topPostRange, headlinePost?.id, topPostPage],
        queryFn: ({ signal }) => {
            const { start, end } = getDateRangeInUnix(topPostRange);
            const excludeIds = headlinePost?.id != null ? headlinePost.id.toString() : '';
            return PostService.searchPost(
                {
                    categoryName: currentCategory === 'beranda' ? '' : currentCategory,
                    sort: '-view_count',
                    size: 3,
                    page: topPostPage,
                    startDate: start ?? undefined,
                    endDate: end ?? undefined,
                    excludeIds,
                },
                signal
            );
        },
        enabled: !isPostPage && !isSearchPage && !!headlineResult,
    });
    const topPosts: Post[] = useMemo(() => {
        const data = topPostsResult?.data;
        return Array.isArray(data)
            ? data.map((p) => ({ ...p, createdAt: getRelativeTime(p.createdAt) }))
            : [];
    }, [topPostsResult]);

    const regularPostsExcludeIds = useMemo(() => {
        const idsToExclude = isPostPage
            ? [mainPost?.id]
            : [headlinePost?.id, ...(topPostsResult?.data || []).map((p: Post) => p.id)];
        return idsToExclude.filter((id): id is number => id !== null && id !== undefined).join(',');
    }, [isPostPage, mainPost?.id, headlinePost?.id, topPostsResult?.data]);

    const {
        data: regularPostsResult,
        isLoading: isRegularPostsLoading,
        isError: isRegularPostsError,
    } = useQuery({
        queryKey: ['posts', 'regular', currentCategory, regularPostsExcludeIds, regularPostPage],
        queryFn: ({ signal }) => {
            return PostService.searchPost(
                {
                    categoryName: isPostPage
                        ? ''
                        : currentCategory === 'beranda'
                          ? ''
                          : currentCategory,
                    size: 5,
                    page: regularPostPage,
                    excludeIds: regularPostsExcludeIds,
                },
                signal
            );
        },
        enabled: !isSearchPage && (isPostPage ? !!mainPost : !!headlineResult && !!topPostsResult),
    });
    const posts: Post[] = useMemo(() => {
        const data = regularPostsResult?.data;
        return Array.isArray(data)
            ? data.map((p) => ({ ...p, createdAt: getRelativeTime(p.createdAt) }))
            : [];
    }, [regularPostsResult]);

    const {
        data: searchResult,
        isLoading: isSearchLoading,
        isError: isSearchError,
    } = useQuery({
        queryKey: ['posts', 'search', searchQueryFromUrl, searchPostPage],
        queryFn: ({ signal }) =>
            PostService.searchPost(
                {
                    title: searchQueryFromUrl,
                    categoryName: searchQueryFromUrl,
                    userName: searchQueryFromUrl,
                    summary: searchQueryFromUrl,
                    page: searchPostPage,
                },
                signal
            ),
        enabled: isSearchPage,
    });
    const searchPosts: Post[] = useMemo(() => {
        const data = searchResult?.data;
        return Array.isArray(data)
            ? data.map((p) => ({ ...p, createdAt: getRelativeTime(p.createdAt) }))
            : [];
    }, [searchResult]);

    useEffect(() => {
        if (!state?.noScroll) {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }

        dropdownRef.current?.hide();
    }, [pathname, search, state]);

    useEffect(() => {
        if (mainPost && mainPost.title && slugFromUrl && mainPost.id) {
            const correctSlug = slugify(mainPost.title);
            if (slugFromUrl !== correctSlug) {
                navigate(`/post/${mainPost.id}/${correctSlug}`, { replace: true });
            }
        }
    }, [mainPost, slugFromUrl, navigate]);

    useEffect(() => {
        if (isSearchPage || isPostPage) setActiveIndex(-1);
        else if (categories.length > 0) {
            if (currentCategory === 'beranda') {
                setActiveIndex(0);
            } else {
                const primary = categories.slice(0, 3);
                const foundIndex = primary.findIndex(
                    (cat: Category) => cat.name.toLowerCase() === currentCategory
                );
                setActiveIndex(foundIndex !== -1 ? foundIndex + 1 : 4);
            }
        }
    }, [currentCategory, categories, isSearchPage, isPostPage]);

    useEffect(() => {
        setSearchQuery(searchQueryFromUrl);
    }, [searchQueryFromUrl]);

    useEffect(() => {
        if (isSearchPage) {
            setSearchPostPage(1);
        }
    }, [searchQueryFromUrl, isSearchPage]);

    useEffect(() => {
        const handleScroll = (event: Event) => {
            if (menuRef.current) {
                menuRef.current.hide(event as unknown as React.SyntheticEvent);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCategoryChange = useCallback(
        (category: string) => {
            setHeadlinePostPage(1);
            setTopPostPage(1);
            setRegularPostPage(1);
            const lowerCategory = category.toLowerCase();
            if (lowerCategory === 'beranda') {
                navigate('/beranda');
            } else {
                navigate(`/berita?category=${lowerCategory}`);
            }
        },
        [navigate]
    );

    const setTopPostRange = (newRange: string) => {
        const newParams = new URLSearchParams(search);
        if (newRange === 'all') {
            newParams.delete('top_range');
        } else {
            newParams.set('top_range', newRange);
        }
        setTopPostPage(1);
        navigate({ pathname, search: newParams.toString() }, { state: { noScroll: true } });
    };

    const primaryCategories = useMemo(() => categories.slice(0, 3), [categories]);
    const remainingCategories = useMemo(() => categories.slice(3), [categories]);
    const allCategories: MenuItem[] = useMemo(
        () => [
            { label: 'Beranda', command: () => handleCategoryChange('beranda') },
            ...primaryCategories.map((cat: Category) => ({
                label: truncateText(cat.name, 13),
                command: () => handleCategoryChange(cat.name.toLowerCase()),
            })),
            ...(remainingCategories.length > 0
                ? [
                      {
                          label: 'Lainnya',
                          command: (e: { originalEvent: React.MouseEvent; item: MenuItem }) =>
                              menuRef.current?.toggle(e.originalEvent),
                      },
                  ]
                : []),
        ],
        [primaryCategories, remainingCategories, handleCategoryChange]
    );
    const moreCategories: MenuItem[] = useMemo(
        () =>
            remainingCategories.map((cat: Category) => ({
                label: truncateText(cat.name, 13),
                command: () => handleCategoryChange(cat.name.toLowerCase()),
            })),
        [remainingCategories, handleCategoryChange]
    );

    return {
        categories,
        headlinePost,
        topPosts,
        posts,
        searchPosts,
        mainPost,
        loading:
            isMainPostLoading ||
            isHeadlineLoading ||
            isTopPostsLoading ||
            isRegularPostsLoading ||
            isSearchLoading ||
            isMainPostFetching,
        error:
            isMainPostError ||
            isHeadlineError ||
            isTopPostsError ||
            isRegularPostsError ||
            isSearchError,
        notFound: isPostPage && !isMainPostLoading && !mainPost,
        activeIndex,
        setActiveIndex,
        searchQuery,
        setSearchQuery,
        menuRef,
        dropdownRef,
        allCategories,
        moreCategories,
        handleCategoryChange,
        isSearchPage,
        isPostPage,
        topPostRange,
        setTopPostRange,
        headlinePostPage,
        setHeadlinePostPage,
        headlinePostPagination: headlineResult?.pagination,
        topPostPage,
        setTopPostPage,
        topPostPagination: topPostsResult?.pagination,
        regularPostPage,
        setRegularPostPage,
        regularPostPagination: regularPostsResult?.pagination,
        searchPostPage,
        setSearchPostPage,
        searchPostPagination: searchResult?.pagination,
        sizes: { headline: 1, top: 3, regular: 5, search: 5 },
    };
};

export default usePost;
