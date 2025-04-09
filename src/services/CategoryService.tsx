import axios from "axios";

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

export const CategoryService = {
    createCategory: async (data, token) => {
        try {
            const response = await axios.post(`${apiUri}/api/category`, { name: data.name }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            return response.data.data;
        } catch (error) {
            throw new Error(error.response?.status === 500 ? "Kesalahan server, coba lagi nanti" : error.response?.data?.error || "Terjadi kesalahan jaringan");
        }
    },
    listCategories: async (signal=null) => {
        try {
            const response = await axios.get(`${apiUri}/api/category`, {
                signal
            });

            return response.data;
        } catch (error) {
            if (error.name === 'CanceledError') {
                throw new Error('Request was cancelled');
            }
            throw new Error(error.response?.status === 500 ? "Kesalahan server, coba lagi nanti" : error.response?.data?.error || "Terjadi kesalahan jaringan");
        }
    },
    getCategory: async (id, token) => {
        try {
            const response = await axios.get(`${apiUri}/api/category/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data.data;
        } catch (error) {
            throw new Error(error.response?.status === 500 ? "Kesalahan server, coba lagi nanti" : error.response?.data?.error || "Terjadi kesalahan jaringan");
        }
    },
    updateCategory: async (id, data, token) => {
        try {
            const response = await axios.put(`${apiUri}/api/category/${id}`, { name: data.name }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            return response.data.data;
        } catch (error) {
            throw new Error(error.response?.status === 500 ? "Kesalahan server, coba lagi nanti" : error.response?.data?.error || "Terjadi kesalahan jaringan");
        }
    },
    deleteCategory: async (id, token) => {
        try {
            const response = await axios.delete(`${apiUri}/api/category/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data.message || "Kategori berhasil dihapus";
        } catch (error) {
            throw new Error(error.response?.status === 500 ? "Kesalahan server, coba lagi nanti" : error.response?.data?.error || "Terjadi kesalahan jaringan");
        }
    }
};
