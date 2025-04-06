import axios from "axios";

const apiUri = import.meta.env.VITE_CHRONOVERSE_API_URI;

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
            throw new Error(error.response?.status === 500 ? "Terjadi kesalahan jaringan" : error.response?.data?.error || "Terjadi kesalahan jaringan");
        }
    },

    searchPost: async (token, filters = {}) => {
        try {
            const {
                userID = "",
                title = "",
                categoryName = "",
                userName = "",
                summary = "",
                page = "",
                size = ""
            } = filters;
            const queryParams = new URLSearchParams({ userID, title, categoryName, userName, summary, page, size }).toString();
            const url = `${apiUri}/api/post?${queryParams}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            throw new Error(error.response?.status === 500 ? "Terjadi kesalahan jaringan" : error.response?.data?.error || "Terjadi kesalahan jaringan");
        }
    },

    getPost: async (id) => {
        try {
            const response = await axios.get(`${apiUri}/api/post/${id}`);

            return response.data.data;
        } catch (error) {
            console.error("Error details:", error.response || error.message);
            throw new Error(error.response?.status === 500 ? "Terjadi kesalahan jaringan" : error.response?.data?.error || "Terjadi kesalahan jaringan");
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

            const response = await axios.put(`${apiUri}/api/post/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            return response.data.data;
        } catch (error) {
            throw new Error(error.response?.status === 500 ? "Terjadi kesalahan jaringan" : error.response?.data?.error || "Terjadi kesalahan jaringan");
        }
    },

    deletePost: async (id, token) => {
        try {
            const response = await axios.delete(`${apiUri}/api/post/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data.message || "Post berhasil dihapus";
        } catch (error) {
            throw new Error(error.response?.status === 500 ? "Terjadi kesalahan jaringan" : error.response?.data?.error || "Terjadi kesalahan jaringan");
        }
    }
};
