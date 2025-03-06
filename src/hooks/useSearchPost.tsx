import {useState, useEffect} from "react";
import {PostService} from "../services/PostService";
import {useToast} from "./useToast.tsx";
import {useAuth} from "./useAuth.tsx";

const useSearchPost = () => {
    const toastRef = useToast();
    const {token, sub, role} = useAuth();
    const [data, setData] = useState([]);
    const [searchParams, setSearchParams] = useState({
        title: "",
        categoryName: "",
        userName: "",
        summary: ""
    });
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [totalItem, setTotalItem] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [visibleConnectionError, setVisibleConnectionError] = useState(false);
    const [visibleLoadingConnection, setVisibleLoadingConnection] = useState(false);

    useEffect(() => {
        setPage(1);
    }, [searchParams, size]);

    useEffect(() => {
        fetchData();
    }, [page, searchParams, size]);
    const fetchData = async () => {
        setVisibleConnectionError(false);
        setVisibleLoadingConnection(true);
        try {
            const filters = {
                title: searchParams.title,
                categoryName: searchParams.categoryName,
                userName: searchParams.userName,
                summary: searchParams.summary,
                page: page.toString(),
                size: size.toString(),
            };
            if (role == "journalist") {
                filters.userID = sub
            }
            const response = await PostService.searchPost(token, filters);

            if (response && response.data) {
                const formattedData = response.data.map(post => ({
                    id: post.id,
                    category: post.category?.name || "Tidak Ada Kategori",
                    user: post.user?.name || "Tidak Ada User",
                    title: post.title,
                    summary: post.summary,
                    publishedDate: new Date(post.publishedDate * 1000).toLocaleString(),
                    lastUpdated: post.lastUpdated
                        ? new Date(post.lastUpdated * 1000).toLocaleString()
                        : "Belum diperbarui",
                    thumbnail: post.thumbnail || "Tidak Ada Gambar"
                }));

                setData(formattedData);
                setTotalItem(response.pagination.totalItem);
                setTotalPage(response.pagination.totalPage);
            }
        } catch (error) {
            if (!error.response) {
                setVisibleConnectionError(true);
            } else {
                toastRef.current.show({severity: "error", detail: error.message});
            }
        }
        setVisibleLoadingConnection(false);
    };

    return {
        data,
        searchParams,
        setSearchParams,
        page,
        setPage,
        size,
        setSize,
        totalItem,
        totalPage,
        fetchData,
        visibleConnectionError,
        visibleLoadingConnection,
    };
};

export default useSearchPost;
