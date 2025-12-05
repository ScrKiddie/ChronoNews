import { useState, useEffect } from "react";
import { UserService } from "../services/userService.tsx";
import { useAuth } from "./useAuth.tsx";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { UserSearchParams } from '../types/search';
import { ApiError } from "../types/api.tsx";

const useSearchUser = () => {
    const { token } = useAuth();
    const [searchParams, setSearchParams] = useState<UserSearchParams>({
        page: 1,
        size: 5,
    });
    const [visibleConnectionError, setVisibleConnectionError] = useState(false);

    useEffect(() => {
        setSearchParams(prev => ({ ...prev, page: 1 }));
    }, [searchParams.name, searchParams.email, searchParams.phoneNumber, searchParams.role, searchParams.size]);

    const queryKey = ['users', 'search', { searchParams }];

    const {
        data: searchResult,
        isError,
        isLoading,
        isFetching,
        error,
        refetch,
    } = useQuery({
        queryKey,
        queryFn: ({ signal }) => {
            return UserService.searchUser(searchParams, signal);
        },
        select: (response) => {
            if (!response || !response.data) {
                return { users: [], pagination: { totalItem: 0 } };
            }
            return { users: response.data, pagination: response.pagination };
        },
        placeholderData: keepPreviousData,
        enabled: !!token,
        retry: false,
    });

    useEffect(() => {
        if (isLoading || isFetching) {
            setVisibleConnectionError(false);
        } else if (isError && (error as ApiError)?.isNetworkError) {
            setVisibleConnectionError(true);
        } else {
            setVisibleConnectionError(false);
        }
    }, [isError, error, isLoading, isFetching]);

    const setPage = (page: number) => setSearchParams(prev => ({ ...prev, page }));
    const setSize = (size: number) => setSearchParams(prev => ({ ...prev, size }));

    return {
        data: searchResult?.users ?? [],
        searchParams,
        setSearchParams,
        page: searchParams.page,
        setPage,
        size: searchParams.size,
        setSize,
        totalItem: searchResult?.pagination?.totalItem ?? 0,
        refetch,
        visibleConnectionError,
        visibleLoadingConnection: isLoading || isFetching,
    };
};

export default useSearchUser;
