import {useState, useEffect, useRef} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {Menu} from "primereact/menu";
import {PostService} from "../services/PostService";
import {CategoryService} from "../services/CategoryService";
import {useUpdatePost} from "./useUpdatePost.tsx";

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

const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
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

    const menuRef = useRef<Menu>(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const token = localStorage.getItem("token");

    const [headlineMode, setHeadlineMode] = useState(false);
    const [mainMode, setMainMode] = useState(false);
    const [searchMode, setSearchMode] = useState(false)

    const [mainPost, setMainPost] = useState({
        id: null,
        category: {
            id: null,
            name: ""
        },
        user: {
            id: null,
            name: "",
            profilePicture: ""
        },
        title: "",
        summary: "",
        content: "",
        publishedDate: null,
        lastUpdated: null,
        thumbnail: ""
    });

    const [notFound, setNotFound] = useState(false);
    const [retry, setRetry] = useState(0);
    const handleRetry = () => {
        setRetry(prevRetry => prevRetry + 1);
    };





    const fetchCategories = async () => {
        setError(false)
        setLoading(true)
        try {
            const response = await CategoryService.listCategories(token);
            if (Array.isArray(response.data)) {
                setCategories(response.data);
            }
        } catch (error) {
            if (!error.response) {
                setError(true)
            } else {
                console.log(error)
            }
        } finally {
            setLoading(false)
        }
    };

    const fetchHeadlinePost = async (category = "") => {
        setLoading(true);
        setError(false)
        try {
            const filters = {
                categoryName: category !== "Beranda" && category !== "beranda" ? category : "",
                page: headlinePostPage,
                size: headlineSize,
            };

            const response = await PostService.searchPost(token, filters);
            const {data, pagination} = response;

            setHeadlinePost(data.length > 0 ? {
                ...data[0],
                publishedDate: getRelativeTime(data[0].publishedDate)
            } : null);

            setHeadlinePostPagination(pagination);
        } catch (error) {
            if (!error.response) {
                console.log(error)
                setError(true)
            } else {
                console.log(error)
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchSearchPost = async (query = "", category = "") => {
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
            };

            const response = await PostService.searchPost(token, filters);
            const {data, pagination} = response;

            setSearchPost(data.map(item => ({
                ...item,
                publishedDate: getRelativeTime(item.publishedDate),
            })));

            setSearchPostPagination(pagination);
        } catch (error) {
            if (!error.response) {
                console.log(error)
                setError(true)
            } else {
                console.log(error)
            }
        } finally {
            setLoading(false);
        }
    };


    const fetchTopPost = async (category = "") => {
        setError(false)
        setLoading(true);
        try {
            const filters = {
                categoryName: category !== "Beranda" && category !== "beranda" ? category : "",
                page: topPostPage,
                size: topPostSize,
            };

            const response = await PostService.searchPost(token, filters);
            const {data, pagination} = response;
            setTopPost(data.map(item => ({
                ...item,
                publishedDate: getRelativeTime(item.publishedDate)
            })));
            setTopPostPagination(pagination);
        } catch (error) {
            if (!error.response) {
                console.log(error)
                setError(true)
            } else {
                console.log(error)
            }
        } finally {
            setLoading(false)
        }
    };

    const fetchPost = async (category = "") => {
        setLoading(true);
        setError(false);

        try {
            const filters = {
                categoryName: category !== "Beranda" && category !== "beranda" ? category : "",
                page: postPage,
                size: postSize,
            };

            const response = await PostService.searchPost(token, filters);
            const {data, pagination} = response;
            setPost(data.map(item => ({
                ...item,
                publishedDate: getRelativeTime(item.publishedDate)
            })));
            setPostPagination(pagination);
        } catch (error) {
            if (!error.response) {
                console.log(error)
                setError(true)
            } else {
                console.log(error)
            }
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchCategories();
    }, [retry]);


    const {id} = useParams();
    const {processContent} = useUpdatePost();


    useEffect(() => {
        if (headlineMode && !mainMode && !searchMode) {
            fetchHeadlinePost(selectedCategory);
        }
}, [selectedCategory, headlinePostPage ,retry, searchMode, mainMode]);
    const [prevTopPostPage, setPrevTopPostPage] = useState(1)
    const [prevPostPage, setPrevPostPage] = useState(1)

    useEffect(() => {
        if (!headlineMode && mainMode && !searchMode){
            if (topPostPage != prevTopPostPage){
                fetchTopPost("")
                setPrevTopPostPage(topPostPage)
            }
            setSelectedCategory("")
        }else if (!mainMode && headlineMode && !searchMode) {
            fetchTopPost(selectedCategory);
        }
    }, [selectedCategory, topPostPage, retry, searchMode, mainMode]);

    useEffect(() => {
        if (!headlineMode && mainMode && !searchMode){
            if (postPage != prevPostPage){
                fetchPost("")
                setPrevPostPage(postPage)
            }
            setSelectedCategory("")
        }else if (!mainMode && headlineMode && !searchMode){
            fetchPost(selectedCategory);
        }
    }, [selectedCategory, postPage,retry, searchMode, mainMode]);
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
    useEffect(() => {
        const query = getQueryFromUrl()
        if (window.location.pathname === '/post') {
            if(!isNaN(Number(query)) && Number(query) > 0){
                setSearchMode(false);
                setHeadlineMode(false);
                setMainMode(true);
                setActiveIndex(-1);
                const fetchMainPost = async () => {
                    setLoading(true);
                    setError(false)
                    try {
                        const response = await PostService.getPost(query);
                        setMainPost(prevPost => ({
                            ...prevPost,
                            category: response.category,
                            summary: response.summary,
                            id: response.id ?? null,
                            title: response.title,
                            thumbnail: response.thumbnail,
                            user: response.user,
                            content: processContent(response.content),
                            publishedDate: formatDate(response.publishedDate),
                            lastUpdated: response.lastUpdated ? formatDate(response.lastUpdated) : "",
                        }));
                        setNotFound(false);
                        fetchPost("")
                        fetchTopPost("")
                    } catch (error) {
                        if (error.message === "Terjadi kesalahan jaringan") {
                            setError(true)
                        } else if (error.message === "Not found" || error.message === "Bad request") {
                            setNotFound(true);
                        } else {
                            console.log(error)
                        }
                    } finally {
                        setLoading(false)
                    }
                };
                fetchMainPost();
                return;
            }else {
                setNotFound(true)
            }
        } else if (window.location.pathname === '/search') {
            setSearchQuery(query);
            setActiveIndex(-1);
            setMainMode(false);
            setHeadlineMode(false)
            setSearchMode(true);
            fetchSearchPost(query);
        }else {
            setSearchMode(false);
            setMainMode(false)
            setHeadlineMode(true);
            setSearchPostPage(1);
        }

    }, [location.search,retry,searchPostPage]);


    useEffect(() => {
        if (categories.length === 0) {
            if (window.location.pathname === "/beranda") {
                handleCategoryChange("beranda");
                setActiveIndex(0);
                return;
            }
            return;
        }
        if (window.location.pathname !== '/search' && window.location.pathname !== '/post') {
            const primaryCategories = categories.slice(0, 3);
            const remainingCategories = categories.slice(3);

            let foundIndex = primaryCategories.findIndex(cat => cat.name.toLowerCase() === id.toLowerCase());
            console.log(foundIndex);

            if (window.location.pathname === "/beranda") {
                handleCategoryChange(id);
                setActiveIndex(0);
                return;
            }

            if (foundIndex !== -1) {
                handleCategoryChange(id);
                setActiveIndex(foundIndex + 1);
                return;
            }

            const isInMoreCategories = remainingCategories.some(cat => cat.name.toLowerCase() === id.toLowerCase());
            if (isInMoreCategories) {
                handleCategoryChange(id);
                setActiveIndex(4);
                return;
            }

            setNotFound(true)
        }
    }, [id,categories]);


    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setHeadlinePostPage(1);
        setTopPostPage(1);
        setPostPage(1);

        navigate(`/${category.toLowerCase()}`);
    };

    const primaryCategories = categories.slice(0, 3);
    const remainingCategories = categories.slice(3);

    const allCategories = [
        {label: "Beranda", command: () => handleCategoryChange("beranda")},
        ...primaryCategories.map((cat, index) => ({
            label: cat.name,
            command: () => handleCategoryChange(cat.name.toLowerCase()),
        })),
        ...(remainingCategories.length > 0
            ? [{label: "Lainnya", command: (e) => menuRef.current?.toggle(e.originalEvent)}]
            : []),
    ];

    const moreCategories = remainingCategories.map((cat) => ({
        label: cat.name,
        command: () => {
            handleCategoryChange(cat.name.toLowerCase());
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
            menuRef.current?.hide(event);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);


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
        truncateText,
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
        categories
    };
};

export default usePost;
