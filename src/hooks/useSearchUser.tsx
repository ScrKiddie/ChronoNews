import { useState, useEffect } from "react";
import { UserService } from "../services/UserService";
import { useToast } from "./useToast.tsx";
import { useAuth } from "./useAuth.tsx";

const useSearchUser = () => {
    const toastRef = useToast();
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [searchParams, setSearchParams] = useState({ name: "", phoneNumber: "", email: "" });
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalItem, setTotalItem] = useState(0);
    const [totalPage, setTotalPage] = useState(1);
    const [visibleConnectionError, setVisibleConnectionError] = useState(false);
    const [visibleLoadingConnection, setVisibleLoadingConnection] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [page, size]);

    const fetchUsers = async () => {
        setVisibleConnectionError(false);
        setVisibleLoadingConnection(true);
        try {
            const filters = {
                name: searchParams.name,
                phoneNumber: searchParams.phoneNumber,
                email: searchParams.email,
                page: page.toString(),
                size: size.toString(),
            };

            const response = await UserService.searchUser(token, filters);

            if (response && response.data) {
                setUsers(response.data);
                setTotalItem(response.pagination.totalItem);
                setTotalPage(response.pagination.totalPage);
            }
        } catch (error) {
            if (!error.response) {
                setVisibleConnectionError(true);
            } else {
                toastRef.current.show({ severity: "error", detail: error.message });
            }
        }
        setVisibleLoadingConnection(false);
    };

    const handleSearch = () => {
        setPage(1);
        fetchUsers();
    };

    return {
        users,
        searchParams,
        setSearchParams,
        page,
        setPage,
        size,
        setSize,
        totalItem,
        totalPage,
        fetchUsers,
        handleSearch,
        visibleConnectionError,
        visibleLoadingConnection,
    };
};

export default useSearchUser;
