import axios from "axios";
import {handleApiError} from "../utils/toastHandler.tsx";

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

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
            const response = await axios.post(`${apiUri}/api/post`, formData, {
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

    searchPost: async (filters,signal) => {
        try {
            const {
                userID = "",
                title = "",
                categoryName = "",
                userName = "",
                summary = "",
                page = "",
                size = "",
                sort="",
                startDate = "",
                endDate ="",
            } = filters;
            const queryParams = new URLSearchParams({ userID, title, categoryName, userName, summary, page, size,sort,startDate,endDate }).toString();
            const url = `${apiUri}/api/post?${queryParams}`;

            const response = await axios.get(url, {
                signal
            });

            return response.data;
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
            const response = await axios.get(`${apiUri}/api/post/${id}`);
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
            await axios.patch(`${apiUri}/api/post/${id}/view`);
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

            const response = await axios.put(`${apiUri}/api/post/${id}`, formData, {
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
            const response = await axios.delete(`${apiUri}/api/post/${id}`, {
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