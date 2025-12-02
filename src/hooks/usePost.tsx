import {useState, useEffect, useRef, useMemo} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {PostService} from "../services/postService.tsx";
import {CategoryService} from "../services/categoryService.tsx";
import {truncateText} from "../utils/truncateText.tsx";
import {Menu} from "primereact/menu";
import {processContentForEditor} from "../utils/contentProcessor.tsx";
import {slugify} from "../utils/slugify.tsx";
import {getDateRangeInUnix} from "../utils/dateUtils.tsx";
import { getRelativeTime, formatDate } from "../utils/postUtils.tsx";

const usePost = () => {
    const {pathname, search} = useLocation();
    const params = useParams();
    const navigate = useNavigate();
    const queryParams = useMemo(() => new URLSearchParams(search), [search]);

    const [headlinePostPage, setHeadlinePostPage] = useState(1);
    const [topPostPage, setTopPostPage] = useState(1);
    const [regularPostPage, setRegularPostPage] = useState(1);
    const [searchPostPage, setSearchPostPage] = useState(1);

    const isSearchPage = pathname === '/search';
    const isPostPage = pathname.startsWith('/post/');
    const isHomePage = pathname === '/beranda';
    
    const currentCategory = params.category?.toLowerCase() || (isHomePage ? 'beranda' : '');
    const postId = params.id;
    const slugFromUrl = params.slug;
    const searchQueryFromUrl = queryParams.get('q') || "";

    const [activeIndex, setActiveIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState(searchQueryFromUrl);
    const menuRef = useRef<Menu>(null);
    const [topPostRange, setTopPostRange] = useState('all');

    const {data: categories = []} = useQuery({
        queryKey: ['categories'],
        queryFn: ({ signal }) => CategoryService.listCategories(signal).then(res => res.data || []),
    });

    const {data: mainPost, isLoading: isMainPostLoading, isError: isMainPostError, isFetching: isMainPostFetching} = useQuery({
        queryKey: ['post', postId],
        queryFn: async () => {
            await PostService.incrementViewCount(postId!);
            const postData = await PostService.getPost(postId!);
            return {...postData, content: processContentForEditor(postData.content), createdAt: formatDate(postData.createdAt), updatedAt: postData.updatedAt ? formatDate(postData.updatedAt) : ""};
        },
        enabled: isPostPage && !!postId,
    });

    const {data: headlineResult, isLoading: isHeadlineLoading, isError: isHeadlineError} = useQuery({
        queryKey: ['posts', 'headline', currentCategory, headlinePostPage],
        queryFn: ({ signal }) => PostService.searchPost({categoryName: currentCategory === 'beranda' ? '' : currentCategory, size: 1, page: headlinePostPage}, signal),
        enabled: !isPostPage && !isSearchPage,
    });
    const headlinePost = useMemo(() => {
        const data = headlineResult?.data;
        return (Array.isArray(data) && data.length > 0) ? {...data[0], createdAt: getRelativeTime(data[0].createdAt)} : null;
    }, [headlineResult]);

    const {data: topPostsResult, isLoading: isTopPostsLoading, isError: isTopPostsError} = useQuery({
        queryKey: ['posts', 'top', currentCategory, topPostRange, headlinePost?.id, topPostPage],
        queryFn: ({ signal }) => {
            const { start, end } = getDateRangeInUnix(topPostRange);
            const excludeIds = [headlinePost?.id].filter(Boolean).join(',');
            return PostService.searchPost({categoryName: currentCategory === 'beranda' ? '' : currentCategory, sort: '-view_count', size: 3, page: topPostPage, startDate: start, endDate: end, excludeIds}, signal);
        },
        enabled: !isPostPage && !isSearchPage && !!headlineResult,
    });
    const topPosts = useMemo(() => {
        const data = topPostsResult?.data;
        return Array.isArray(data) ? data.map(p => ({...p, createdAt: getRelativeTime(p.createdAt)})) : [];
    }, [topPostsResult]);

    const {data: regularPostsResult, isLoading: isRegularPostsLoading, isError: isRegularPostsError} = useQuery({
        queryKey: ['posts', 'regular', currentCategory, topPosts, mainPost?.id, regularPostPage],
        queryFn: ({ signal }) => {
            const idsToExclude = isPostPage ? [mainPost?.id] : [headlinePost?.id, ...topPosts.map(p => p.id)];
            const excludeIds = idsToExclude.filter(Boolean).join(',');
            return PostService.searchPost({categoryName: isPostPage ? '' : (currentCategory === 'beranda' ? '' : currentCategory), size: 5, page: regularPostPage, excludeIds}, signal);
        },
        enabled: !isSearchPage && (isPostPage ? !!mainPost : !!topPostsResult),
    });
    const posts = useMemo(() => {
        const data = regularPostsResult?.data;
        return Array.isArray(data) ? data.map(p => ({...p, createdAt: getRelativeTime(p.createdAt)})) : [];
    }, [regularPostsResult]);

    const {data: searchResult, isLoading: isSearchLoading, isError: isSearchError} = useQuery({
        queryKey: ['posts', 'search', searchQueryFromUrl, searchPostPage],
        queryFn: ({ signal }) => PostService.searchPost({title: searchQueryFromUrl, categoryName: searchQueryFromUrl, userName: searchQueryFromUrl, summary: searchQueryFromUrl, page: searchPostPage}, signal),
        enabled: isSearchPage,
    });
    const searchPosts = useMemo(() => {
        const data = searchResult?.data;
        return Array.isArray(data) ? data.map(p => ({...p, createdAt: getRelativeTime(p.createdAt)})) : [];
    }, [searchResult]);

    useEffect(() => { window.scrollTo({top: 0, left: 0, behavior: 'auto'}); }, [pathname, search]);
    
    useEffect(() => {
        if (mainPost && mainPost.title && slugFromUrl) {
            const correctSlug = slugify(mainPost.title);
            if (slugFromUrl !== correctSlug) {
                navigate(`/post/${mainPost.id}/${correctSlug}`, { replace: true });
            }
        }
    }, [mainPost, slugFromUrl, navigate]);

    useEffect(() => {
        if (isSearchPage || isPostPage) setActiveIndex(-1);
        else if (categories.length > 0) {
            if (isHomePage) setActiveIndex(0);
            else {
                const primary = categories.slice(0, 3);
                const foundIndex = primary.findIndex(cat => (cat as any).name.toLowerCase() === currentCategory);
                setActiveIndex(foundIndex !== -1 ? foundIndex + 1 : 4);
            }
        }
    }, [currentCategory, categories, isSearchPage, isPostPage, isHomePage]);

    useEffect(() => {
        if (searchQueryFromUrl !== searchQuery) {
            setSearchQuery(searchQueryFromUrl);
        }
    }, [searchQueryFromUrl]);

    useEffect(() => {
        if (isSearchPage) {
            setSearchPostPage(1);
        }
    }, [searchQueryFromUrl]);

    useEffect(() => {
        const handleScroll = (event: Event) => {
            if (menuRef.current) {
                menuRef.current.hide(event as any);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleCategoryChange = (category: string) => {
        setHeadlinePostPage(1);
        setTopPostPage(1);
        setRegularPostPage(1);
        navigate(`/${category.toLowerCase()}`);
    };

    const primaryCategories = useMemo(() => categories.slice(0, 3), [categories]);
    const remainingCategories = useMemo(() => categories.slice(3), [categories]);
    const allCategories = useMemo(() => [
        {label: "Beranda", command: () => handleCategoryChange("beranda")},
        ...primaryCategories.map((cat) => ({label: truncateText((cat as any).name, 13), command: () => handleCategoryChange((cat as any).name.toLowerCase())})),
        ...(remainingCategories.length > 0 ? [{label: "Lainnya", command: (e) => menuRef.current?.toggle(e.originalEvent)}] : []),
    ], [primaryCategories, remainingCategories]);
    const moreCategories = useMemo(() => remainingCategories.map((cat) => ({label: truncateText((cat as any).name, 13), command: () => handleCategoryChange((cat as any).name.toLowerCase())})), [remainingCategories]);

    return {
        categories, headlinePost, topPosts, posts, searchPosts, mainPost,
        loading: isMainPostLoading || isHeadlineLoading || isTopPostsLoading || isRegularPostsLoading || isSearchLoading || isMainPostFetching,
        error: isMainPostError || isHeadlineError || isTopPostsError || isRegularPostsError || isSearchError,
        notFound: (isPostPage && !isMainPostLoading && !mainPost),
        activeIndex, setActiveIndex, searchQuery, setSearchQuery, menuRef, allCategories, moreCategories, handleCategoryChange, isSearchPage, isPostPage,
        topPostRange, setTopPostRange,
        headlinePostPage, setHeadlinePostPage, headlinePostPagination: headlineResult?.pagination,
        topPostPage, setTopPostPage, topPostPagination: topPostsResult?.pagination,
        regularPostPage, setRegularPostPage, regularPostPagination: regularPostsResult?.pagination,
        searchPostPage, setSearchPostPage, searchPostPagination: searchResult?.pagination,
        sizes: { headline: 1, top: 3, regular: 5, search: 5 },
    };
};

export default usePost;
