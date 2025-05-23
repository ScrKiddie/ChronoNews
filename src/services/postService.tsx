import axios from "axios";
import {handleResponseError} from "../utils/responseHandler.tsx";

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

export const PostService = {
    createPost: async (data, token) => {
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
            handleResponseError(error);
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
        } catch (error) {
            if ((error as any).name === 'CanceledError') {
                throw new Error('Request was cancelled');
            }
            handleResponseError(error);
        }
    },

    getPost: async (id) => {
        try {
            const response = await axios.get(`${apiUri}/api/post/${id}`);
            return response.data.data;
        } catch (error) {
            handleResponseError(error);
        }
    },

    updatePost: async (id, data, token) => {
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
            handleResponseError(error);
        }
    },

    deletePost: async (id, token) => {
        try {
            const response = await axios.delete(`${apiUri}/api/post/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data.message || "RegularPost berhasil dihapus";
        } catch (error) {
            handleResponseError(error);
        }
    }
};