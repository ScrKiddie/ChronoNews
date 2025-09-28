import {useState, useEffect, useRef} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {PostService} from "../services/postService.tsx";
import {CategoryService} from "../services/categoryService.tsx";
import {useUpdatePost} from "./useUpdatePost.tsx";
import {truncateText} from "../utils/truncateText.tsx";

const getRelativeTime = (timestamp: number) => {
    const now = new Date();
    const past = new Date(timestamp * 1000);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} tahun lalu`;
    if (months > 0) return `${months} bulan lalu`;
    if (weeks > 0) return `${weeks} minggu lalu`;
    if (days > 0) return `${days} hari lalu`;
    if (hours > 0) return `${hours} jam lalu`;
    if (minutes > 0) return `${minutes} menit lalu`;

    return "Baru saja";
};

const formatDate = (timestamp: number) => {
    if (!timestamp) return "";
    const date = new Date(timestamp * 1000);

    const formattedDate = date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).replace(".", "");

    const formattedTime = date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).replace(".", ":");

    return `${formattedDate}, ${formattedTime}`;
};

const usePost = () => {
    const waktuOptions = [
        { label: 'Hari Ini', value: '1' },
        { label: '7 Hari Terakhir', value: '7' },
        { label: '30 Hari Terakhir', value: '30' },
        { label: 'Semua Waktu', value: 'all' }
    ];
    const [range, setRange] = useState('all');

    const location = useLocation();
    const navigate = useNavigate();

    const [activeIndex, setActiveIndex] = useState(-1);
    const [searchQuery, setSearchQuery] = useState("");

    const [headlinePost, setHeadlinePost] = useState(null);
    const [topPost, setTopPost] = useState([]);
    const [post, setPost] = useState([]);
    const [searchPost, setSearchPost] = useState([]);

    const [headlinePostPage, setHeadlinePostPage] = useState(1);
    const [topPostPage, setTopPostPage] = useState(1);
    const [postPage, setPostPage] = useState(1);
    const [searchPostPage, setSearchPostPage] = useState(1);

    const [headlinePostPagination, setHeadlinePostPagination] = useState({totalItem: 0, totalPage: 1});
    const [topPostPagination, setTopPostPagination] = useState({totalItem: 0, totalPage: 1});
    const [postPagination, setPostPagination] = useState({totalItem: 0, totalPage: 1});
    const [searchPostPagination, setSearchPostPagination] = useState({totalItem: 0, totalPage: 1});

    const headlineSize = 1;
    const topPostSize = 3;
    const postSize = 5;
    const searchPostSize = 5

    const menuRef = useRef(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [headlineMode, setHeadlineMode] = useState(false);
    const [searchMode, setSearchMode] = useState(false)

    const [mainPost, setMainPost] = useState({});

    const [notFound, setNotFound] = useState(false);
    const [retry, setRetry] = useState(0);
    const handleRetry = () => {
        setRetry(prevRetry => prevRetry + 1);
    };

    const headlineAbortController = useRef<AbortController | null>(null);
    const topPostAbortController = useRef<AbortController | null>(null);
    const postAbortController = useRef<AbortController | null>(null);
    const searchPostAbortController = useRef<AbortController | null>(null);

    const {id} = useParams() || "";

    const {processContent} = useUpdatePost();

    const [startDate, setStartDate] = useState(0);
    const [endDate, setEndDate] = useState(0);

    const [searchSort, setSearchSort] = useState('-created_at');
    const [previousSearchSort, setPreviousSearchSort] = useState('-created_at');



    const getQueryFromUrl = () => {
        if (window.location.pathname === '/post') {
            const params = new URLSearchParams(window.location.search);
            return params.get('id') || '';
        }else if (window.location.pathname === '/search') {
            const params = new URLSearchParams(window.location.search);
            return params.get('q') || '';
        }
        return '';
    };
    const fetchCategories = async () => {
        setError(false)
        setLoading(true)
        try {
            const response = await CategoryService.listCategories();
            if (Array.isArray(response.data)) {
                setCategories(response.data);
            }
            setFailedRequests(prev => prev.filter(req => req !== 'categories'));
            setLoading(false)
        } catch (error) {
            if ((error as any).message === "Terjadi kesalahan jaringan") {
                setFailedRequests(prev => [...new Set([...prev, 'categories'])]);
                setError(true);
            } else if (!(error as any).response) {
                if ((error as any).message !== 'Request was cancelled') { setError(true); }
            } else {
                setFailedRequests(prev => [...new Set([...prev, 'categories'])]);
                setError(true);
                console.log(error)
            }
        }
    };
    const [failedRequests, setFailedRequests] = useState<string[]>([]);

    const fetchHeadlinePost = async (category = "") => {
        if (headlineAbortController.current) {
            headlineAbortController.current.abort();
        }

        headlineAbortController.current = new AbortController();
        const signal = headlineAbortController.current.signal;

        setLoading(true);
        setError(false)
        try {
            const filters = {
                categoryName: category !== "Beranda" && category !== "beranda" ? category : "",
                page: headlinePostPage,
                size: headlineSize,
            };

            const response = await PostService.searchPost(filters, signal);
            const {data, pagination} = response;

            setHeadlinePost(data.length > 0 ? {
                ...data[0],
                createdAt: getRelativeTime(data[0].createdAt)
            } : null);

            setHeadlinePostPagination(pagination);
            setFailedRequests(prev => prev.filter(req => req !== 'headlinePost'));
            setLoading(false);
        } catch (error) {
            if ((error as any).message === "Terjadi kesalahan jaringan") {
                setFailedRequests(prev => [...new Set([...prev, 'headlinePost'])]);
                setError(true);
            } else if (!(error as any).response) {
                if ((error as any).message !== 'Request was cancelled') { setError(true); }
            } else {
                setFailedRequests(prev => [...new Set([...prev, 'headlinePost'])]);
                setError(true);
                console.log(error)
            }
        }
    };
    const fetchSearchPost = async (query = "", sort = "") => {
        if (searchPostAbortController.current) {
            searchPostAbortController.current.abort();
        }

        searchPostAbortController.current = new AbortController();
        const signal = searchPostAbortController.current.signal;

        setLoading(true);
        setError(false);

        try {
            const filters = {
                title: query,
                categoryName: query,
                userName: query,
                summary: query,
                page: searchPostPage,
                size: searchPostSize,
                sort: sort,
            };

            const response = await PostService.searchPost(filters,signal);
            const {data, pagination} = response;

            setSearchPost(data.map(item => ({
                ...item,
                createdAt: getRelativeTime(item.createdAt),
            })));

            setSearchPostPagination(pagination);
            setFailedRequests(prev => prev.filter(req => req !== 'searchPost'));
            setLoading(false);
        } catch (error) {
            if ((error as any).message === "Terjadi kesalahan jaringan") {
                setFailedRequests(prev => [...new Set([...prev, 'searchPost'])]);
                setError(true);
            } else if (!(error as any).response) {
                if ((error as any).message !== 'Request was cancelled') { setError(true); }
            } else {
                setFailedRequests(prev => [...new Set([...prev, 'searchPost'])]);
                setError(true);
                console.log(error)
            }
        }
    };
    const fetchTopPost = async (category = "") => {
        if (topPostAbortController.current) {
            topPostAbortController.current.abort();
        }

        topPostAbortController.current = new AbortController();
        const signal = topPostAbortController.current.signal;

        setError(false)
        setLoading(true);
        try {
            const filters = {
                categoryName: category !== "Beranda" && category !== "beranda" ? category : "",
                page: topPostPage,
                size: topPostSize,
                sort: "-view_count",
                startDate: startDate,
                endDate: endDate
            };

            const response = await PostService.searchPost(filters, signal);
            const {data, pagination} = response;
            setTopPost(data.map(item => ({
                ...item,
                createdAt: getRelativeTime(item.createdAt)
            })));
            setTopPostPagination(pagination);
            setFailedRequests(prev => prev.filter(req => req !== 'topPost'));
            setLoading(false)
        } catch (error) {
            if ((error as any).message === "Terjadi kesalahan jaringan") {
                setFailedRequests(prev => [...new Set([...prev, 'topPost'])]);
                setError(true);
            } else if (!(error as any).response) {
                if ((error as any).message !== 'Request was cancelled') { setError(true); }
            } else {
                setFailedRequests(prev => [...new Set([...prev, 'topPost'])]);
                setError(true);
                console.log(error)
            }
        }
    };
    const fetchPost = async (category = "") => {
        if (postAbortController.current) {
            postAbortController.current.abort();
        }

        postAbortController.current = new AbortController();
        const signal = postAbortController.current.signal;

        setLoading(true);
        setError(false);

        try {
            const filters = {
                categoryName: category !== "Beranda" && category !== "beranda" && category !== "main"? category : "",
                page: postPage,
                size: postSize,
            };

            const response = await PostService.searchPost(filters,signal);
            const {data, pagination} = response;
            setPost(data.map(item => ({
                ...item,
                createdAt: getRelativeTime(item.createdAt)
            })));
            setPostPagination(pagination);
            setFailedRequests(prev => prev.filter(req => req !== 'post'));
            setLoading(false);
        } catch (error) {
            if ((error as any).message === "Terjadi kesalahan jaringan") {
                setFailedRequests(prev => [...new Set([...prev, 'post'])]);
                setError(true);
            } else if (!(error as any).response) {
                if ((error as any).message !== 'Request was cancelled') { setError(true); }
            } else {
                setFailedRequests(prev => [...new Set([...prev, 'post'])]);
                setError(true);
                console.log(error)
            }
        }
    };
    const fetchMainPost = async (id) => {
        setLoading(true);
        setError(false)
        try {
            await PostService.incrementViewCount(id);
            const mainPostResponse = await PostService.getPost(id);
            setMainPost(prevPost => ({
                ...prevPost,
                category: mainPostResponse.category,
                summary: mainPostResponse.summary,
                id: mainPostResponse.id ?? null,
                title: mainPostResponse.title,
                thumbnail: mainPostResponse.thumbnail,
                user: mainPostResponse.user,
                content: processContent(mainPostResponse.content),
                createdAt: formatDate(mainPostResponse.createdAt),
                updatedAt: mainPostResponse.updatedAt ? formatDate(mainPostResponse.updatedAt) : "",
                viewCount: mainPostResponse.viewCount,
            }));
            setNotFound(false);
            setFailedRequests(prev => prev.filter(req => req !== 'mainPost'));
            setLoading(false)
        } catch (error) {
            if ((error as any).message === "Terjadi kesalahan jaringan") {
                setFailedRequests(prev => [...new Set([...prev, 'mainPost'])]);
                setError(true);
            }else if ((error as any).message !== 'Request was cancelled') {
                if ((error as any).message === "Not found" || (error as any).message === "Bad request") {
                    setNotFound(true);
                }else {
                    setFailedRequests(prev => [...new Set([...prev, 'mainPost'])]);
                    setError(true);
                    console.log(error)
                }
            }
        }
    };

    const fetchAllCategoryData = (category, mainMode = false) => {
        const promises: Promise<void>[] = [];

        if (!mainMode && headlinePostPage ===1) {
            promises.push(fetchHeadlinePost(category));
        }

        if (postPage === 1) {
            promises.push(fetchPost(category));
        }

        if (!mainMode && topPostPage === 1 && (startDate == 0 && endDate ==0)) {
            promises.push(fetchTopPost(category));
        }

        if (promises.length > 0) {
            return Promise.all(promises);
        } else {
            return Promise.resolve();
        }
    };


    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const query = getQueryFromUrl();

        if (window.location.pathname === '/post') {
            if (!isNaN(Number(query)) && Number(query) > 0) {
                setSelectedCategory("main");
                setSearchMode(false);
                setHeadlineMode(false);
                setSearchPostPage(1);
                setSearchSort("-created_at");
                setPreviousSearchSort("-created_at");
                setActiveIndex(-1);

                const fetchData = async () => {
                    try {
                        await fetchMainPost(query);
                        await fetchAllCategoryData("", true);
                    } catch (error) {
                        console.error(error);
                    }
                };
                fetchData();
            } else {
                setNotFound(true);
            }
        }
    }, [location.pathname, location.search]);

    useEffect(() => {
        const query = getQueryFromUrl();

        if (window.location.pathname === '/search') {
            setSearchQuery(query);
            setActiveIndex(-1);
            setHeadlineMode(false);
            setSearchMode(true);

            if (searchPostPage !== 1 && searchSort !== previousSearchSort) {
                setSearchPostPage(1);
                return;
            }
            fetchSearchPost(query, searchSort);
        } else if (window.location.pathname !== '/post') {
            setSearchMode(false);
            setHeadlineMode(true);
            setSearchPostPage(1);
            setSearchSort("-created_at");
            setPreviousSearchSort("-created_at");
        }

        setPreviousSearchSort(searchSort);
    }, [location.pathname, location.search, searchPostPage, searchSort]);

    useEffect(() => {
        if (categories.length === 0) {
            if (window.location.pathname === "/beranda") {
                setSelectedCategory("");
                setActiveIndex(0);
            }
            return;
        }

        const path = window.location.pathname;
        const lowerId:any = id?.toLowerCase();
        const primaryCategories = categories.slice(0, 3);
        const remainingCategories = categories.slice(3);

        if (path === "/search" || path === "/post") return;

        if (path === "/beranda") {
            setSelectedCategory("beranda");
            setActiveIndex(0);
            fetchAllCategoryData("beranda").catch(console.error);
            return;
        }

        const foundIndex = primaryCategories.findIndex(cat => (cat as any).name.toLowerCase() === lowerId);
        if (foundIndex !== -1) {
            setSelectedCategory(lowerId);
            setActiveIndex(foundIndex + 1);
            fetchAllCategoryData(lowerId).catch(console.error);
            return;
        }

        const isInMoreCategories = remainingCategories.some(cat => (cat as any).name.toLowerCase() === lowerId);
        if (isInMoreCategories) {
            setSelectedCategory(lowerId);
            setActiveIndex(4);
            fetchAllCategoryData(lowerId).catch(console.error);
            return;
        }

        setNotFound(true);
    }, [location.pathname, categories]);

    useEffect(() => {
        if (!selectedCategory || window.location.pathname === '/search' || window.location.pathname === '/post') return;
        fetchHeadlinePost(selectedCategory);
    }, [headlinePostPage]);

    useEffect(() => {
        if (!selectedCategory || window.location.pathname === '/search' || window.location.pathname === '/post') return;
        fetchTopPost(selectedCategory);
    }, [topPostPage,startDate,endDate]);

    useEffect(() => {
        if (selectedCategory &&window.location.pathname === '/post') {
            fetchPost("")
            return;
        }
        if (!selectedCategory || window.location.pathname === '/search' ) return;
        fetchPost(selectedCategory);
    }, [postPage]);

    useEffect(() => {
        setHeadlinePostPage(1);
        setTopPostPage(1);
        setPostPage(1);
        setStartDate(0)
        setEndDate(0)
        setRange("all")
    }, [selectedCategory]);


    const handleCategoryChange = (category: string) => {
        navigate(`/${category.toLowerCase()}`);
    };

    const primaryCategories = categories.slice(0, 3);
    const remainingCategories = categories.slice(3);

    const allCategories = [
        {label: "Beranda", command: () => handleCategoryChange("beranda")},
        ...primaryCategories.map((cat) => ({
            label: truncateText((cat as any).name,13),
            command: () => handleCategoryChange((cat as any).name.toLowerCase()),
        })),
        ...(remainingCategories.length > 0
            ? [{label: "Lainnya", command: (e) => (menuRef.current as any)?.toggle(e.originalEvent)}]
            : []),
    ];

    const moreCategories = remainingCategories.map((cat) => ({
        label: truncateText((cat as any).name,13),
        command: () => {
            handleCategoryChange((cat as any).name.toLowerCase());
            setActiveIndex(4);
        },
    }));

    useEffect(() => {
        const timeout = setTimeout(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }, 1);
        return () => clearTimeout(timeout);
    }, [location.search,searchPostPage ,id]);

    useEffect(() => {
        const handleScroll = (event: Event) => {
            (menuRef.current as any)?.hide(event);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        failedRequests.forEach((req) => {
            switch (req) {
                case 'categories':
                    fetchCategories();
                    break;
                case 'headlinePost':
                    fetchHeadlinePost(selectedCategory);
                    break;
                case 'topPost':
                    fetchTopPost(selectedCategory);
                    break;
                case 'post':
                    fetchPost(selectedCategory);
                    break;
                case 'searchPost':
                    fetchSearchPost(searchQuery);
                    break;
                case 'mainPost':
                    { const query = getQueryFromUrl()
                    fetchMainPost(query);
                    break; }
                default:
                    break;
            }
        });
        setFailedRequests([]);
    }, [retry]);


    return {
        activeIndex,
        setActiveIndex,
        searchQuery,
        setSearchQuery,
        headlinePost,
        topPost,
        post,
        headlinePostPage,
        setHeadlinePostPage,
        topPostPage,
        setTopPostPage,
        postPage,
        setPostPage,
        headlinePostPagination,
        topPostPagination,
        postPagination,
        menuRef,
        allCategories,
        moreCategories,
        loading,
        error,
        selectedCategory,
        handleCategoryChange,
        topPostSize,
        headlineSize,
        postSize,
        headlineMode,
        setHeadlineMode,
        formatDate,
        mainPost,
        notFound,
        searchMode,
        getQueryFromUrl,
        searchPost,
        searchPostPage,
        searchPostPagination,
        searchPostSize,
        setSearchPostPage,
        handleRetry,
        categories,
        setStartDate,
        setEndDate,
        waktuOptions,
        range,
        setRange,
        searchSort,
        setSearchSort,
        previousSearchSort,
        setPreviousSearchSort,
    };
};

export default usePost;
