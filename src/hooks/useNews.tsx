import { useState, useEffect, useRef } from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import { Menu } from "primereact/menu";
import { PostService } from "../services/PostService";
import { CategoryService } from "../services/CategoryService";
import NotFound from "../pages/guest/NotFound.tsx";
import {useUpdatePost} from "./useUpdatePost.tsx";

const getRelativeTime = (timestamp: number) => {
    const now = new Date();
    const past = new Date(timestamp * 1000); // Konversi detik ke milidetik
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
    if (!timestamp) return ""; // Jika 0, return string kosong
    const date = new Date(timestamp * 1000); // Convert detik ke milidetik

    const formattedDate = date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).replace(".", ""); // Hapus titik di bulan (misal: "Jan." -> "Jan")

    const formattedTime = date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // Format 24 jam
    }).replace(".", ":"); // Pastikan pemisah jam ke menit adalah ":"

    return `${formattedDate}, ${formattedTime}`;
};

const useNews = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [activeIndex, setActiveIndex] = useState(-1);
    const [searchQuery, setSearchQuery] = useState("");

    const [headlineNews, setHeadlineNews] = useState(null);
    const [topNews, setTopNews] = useState([]);
    const [news, setNews] = useState([]);

    // Pagination state
    const [headlinePage, setHeadlinePage] = useState(1);
    const [topNewsPage, setTopNewsPage] = useState(1);
    const [newsPage, setNewsPage] = useState(1);

    const [headlinePagination, setHeadlinePagination] = useState({ totalItem: 0, totalPage: 1 });
    const [topNewsPagination, setTopNewsPagination] = useState({ totalItem: 0, totalPage: 1 });
    const [newsPagination, setNewsPagination] = useState({ totalItem: 0, totalPage: 1 });

    const headlineSize = 1;
    const topNewsSize = 3;
    const newsSize = 5;

    const menuRef = useRef<Menu>(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const [headlineMode, setHeadlineMode] = useState(true);

    const [post, setPost] = useState({
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


    useEffect(() => {
        const handleScroll = (event: Event) => {
            menuRef.current?.hide(event);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Fetch daftar kategori dari API
    const fetchCategories = async () => {
        try {
            const response = await CategoryService.listCategories(token);
            if (Array.isArray(response.data)) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // Fetch berita headline
    const fetchHeadlineNews = async (category = "") => {
        try {
            const filters = {
                categoryName: category !== "Home" ? category : "",
                page: headlinePage,
                size: headlineSize,
            };

            const response = await PostService.searchPost(token, filters);
            const { data, pagination } = response;

            setHeadlineNews(data.length > 0 ? {
                ...data[0],
                publishedDate: getRelativeTime(data[0].publishedDate) // Tambahkan waktu relatif
            } : null);

            setHeadlinePagination(pagination);
        } catch (error) {
            console.error("Error fetching headline news:", error);
        }
    };

    // Fetch berita top news
    const fetchTopNews = async (category = "") => {
        try {
            const filters = {
                categoryName: category !== "Home" ? category : "",
                page: topNewsPage,
                size: topNewsSize,
            };

            const response = await PostService.searchPost(token, filters);
            const { data, pagination } = response;
            setTopNews(data.map(item => ({
                ...item,
                publishedDate: getRelativeTime(item.publishedDate)
            })));
            setTopNewsPagination(pagination);
        } catch (error) {
            console.error("Error fetching top news:", error);
        }
    };

    // Fetch berita reguler
    const fetchNews = async (category = "") => {
        setLoading(true);
        setError("");

        try {
            const filters = {
                categoryName: category !== "Home" ? category : "",
                page: newsPage,
                size: newsSize,
            };

            const response = await PostService.searchPost(token, filters);
            const { data, pagination } = response;
            setNews(data.map(item => ({
                ...item,
                publishedDate: getRelativeTime(item.publishedDate) // Konversi waktu langsung
            })));
            setNewsPagination(pagination);
        } catch (error) {
            setError("Gagal memuat berita. Silakan coba lagi.");
            console.error("Error fetching news:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data saat kategori atau paginasi berubah
    useEffect(() => {
        fetchHeadlineNews(selectedCategory);
    }, [selectedCategory, headlinePage]);

    useEffect(() => {
        fetchTopNews(selectedCategory);
    }, [selectedCategory, topNewsPage]);

    useEffect(() => {
        fetchNews(selectedCategory);
    }, [selectedCategory, newsPage]);

    // Fetch kategori saat komponen pertama kali dimuat
    useEffect(() => {
        fetchCategories();
    }, []);

    const { id } = useParams();
    const { processContent } = useUpdatePost();
    // **Menentukan active index berdasarkan path**
    useEffect(() => {
        // Cek apakah path berupa angka integer > 0
        if (!isNaN(Number(id)) && Number(id) > 0) {
            setHeadlineMode(false);
            setActiveIndex(-1);
            const fetchPost = async () => {
                try {
                    const post = await PostService.getPost(id);
                    setPost(prevPost => ({
                        ...prevPost,
                        category: post.category,
                        summary: post.summary,
                        id: post.id ?? null,
                        title: post.title,
                        thumbnail: post.thumbnail,
                        user: post.user,
                        content: processContent(post.content),
                        publishedDate: formatDate(post.publishedDate),
                        lastUpdated: post.lastUpdated ? formatDate(post.lastUpdated) : "",
                    }));
                    setNotFound(false);
                } catch (error) {
                    console.error("Gagal mengambil data post:", error.message);
                    setNotFound(true);
                }
            };
            fetchPost();
            return;
        } else {
            setHeadlineMode(true);
        }

        // Cek apakah id kosong (beranda)
        if (!id) {
            setActiveIndex(0);
            return;
        }

        // Cek kategori utama
        const primaryCategories = categories.slice(0, 3);
        const remainingCategories = categories.slice(3);

        let foundIndex = primaryCategories.findIndex(cat => cat.name.toLowerCase() === id.toLowerCase());

        if (foundIndex !== -1) {
            setActiveIndex(foundIndex + 1); // Karena index 0 adalah "Home"
            return;
        }

        // Cek kategori di "Lainnya"
        const isInMoreCategories = remainingCategories.some(cat => cat.name.toLowerCase() === id.toLowerCase());

        if (isInMoreCategories) {
            setActiveIndex(4);
            return;
        }

        // Jika tidak cocok dengan kategori mana pun, kembali ke Home (0)
        setActiveIndex(0);

    }, [id, categories]);



    // Handle perubahan kategori dengan mengubah path URL
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setHeadlinePage(1);
        setTopNewsPage(1);
        setNewsPage(1);

        navigate(`/${category.toLowerCase()}`);
    };

    // Maksimal 3 kategori utama selain "Home", sisanya masuk ke dropdown "Lainnya"
    const primaryCategories = categories.slice(0, 3);
    const remainingCategories = categories.slice(3);

    const allCategories = [
        { label: "Home", command: () => handleCategoryChange("Home") },
        ...primaryCategories.map((cat, index) => ({
            label: cat.name,
            command: () => handleCategoryChange(cat.name),
        })),
        ...(remainingCategories.length > 0
            ? [{ label: "Lainnya", command: (e) => menuRef.current?.toggle(e.originalEvent) }]
            : []),
    ];

    const moreCategories = remainingCategories.map((cat) => ({
        label: cat.name,
        command: () => {
            handleCategoryChange(cat.name);
            setActiveIndex(4);
        },
    }));

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, [id]);



    return {
        activeIndex,
        setActiveIndex,
        searchQuery,
        setSearchQuery,
        headlineNews,
        topNews,
        news,
        headlinePage,
        setHeadlinePage,
        topNewsPage,
        setTopNewsPage,
        newsPage,
        setNewsPage,
        headlinePagination,
        topNewsPagination,
        newsPagination,
        menuRef,
        allCategories,
        moreCategories,
        loading,
        error,
        selectedCategory,
        handleCategoryChange,
        topNewsSize,
        headlineSize,
        newsSize,
        headlineMode,
        setHeadlineMode,
        formatDate,
        truncateText,
        post,
        notFound,
    };
};

export default useNews;
