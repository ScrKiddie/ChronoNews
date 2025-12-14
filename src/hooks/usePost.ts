import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PostService } from '../services/postService.ts';
import { CategoryService } from '../services/categoryService.ts';
import { truncateText, slugify, getDateRangeInUnix } from '../utils/postUtils.ts';
import { Menu } from 'primereact/menu';
import { getRelativeTime, formatDate } from '../utils/postUtils.ts';
import { Post } from '../types/post.ts';
import { MenuItem } from 'primereact/menuitem';
import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Category } from '../types/category.ts';
import { InitialDataStructure } from '../types/initialData.ts';

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
            (shouldFetchSpecificData('post', 'postError') ||
                manualData?.post?.id !== parseInt(postId || '0')) &&
            isPostPage &&
            !!postId,
        staleTime: 0,
        gcTime: 0,
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

        if (isSearchPage) {
            if (
                searchQueryQuery.isSuccess ||
                (manualData?.posts_search?.data && !manualData.posts_searchError)
            ) {
                return false;
            }
            return searchQueryQuery.isError || !!manualData?.posts_searchError;
        }

        if (isPostPage) {
            if (mainPostQuery.isSuccess || (manualData?.post && !manualData.postError)) {
                return false;
            }
            if (mainPostQuery.isError || !!manualData?.postError) return true;
        }

        if (categoriesQuery.isError || manualData?.generalError) return true;

        return (
            headlineQuery.isError ||
            !!manualData?.posts_headlineError ||
            topPostsQuery.isError ||
            !!manualData?.posts_topError ||
            regularPostsQuery.isError ||
            !!manualData?.posts_regularError
        );
    }, [
        isAnyFetching,
        isSearchPage,
        isPostPage,
        categoriesQuery.isError,
        manualData,
        searchQueryQuery.isError,
        searchQueryQuery.isSuccess,
        mainPostQuery.isError,
        mainPostQuery.isSuccess,
        headlineQuery.isError,
        topPostsQuery.isError,
        regularPostsQuery.isError,
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

    useEffect(() => {
        const isMainContentSafe =
            (isSearchPage && searchQueryQuery.isSuccess) || (isPostPage && mainPostQuery.isSuccess);

        const isCategoriesBroken =
            (categoriesQuery.isError || !categories) &&
            !categoriesQuery.isFetching &&
            !categoriesQuery.isLoading;

        if (categoriesQuery.isSuccess && categories && categories.length === 0) {
            return;
        }

        if (isMainContentSafe && isCategoriesBroken) {
            categoriesQuery.refetch();

            if (manualData?.generalError) {
                setManualData((prev) => {
                    if (!prev) return undefined;
                    const n = { ...prev };
                    delete n.generalError;
                    return n;
                });
            }
        }
    }, [
        isSearchPage,
        searchQueryQuery.isSuccess,
        isPostPage,
        mainPostQuery.isSuccess,
        categoriesQuery.isError,
        categoriesQuery.isFetching,
        categoriesQuery.isLoading,
        categoriesQuery.isSuccess,
        categories,
        manualData?.generalError,
        categoriesQuery,
    ]);

    useEffect(() => {
        if (!state?.noScroll) {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
        dropdownRef.current?.hide();
    }, [pathname, search, state]);

    useEffect(() => {
        if (isPostPage && postId) {
            if (manualData?.post?.id !== parseInt(postId)) {
                setManualData((prevData) => {
                    if (!prevData) return undefined;
                    const newData = { ...prevData };
                    delete newData.post;
                    delete newData.posts_regular;
                    return newData;
                });
                viewIncrementedRef.current = false;
            }
        } else if (!isPostPage && manualData?.post) {
            setManualData((prev) => {
                if (!prev) return undefined;
                const newData = { ...prev };
                delete newData.post;
                return newData;
            });
        }
    }, [postId, isPostPage, manualData?.post?.id, manualData?.post]);

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
            if (isFullRetry) {
                setManualData((prev) => {
                    if (!prev) return undefined;
                    if (prev.categories && !prev.generalError) {
                        return { categories: prev.categories };
                    }
                    return undefined;
                });

                viewIncrementedRef.current = false;

                await queryClient.resetQueries({
                    predicate: (query) => {
                        const key = query.queryKey[0];
                        if (key === 'post' || key === 'posts') return true;
                        if (key === 'categories') {
                            const data = query.state.data as Category[] | undefined;
                            return query.state.status === 'error' || !data || data.length === 0;
                        }
                        return false;
                    },
                });
                return;
            }

            if (!manualData) {
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
            }

            const newManualData = { ...manualData };
            let hasChanges = false;

            const clearError = (
                dataKey: keyof InitialDataStructure,
                errorKey: keyof InitialDataStructure
            ) => {
                if (
                    manualData[errorKey] ||
                    (dataKey === 'categories' &&
                        (!manualData[dataKey] || manualData[dataKey]?.length === 0))
                ) {
                    if (dataKey === 'categories')
                        queryClient.resetQueries({ queryKey: ['categories'] });
                    delete newManualData[errorKey];
                    delete newManualData[dataKey];
                    hasChanges = true;
                }
            };

            if (
                manualData.generalError ||
                !manualData.categories ||
                manualData.categories.length === 0
            ) {
                queryClient.resetQueries({ queryKey: ['categories'] });
                delete newManualData.generalError;
                delete newManualData.categories;
                hasChanges = true;
            }

            if (manualData.postError) clearError('post', 'postError');
            if (manualData.posts_headlineError) clearError('posts_headline', 'posts_headlineError');
            if (manualData.posts_topError) clearError('posts_top', 'posts_topError');
            if (manualData.posts_regularError) clearError('posts_regular', 'posts_regularError');
            if (manualData.posts_searchError) clearError('posts_search', 'posts_searchError');

            if (hasChanges)
                setManualData(Object.keys(newManualData).length > 0 ? newManualData : undefined);

            return queryClient.resetQueries({
                predicate: (query) => {
                    const key = query.queryKey[0];
                    const status = query.state.status;
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

    const notFound = useMemo(() => {
        if (isSearchPage && (!searchQueryFromUrl || searchQueryFromUrl.trim() === '')) {
            return true;
        }

        return isPostPage && !mainPostQuery.isLoading && !mainPostQuery.isError && !mainPost;
    }, [
        isSearchPage,
        searchQueryFromUrl,
        isPostPage,
        mainPostQuery.isLoading,
        mainPostQuery.isError,
        mainPost,
    ]);

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
