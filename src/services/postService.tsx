import axios from "axios";
import {handleApiError} from "../utils/toastHandler.tsx";
import apiClient from "./apiClient.tsx";

export const PostService = {
    createPost: async (data, token, toast, logout) => {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("summary", data.summary);
            formData.append("content", data.content);

            formData.append("categoryID", data.categoryID);
            if (data.userID) {
                formData.append("userID", data.userID);
            }
            if (data.thumbnail) {
                formData.append("thumbnail", data.thumbnail);
            }
            const response = await apiClient.post(`/post`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            return response.data.data;
        } catch (error) {
            handleApiError(error, toast, logout);
            throw error;
        }
    },

    searchPost: async (filters, signal) => {
        try {
            const {
                userID = "",
                title = "",
                categoryName = "",
                userName = "",
                summary = "",
                page = "",
                size = "",
                sort = "",
                startDate = "",
                endDate = "",
                excludeIds = "",
            } = filters;
            const queryParams = new URLSearchParams({ userID, title, categoryName, userName, summary, page, size, sort, startDate, endDate, excludeIds }).toString();

            const response = await apiClient.get(`/post?${queryParams}`, {
                signal
            });

            if (response && response.data) {
                const posts = Array.isArray(response.data.data) ? response.data.data : [];
                const pagination = response.data.pagination || { totalItem: 0, totalPage: 1, currentPage: 1, size: size || 10 };
                
                return { data: posts, pagination: pagination };
            }

            return { data: [], pagination: { totalItem: 0, totalPage: 1, currentPage: 1, size: size || 10 } };

        } catch (error: any) {
            if ((error as any).name === 'CanceledError') {
                throw new Error('Request was cancelled');
            }
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data?.error || "Gagal memuat data post");
            }
            throw new Error(error.response?.status === 500 ? "Kesalahan server, coba lagi nanti" : error.response?.data?.error || "Terjadi kesalahan jaringan");
        }
    },

    getPost: async (id) => {
        try {
            const response = await apiClient.get(`/post/${id}`);
            return response.data.data;
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data?.error || "Gagal memuat detail post");
            }
            throw new Error(error.response?.status === 500 ? "Kesalahan server, coba lagi nanti" : error.response?.data?.error || "Terjadi kesalahan jaringan");
        }
    },

    incrementViewCount: async (id) => {
        try {
            await apiClient.patch(`/post/${id}/view`);
        } catch (error) {
            console.error("Failed to increment view count:", error);
        }
    },

    updatePost: async (id, data, token, toast, logout) => {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("summary", data.summary);
            formData.append("content", data.content);
            formData.append("categoryID", data.categoryID);
            if (data.userID) {
                formData.append("userID", data.userID);
            }
            if (data.thumbnail) {
                formData.append("thumbnail", data.thumbnail);
            }
            if (data.deleteThumbnail) {
                formData.append("deleteThumbnail", data.deleteThumbnail);
            }

            const response = await apiClient.put(`/post/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            return response.data.data;
        } catch (error) {
            handleApiError(error, toast, logout);
            throw error;
        }
    },

    deletePost: async (id, token, toast, logout) => {
        try {
            const response = await apiClient.delete(`/post/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data.message || "RegularPost berhasil dihapus";
        } catch (error) {
            handleApiError(error, toast, logout);
            throw error;
        }
    }
};
