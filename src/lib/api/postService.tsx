import apiClient from './apiClient.tsx';
import { GenericAbortSignal } from 'axios';
import { PostFormData } from '../../types/post.tsx';
import { PostSearchParams } from '../../types/search.tsx';

export const PostService = {
    createPost: async (data: PostFormData) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('summary', data.summary);
        formData.append('content', data.content);
        formData.append('categoryID', data.categoryID.toString());
        if (data.userID) formData.append('userID', data.userID.toString());
        if (data.thumbnail) formData.append('thumbnail', data.thumbnail);

        const response = await apiClient.post('/post', formData);
        return response.data.data;
    },

    searchPost: async (filters: Partial<PostSearchParams>, signal?: GenericAbortSignal) => {
        const queryParams = new URLSearchParams(filters as Record<string, string>).toString();
        const response = await apiClient.get(`/post?${queryParams}`, { signal });

        if (response?.data) {
            const posts = Array.isArray(response.data.data) ? response.data.data : [];
            const pagination = response.data.pagination || {
                totalItem: 0,
                totalPage: 1,
                currentPage: 1,
                size: 10,
            };
            return { data: posts, pagination };
        }
        return {
            data: [],
            pagination: { totalItem: 0, totalPage: 1, currentPage: 1, size: 10 },
        };
    },

    getPost: async (id: number | string) => {
        const response = await apiClient.get(`/post/${id}`);
        return response.data.data;
    },

    incrementViewCount: async (id: number | string) => {
        try {
            await apiClient.patch(`/post/${id}/view`);
        } catch (error) {
            void error;
        }
    },

    updatePost: async (id: number, data: PostFormData) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('summary', data.summary);
        formData.append('content', data.content);
        formData.append('categoryID', data.categoryID.toString());
        if (data.userID) formData.append('userID', data.userID.toString());
        if (data.thumbnail) formData.append('thumbnail', data.thumbnail);
        if (data.deleteThumbnail) formData.append('deleteThumbnail', String(data.deleteThumbnail));

        const response = await apiClient.put(`/post/${id}`, formData);
        return response.data.data;
    },

    deletePost: async (id: number) => {
        const response = await apiClient.delete(`/post/${id}`);
        return response.data.message || 'Postingan berhasil dihapus';
    },
};
