import {useState, useEffect} from "react";
import {UserService} from "../services/userService.tsx";
import {useAuth} from "./useAuth.tsx";
import {useQuery, keepPreviousData} from "@tanstack/react-query";
import {handleApiErrorWithRetry} from "../utils/toastHandler.tsx";

const useSearchUser = () => {
    const {token} = useAuth();
    const [searchParams, setSearchParams] = useState({name: "", phoneNumber: "", email: "", role: ""});
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [visibleConnectionError, setVisibleConnectionError] = useState(false);

    useEffect(() => {
        setPage(1);
    }, [searchParams, size]);

    const queryKey = ['users', 'search', {searchParams, page, size}];

    const {
        data: searchResult,
        isError,
        isLoading,
        isFetching,
        error,
        refetch,
    } = useQuery({
        queryKey,
        queryFn: ({signal}) => {
            const filters = { ...searchParams, page, size };
            return UserService.searchUser(filters, signal);
        },
        select: (response) => {
            if (!response || !response.data) {
                return {users: [], pagination: {totalItem: 0}};
            }
            return {users: response.data, pagination: response.pagination};
        },
        placeholderData: keepPreviousData,
        enabled: !!token,
        retry: false,
    });

    useEffect(() => {
        if (isError) {
            handleApiErrorWithRetry(error, setVisibleConnectionError);
        } else {
            setVisibleConnectionError(false);
        }
    }, [isError, error]);

    return {
        data: searchResult?.users ?? [],
        searchParams,
        setSearchParams,
        page,
        setPage,
        size,
        setSize,
        totalItem: searchResult?.pagination?.totalItem ?? 0,
        refetch,
        visibleConnectionError,
        visibleLoadingConnection: isLoading || isFetching,
    };
};

export default useSearchUser;
