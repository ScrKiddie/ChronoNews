import { useState, useEffect } from 'react';
import { PostService } from '../services/postService.ts';
import { useAuth } from './useAuth';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Post } from '../types/post.ts';
import { PostSearchParams } from '../types/search.ts';
import { ApiError } from '../types/api.ts';

const useSearchPost = (params: { countMode?: boolean } = {}) => {
    const { countMode = false } = params;
    const [startDate, setStartDate] = useState(0);
    const [endDate, setEndDate] = useState(0);
    const { sub, role } = useAuth();
    const [searchParams, setSearchParams] = useState<PostSearchParams>({
        title: '',
        categoryName: '',
        userName: '',
        summary: '',
        page: 1,
        size: 5,
    });
    const [visibleConnectionError, setVisibleConnectionError] = useState(false);

    useEffect(() => {
        setSearchParams((prev) => ({ ...prev, page: 1 }));
    }, [
        searchParams.title,
        searchParams.categoryName,
        searchParams.userName,
        searchParams.summary,
        searchParams.size,
        startDate,
        endDate,
    ]);

    const queryKey = [
        'posts',
        'search',
        { searchParams, startDate, endDate, countMode, role, sub },
    ];

    const {
        data: searchResult,
        isLoading,
        isError,
        isFetching,
        error,
        refetch,
    } = useQuery({
        queryKey,
        queryFn: ({ signal }) => {
            const filters: PostSearchParams = {
                ...searchParams,
            };

            if (countMode) {
                filters.sort = '-view_count';
                if (startDate) filters.startDate = startDate;
                if (endDate) filters.endDate = endDate;
            }

            if (role === 'journalist' && sub) {
                filters.userID = sub;
            }

            return PostService.searchPost(filters, signal);
        },
        select: (response) => {
            if (!response || !response.data) {
                return { posts: [], pagination: { totalItem: 0, totalPage: 0 } };
            }
            const formattedData = response.data.map((post: Post) => ({
                id: post.id,
                category: post.category?.name || 'Tidak Ada Kategori',
                user: post.user?.name || 'Tidak Ada User',
                title: post.title,
                summary: post.summary,
                createdAt:
                    typeof post.createdAt === 'number'
                        ? new Date(post.createdAt * 1000).toLocaleString()
                        : new Date(post.createdAt).toLocaleString(),

                updatedAt: post.updatedAt
                    ? typeof post.updatedAt === 'number'
                        ? new Date(post.updatedAt * 1000).toLocaleString()
                        : new Date(post.updatedAt).toLocaleString()
                    : 'Belum diperbarui',

                thumbnail: post.thumbnail || 'Tidak Ada Gambar',
                viewCount: post.viewCount,
            }));
            return { posts: formattedData, pagination: response.pagination };
        },
        placeholderData: keepPreviousData,
        retry: false,
        staleTime: 0,
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

    const setPage = (page: number) => setSearchParams((prev) => ({ ...prev, page }));
    const setSize = (size: number) => setSearchParams((prev) => ({ ...prev, size }));

    return {
        data: searchResult?.posts ?? [],
        searchParams,
        setSearchParams,
        page: searchParams.page,
        setPage,
        size: searchParams.size,
        setSize,
        totalItem: searchResult?.pagination?.totalItem ?? 0,
        totalPage: searchResult?.pagination?.totalPage ?? 0,
        setEndDate,
        setStartDate,
        refetch,
        visibleConnectionError,
        visibleLoadingConnection: isLoading || isFetching,
    };
};

export default useSearchPost;
