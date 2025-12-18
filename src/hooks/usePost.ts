import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PostService } from '../services/postService.ts';
import { CategoryService } from '../services/categoryService.ts';
import {
    truncateText,
    slugify,
    getDateRangeInUnix,
    getRelativeTime,
    formatDate,
} from '../utils/postUtils.ts';
import { Menu } from 'primereact/menu';
import { Post } from '../types/post.ts';
import { MenuItem } from 'primereact/menuitem';
import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Category } from '../types/category.ts';
import { InitialDataStructure } from '../types/initialData.ts';

interface ApiError {
    response?: {
        status?: number;
    };
    status?: number;
}

const usePost = (InitialDataProp: InitialDataStructure | undefined, isDesktop: boolean) => {
    const { pathname, search, state } = useLocation();
    const navigate = useNavigate();
    const queryParams = useMemo(() => new URLSearchParams(search), [search]);
    const params = useParams();
    const queryClient = useQueryClient();

    const [manualData, setManualData] = useState<InitialDataStructure | undefined>(InitialDataProp);

    const headlinePostPage = parseInt(queryParams.get('headline_page') || '1');
    const topPostPage = parseInt(queryParams.get('top_page') || '1');
    const regularPostPage = parseInt(queryParams.get('regular_page') || '1');
    const searchPostPage = parseInt(queryParams.get('search_page') || '1');

    const isSearchPage = pathname === '/cari';
    const isPostPage = pathname.startsWith('/post/');

    const isHomePage = pathname === '/berita' && !queryParams.get('category');
    const isBeritaPage = pathname.startsWith('/berita');

    const getCategory = () => {
        if (isBeritaPage) {
            return queryParams.get('category')?.toLowerCase() || '';
        }
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

    const viewIncrementedRef = useRef(false);

    const prevPostIdRef = useRef<string | undefined>(postId);
    const isFirstRender = useRef(true);

    const isValidPostId = useMemo(() => {
        if (!isPostPage || !postId) return false;
        const isNumeric = /^\d+$/.test(postId);
        if (!isNumeric) return false;
        const num = parseInt(postId, 10);
        const MAX_INT32 = 2147483647;
        return num > 0 && num <= MAX_INT32;
    }, [isPostPage, postId]);

    const shouldFetchSpecificData = useCallback(
        (dataKey: keyof InitialDataStructure, errorKey: keyof InitialDataStructure) => {
            const hasData = !!manualData?.[dataKey];
            const hasError = !!manualData?.[errorKey];
            return !manualData || !hasData || (hasError && !hasData);
        },
        [manualData]
    );

    const categoriesQuery = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: ({ signal }) =>
            CategoryService.listCategories(signal).then((res) => res.data || []),
        enabled: shouldFetchSpecificData('categories', 'generalError'),
        staleTime: 5 * 60 * 1000,
        initialData: manualData?.categories,
        initialDataUpdatedAt: manualData?.categories ? Date.now() : undefined,
    });

    const categories = useMemo(() => {
        return manualData?.categories ?? categoriesQuery.data ?? [];
    }, [manualData?.categories, categoriesQuery.data]);

    const mainPostQuery = useQuery<Post | null>({
        queryKey: ['post', postId],
        queryFn: async () => {
            if (!postId) return null;
            const postData = await PostService.getPost(postId);
            return {
                ...postData,
                content: postData.content,
                createdAt: formatDate(postData.createdAt),
                updatedAt: postData.updatedAt ? formatDate(postData.updatedAt) : '',
            };
        },
        enabled:
            isValidPostId &&
            manualData?.postError !== 404 &&
            (shouldFetchSpecificData('post', 'postError') ||
                manualData?.post?.id !== parseInt(postId || '0')) &&
            isPostPage &&
            !!postId,
        staleTime: 0,
        gcTime: 0,
        retry: (failureCount, error) => {
            const err = error as unknown as ApiError;
            const status = err?.response?.status || err?.status;
            if (status === 404) return false;
            return failureCount < 3;
        },
    });

    const mainPost = useMemo(() => {
        if (isPostPage && postId) {
            if (manualData?.post?.id === parseInt(postId)) {
                return {
                    ...manualData.post,
                    content: manualData.post.content,
                    createdAt: formatDate(manualData.post.createdAt),
                    updatedAt: manualData.post.updatedAt
                        ? formatDate(manualData.post.updatedAt)
                        : '',
                };
            }
            return mainPostQuery.data;
        }
        return manualData?.post
            ? {
                  ...manualData.post,
                  content: manualData.post.content,
                  createdAt: formatDate(manualData.post.createdAt),
                  updatedAt: manualData.post.updatedAt ? formatDate(manualData.post.updatedAt) : '',
              }
            : mainPostQuery.data;
    }, [manualData?.post, mainPostQuery.data, postId, isPostPage]);

    const headlineQueryKey = ['posts', 'headline', currentCategory, headlinePostPage];
    const headlineQueryEnabled = !isPostPage && !isSearchPage;

    const headlineQuery = useQuery({
        queryKey: headlineQueryKey,
        queryFn: ({ signal }) => {
            return PostService.searchPost(
                { categoryName: currentCategory, size: 1, page: headlinePostPage },
                signal
            );
        },
        enabled:
            shouldFetchSpecificData('posts_headline', 'posts_headlineError') &&
            headlineQueryEnabled,
        staleTime: 0,
        gcTime: 0,
    });
    const headlineResult = manualData?.posts_headline ?? headlineQuery.data;

    const headlinePost: Post | null = useMemo(() => {
        const data = headlineResult?.data;
        return Array.isArray(data) && data.length > 0
            ? { ...data[0], createdAt: getRelativeTime(data[0].createdAt) }
            : null;
    }, [headlineResult]);

    const topPostsQuery = useQuery({
        queryKey: ['posts', 'top', currentCategory, topPostRange, headlinePost?.id, topPostPage],
        queryFn: ({ signal }) => {
            const { start, end } = getDateRangeInUnix(topPostRange);
            const excludeIds = headlinePost?.id != null ? headlinePost.id.toString() : '';
            return PostService.searchPost(
                {
                    categoryName: currentCategory,
                    sort: '-view_count',
                    size: 3,
                    page: topPostPage,
                    startDate: start || undefined,
                    endDate: end || undefined,
                    excludeIds,
                },
                signal
            );
        },
        enabled:
            shouldFetchSpecificData('posts_top', 'posts_topError') &&
            !isPostPage &&
            !isSearchPage &&
            !!headlineResult,
        staleTime: 0,
        gcTime: 0,
    });
    const topPostsResult = manualData?.posts_top ?? topPostsQuery.data;
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

    const regularPostsQuery = useQuery({
        queryKey: ['posts', 'regular', currentCategory, regularPostsExcludeIds, regularPostPage],
        queryFn: ({ signal }) => {
            return PostService.searchPost(
                {
                    categoryName: isPostPage ? '' : currentCategory,
                    size: 5,
                    page: regularPostPage,
                    excludeIds: regularPostsExcludeIds,
                },
                signal
            );
        },
        enabled:
            shouldFetchSpecificData('posts_regular', 'posts_regularError') &&
            !isSearchPage &&
            (isPostPage ? !!mainPost : !!headlineResult && !!topPostsResult),
        staleTime: 0,
        gcTime: 0,
    });
    const regularPostsResult = manualData?.posts_regular ?? regularPostsQuery.data;
    const posts: Post[] = useMemo(() => {
        let dataSource = regularPostsResult;
        if (isPostPage && postId && manualData?.post?.id !== parseInt(postId)) {
            dataSource = regularPostsQuery.data;
        }
        const data = dataSource?.data;
        return Array.isArray(data)
            ? data.map((p) => ({ ...p, createdAt: getRelativeTime(p.createdAt) }))
            : [];
    }, [regularPostsResult, regularPostsQuery.data, isPostPage, postId, manualData?.post?.id]);

    const searchQueryQuery = useQuery({
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
        enabled:
            shouldFetchSpecificData('posts_search', 'posts_searchError') &&
            isSearchPage &&
            !!searchQueryFromUrl.trim(),
        staleTime: 0,
        gcTime: 0,
    });

    const searchResult = manualData?.posts_search ?? searchQueryQuery.data;
    const searchPosts: Post[] = useMemo(() => {
        const data = searchResult?.data;
        return Array.isArray(data)
            ? data.map((p) => ({ ...p, createdAt: getRelativeTime(p.createdAt) }))
            : [];
    }, [searchResult]);

    const isAnyFetching = useMemo(() => {
        return (
            categoriesQuery.isFetching ||
            mainPostQuery.isFetching ||
            headlineQuery.isFetching ||
            topPostsQuery.isFetching ||
            regularPostsQuery.isFetching ||
            searchQueryQuery.isFetching
        );
    }, [
        categoriesQuery.isFetching,
        mainPostQuery.isFetching,
        headlineQuery.isFetching,
        topPostsQuery.isFetching,
        regularPostsQuery.isFetching,
        searchQueryQuery.isFetching,
    ]);

    const computedError = useMemo(() => {
        if (isAnyFetching) return false;
        if (manualData?.postError === 404) return false;
        if (isPostPage && !isValidPostId) return false;

        if (isSearchPage) {
            if (searchQueryQuery.isSuccess) return false;
            if (manualData?.posts_search?.data && !manualData.posts_searchError) return false;
            return searchQueryQuery.isError || !!manualData?.posts_searchError;
        }

        if (isPostPage) {
            if (mainPostQuery.isSuccess) return false;
            if (manualData?.post && !manualData.postError) return false;

            if (mainPostQuery.isError) {
                const err = mainPostQuery.error as unknown as ApiError;
                const status = err?.response?.status || err?.status;
                if (status === 404) return false;
                return true;
            }

            if (manualData?.postError && manualData.postError !== 404) {
                return true;
            }
            return false;
        }

        const isContentSuccess = regularPostsQuery.isSuccess || headlineQuery.isSuccess;
        if (isContentSuccess) return false;

        const isCategoriesError =
            categoriesQuery.isError || (!!manualData?.generalError && !categoriesQuery.isSuccess);
        const isHeadlineError =
            headlineQuery.isError ||
            (!!manualData?.posts_headlineError &&
                !headlineQuery.isSuccess &&
                manualData.posts_headlineError !== 404);
        const isTopError =
            topPostsQuery.isError ||
            (!!manualData?.posts_topError &&
                !topPostsQuery.isSuccess &&
                manualData.posts_topError !== 404);
        const isRegularError =
            regularPostsQuery.isError ||
            (!!manualData?.posts_regularError &&
                !regularPostsQuery.isSuccess &&
                manualData.posts_regularError !== 404);

        return isCategoriesError || isHeadlineError || isTopError || isRegularError;
    }, [
        isAnyFetching,
        isSearchPage,
        isPostPage,
        isValidPostId,
        categoriesQuery.isError,
        categoriesQuery.isSuccess,
        manualData,
        searchQueryQuery.isError,
        searchQueryQuery.isSuccess,
        mainPostQuery.isError,
        mainPostQuery.isSuccess,
        mainPostQuery.error,
        headlineQuery.isError,
        headlineQuery.isSuccess,
        topPostsQuery.isError,
        topPostsQuery.isSuccess,
        regularPostsQuery.isError,
        regularPostsQuery.isSuccess,
    ]);

    const loading = useMemo(
        () =>
            isAnyFetching ||
            mainPostQuery.isLoading ||
            headlineQuery.isLoading ||
            topPostsQuery.isLoading ||
            regularPostsQuery.isLoading ||
            searchQueryQuery.isLoading,
        [
            isAnyFetching,
            mainPostQuery.isLoading,
            headlineQuery.isLoading,
            topPostsQuery.isLoading,
            regularPostsQuery.isLoading,
            searchQueryQuery.isLoading,
        ]
    );

    const notFound = useMemo(() => {
        if (isSearchPage && (!searchQueryFromUrl || searchQueryFromUrl.trim() === '')) {
            return true;
        }
        if (manualData?.postError === 404) {
            return true;
        }
        if (isPostPage) {
            if (!isValidPostId) return true;
            const err = mainPostQuery.error as unknown as ApiError;
            const status = err?.response?.status || err?.status;
            if (status === 404) return true;
            if (mainPostQuery.isSuccess && !mainPost) {
                return true;
            }
            if (mainPostQuery.isError && !mainPostQuery.isLoading) {
                if (status === 404) return true;
            }
        }
        return false;
    }, [
        isSearchPage,
        searchQueryFromUrl,
        isPostPage,
        isValidPostId,
        manualData?.postError,
        mainPostQuery.error,
        mainPostQuery.isSuccess,
        mainPostQuery.isLoading,
        mainPostQuery.isError,
        mainPost,
    ]);

    useEffect(() => {
        if (isPostPage && mainPostQuery.isError) {
            const err = mainPostQuery.error as unknown as ApiError;
            const status = err?.response?.status || err?.status;
            if (status === 404) {
                setManualData((prev) => {
                    if (prev?.postError === 404) return prev;
                    return { ...prev, postError: 404, post: undefined };
                });
            }
        }
    }, [isPostPage, mainPostQuery.isError, mainPostQuery.error]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const cachedCategories = queryClient.getQueryData<Category[]>(['categories']);

        const isCategoriesMissing = !cachedCategories || cachedCategories.length === 0;
        const hasManualError = !!manualData?.generalError;
        const hasQueryError = categoriesQuery.isError;

        if (isCategoriesMissing || hasManualError || hasQueryError) {
            queryClient.resetQueries({ queryKey: ['categories'] });
        }

        setManualData((prev) => {
            if (!prev) return undefined;
            const newData = { ...prev };

            delete newData.posts_headline;
            delete newData.posts_top;
            delete newData.posts_regular;
            delete newData.posts_search;
            delete newData.post;

            delete newData.generalError;
            delete newData.postError;
            delete newData.posts_headlineError;
            delete newData.posts_topError;
            delete newData.posts_regularError;
            delete newData.posts_searchError;

            return newData;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, search]);

    useEffect(() => {
        if (isPostPage && postId) {
            if (prevPostIdRef.current !== postId) {
                setManualData((prevData) => {
                    if (!prevData) return undefined;
                    const newData = { ...prevData };
                    delete newData.post;
                    delete newData.posts_regular;
                    delete newData.postError;
                    delete newData.posts_regularError;
                    return newData;
                });
                viewIncrementedRef.current = false;
            }
        } else if (!isPostPage) {
            if (manualData?.post || manualData?.postError || manualData?.posts_regularError) {
                setManualData((prev) => {
                    if (!prev) return undefined;
                    const newData = { ...prev };
                    delete newData.post;
                    delete newData.postError;
                    delete newData.posts_regular;
                    delete newData.posts_regularError;
                    return newData;
                });
            }
        }
        prevPostIdRef.current = postId;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postId, isPostPage, manualData?.post, manualData?.postError]);

    useEffect(() => {
        let hasChanges = false;
        const newData = manualData ? { ...manualData } : undefined;
        if (!newData) return;

        if (categoriesQuery.isSuccess && newData.generalError) {
            delete newData.generalError;
            hasChanges = true;
        }
        if (headlineQuery.isSuccess && newData.posts_headlineError) {
            delete newData.posts_headlineError;
            hasChanges = true;
        }
        if (topPostsQuery.isSuccess && newData.posts_topError) {
            delete newData.posts_topError;
            hasChanges = true;
        }
        if (regularPostsQuery.isSuccess && newData.posts_regularError) {
            delete newData.posts_regularError;
            hasChanges = true;
        }
        if (searchQueryQuery.isSuccess && newData.posts_searchError) {
            delete newData.posts_searchError;
            hasChanges = true;
        }
        if (mainPostQuery.isSuccess && newData.postError) {
            delete newData.postError;
            hasChanges = true;
        }

        if (hasChanges) setManualData(newData);
    }, [
        categoriesQuery.isSuccess,
        headlineQuery.isSuccess,
        topPostsQuery.isSuccess,
        regularPostsQuery.isSuccess,
        searchQueryQuery.isSuccess,
        mainPostQuery.isSuccess,
        manualData,
    ]);

    useEffect(() => {
        if (!state?.noScroll) {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
        dropdownRef.current?.hide();
    }, [pathname, search, state]);

    useEffect(() => {
        viewIncrementedRef.current = false;
    }, [postId]);

    useEffect(() => {
        if (isPostPage && mainPost && !viewIncrementedRef.current) {
            viewIncrementedRef.current = true;
            PostService.incrementViewCount(mainPost.id).catch((error) => {
                console.error('Failed to increment view count for post', mainPost.id, ':', error);
            });
        }
    }, [isPostPage, mainPost]);

    useEffect(() => {
        if (mainPost && mainPost.title && slugFromUrl && mainPost.id) {
            const correctSlug = slugify(mainPost.title);
            if (slugFromUrl !== correctSlug) {
                navigate(`/post/${mainPost.id}/${correctSlug}`, { replace: true });
            }
        }
    }, [mainPost, slugFromUrl, navigate]);

    useEffect(() => {
        if (isSearchPage || isPostPage) {
            setActiveIndex(-1);
        } else if (isHomePage) {
            setActiveIndex(0);
        } else if (!categories || categories.length === 0) {
            setActiveIndex(-1);
        } else {
            if (isDesktop) {
                const primary = categories.slice(0, 3);
                const foundIndex = primary.findIndex(
                    (cat: Category) => cat.name.toLowerCase() === currentCategory
                );
                setActiveIndex(foundIndex !== -1 ? foundIndex + 1 : 4);
            } else {
                const foundIndex = categories.findIndex(
                    (cat: Category) => cat.name.toLowerCase() === currentCategory
                );
                setActiveIndex(foundIndex !== -1 ? foundIndex + 1 : 0);
            }
        }
    }, [currentCategory, categories, isSearchPage, isPostPage, isHomePage, isDesktop]);

    useEffect(() => {
        setSearchQuery(searchQueryFromUrl);
    }, [searchQueryFromUrl]);

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
            const lowerCategory = category.toLowerCase();
            const currentLowerCategory = currentCategory.toLowerCase();

            if (
                (lowerCategory === 'beranda' && isHomePage) ||
                (lowerCategory === currentLowerCategory && !isHomePage)
            ) {
                return;
            }

            const newParams = new URLSearchParams();

            if (lowerCategory !== 'beranda') {
                newParams.set('category', lowerCategory);
            }

            const topRange = queryParams.get('top_range');
            if (topRange) {
                newParams.set('top_range', topRange);
            }

            const targetPath = `/berita`;

            setManualData((prevData) => {
                if (!prevData) return undefined;
                const newData = { ...prevData };

                delete newData.posts_headline;
                delete newData.posts_top;
                delete newData.posts_regular;
                delete newData.posts_search;

                delete newData.generalError;
                delete newData.posts_headlineError;
                delete newData.posts_topError;
                delete newData.posts_regularError;
                delete newData.posts_searchError;

                return newData;
            });

            viewIncrementedRef.current = false;
            navigate({ pathname: targetPath, search: newParams.toString() });
        },
        [navigate, queryParams, currentCategory, isHomePage]
    );

    const setTopPostRange = (newRange: string) => {
        const newParams = new URLSearchParams(search);
        if (newRange === 'all') {
            newParams.delete('top_range');
        } else {
            newParams.set('top_range', newRange);
        }
        newParams.delete('top_page');

        setManualData((prevData) => {
            if (!prevData) return undefined;
            const newData = { ...prevData };
            delete newData.posts_top;
            delete newData.posts_regular;
            delete newData.posts_topError;
            delete newData.posts_regularError;
            return newData;
        });

        navigate({ pathname, search: newParams.toString() }, { state: { noScroll: true } });
    };

    const handlePageChange = useCallback(
        (type: 'headline' | 'top' | 'regular' | 'search', page: number) => {
            const newParams = new URLSearchParams(search);
            const pageParam = `${type}_page`;

            if (page === 1) {
                newParams.delete(pageParam);
            } else {
                newParams.set(pageParam, page.toString());
            }

            if (isPostPage && type === 'regular') {
                setManualData((prevData) => {
                    if (!prevData) return undefined;
                    const newData = { ...prevData };
                    delete newData.posts_regular;
                    delete newData.posts_regularError;
                    return newData;
                });
            } else {
                setManualData((prevData) => {
                    if (!prevData) return undefined;
                    const newData = { ...prevData };
                    delete newData.posts_headline;
                    delete newData.posts_top;
                    delete newData.posts_regular;
                    delete newData.posts_search;

                    delete newData.posts_headlineError;
                    delete newData.posts_topError;
                    delete newData.posts_regularError;
                    delete newData.posts_searchError;
                    return newData;
                });
            }

            navigate({ pathname, search: newParams.toString() }, { state: { noScroll: true } });
        },
        [navigate, pathname, search, isPostPage]
    );

    const refetchAll = useCallback(
        async (isFullRetry = false) => {
            if (manualData) {
                setManualData((prev) => {
                    if (!prev) return undefined;
                    const newData = { ...prev };

                    delete newData.generalError;
                    delete newData.postError;
                    delete newData.posts_headlineError;
                    delete newData.posts_topError;
                    delete newData.posts_regularError;
                    delete newData.posts_searchError;

                    if (isFullRetry) {
                        delete newData.categories;
                    }

                    return newData;
                });
            }

            if (isFullRetry) {
                viewIncrementedRef.current = false;
                await queryClient.resetQueries({
                    predicate: (query) => {
                        const key = query.queryKey[0];
                        if (key === 'post' || key === 'posts' || key === 'categories') return true;
                        return false;
                    },
                });
                return;
            }

            return queryClient.resetQueries({
                predicate: (query) => {
                    const key = query.queryKey[0];
                    const status = query.state.status;

                    if (key === 'categories') {
                        const data = query.state.data as Category[] | undefined;
                        return status === 'error' || !data || data.length === 0;
                    }

                    if (key === 'post' || key === 'posts') {
                        if (status === 'success') return false;
                        return true;
                    }
                    return false;
                },
            });
        },
        [queryClient, manualData]
    );

    const primaryCategories = useMemo(() => categories.slice(0, 3), [categories]);
    const remainingCategories = useMemo(() => categories.slice(3), [categories]);

    const allDesktopCategories: MenuItem[] = useMemo(
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

    const allMobileCategories: MenuItem[] = useMemo(
        () => [
            { label: 'Beranda', command: () => handleCategoryChange('beranda') },
            ...categories.map((cat: Category) => ({
                label: truncateText(cat.name, 13),
                command: () => handleCategoryChange(cat.name.toLowerCase()),
            })),
        ],
        [categories, handleCategoryChange]
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
        loading,
        error: computedError,
        notFound,
        activeIndex,
        setActiveIndex,
        searchQuery,
        setSearchQuery,
        menuRef,
        dropdownRef,
        allDesktopCategories,
        allMobileCategories,
        moreCategories,
        handleCategoryChange,
        isSearchPage,
        isPostPage,
        topPostRange,
        setTopPostRange,
        headlinePostPage,
        topPostPage,
        regularPostPage,
        searchPostPage,
        headlinePostPagination: headlineResult?.pagination,
        topPostPagination: topPostsResult?.pagination,
        regularPostPagination: regularPostsResult?.pagination,
        searchPostPagination: searchResult?.pagination,
        sizes: { headline: 1, top: 3, regular: 5, search: 5 },
        handlePageChange,
        refetchAll,
    };
};

export default usePost;
