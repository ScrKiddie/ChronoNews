import { useState, useEffect, useRef } from "react";
import { Menu } from "primereact/menu";
import { PostService } from "../services/PostService";
import { CategoryService } from "../services/CategoryService"; // Import service kategori

const useNews = () => {
    const [activeIndex, setActiveIndex] = useState(0);
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
            setHeadlineNews(data.length > 0 ? data[0] : null);
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
            setTopNews(data || []);
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
            setNews(data || []);
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
        fetchTopNews(selectedCategory);
        fetchNews(selectedCategory);
    }, [selectedCategory, headlinePage, topNewsPage, newsPage]);

    // Fetch kategori saat komponen pertama kali dimuat
    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle perubahan kategori
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setHeadlinePage(1);
        setTopNewsPage(1);
        setNewsPage(1);
    };

    // Sembunyikan menu saat scroll
    useEffect(() => {
        const handleScroll = (event: Event) => {
            menuRef.current?.hide(event);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Maksimal 3 kategori utama selain "Home", sisanya masuk ke dropdown "Lainnya"
    const primaryCategories = categories.slice(0, 3); // Ambil 3 kategori pertama
    const remainingCategories = categories.slice(3); // Sisanya masuk ke menu "Lainnya"

    const allCategories = [
        { label: "Home", command: () => handleCategoryChange("Home") },
        ...primaryCategories.map((cat) => ({
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
            handleCategoryChange(cat.name)
            setActiveIndex(4)
        },
    }));

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
        newsSize
    };
};

export default useNews;
