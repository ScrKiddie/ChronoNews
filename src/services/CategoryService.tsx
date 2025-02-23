import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const CategoryService = {
    createCategory: async (data, token) => {
        try {
            const response = await axios.post(`${API_URL}/category`, { name: data.name }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            return response.data.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Terjadi kesalahan jaringan");
        }
    },
    listCategories: async (token) => {
        try {
            const response = await axios.get(`${API_URL}/category`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Terjadi kesalahan jaringan");
        }
    },
    getCategory: async (id, token) => {
        try {
            const response = await axios.get(`${API_URL}/category/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Terjadi kesalahan jaringan");
        }
    },
    updateCategory: async (id, data, token) => {
        try {
            const response = await axios.put(`${API_URL}/category/${id}`, { name: data.name }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            return response.data.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Terjadi kesalahan jaringan");
        }
    },
    deleteCategory: async (id, token) => {
        try {
            const response = await axios.delete(`${API_URL}/category/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data.message || "Kategori berhasil dihapus";
        } catch (error) {
            throw new Error(error.response?.data?.error || "Terjadi kesalahan jaringan");
        }
    }
};
