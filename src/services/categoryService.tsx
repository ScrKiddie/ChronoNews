import axios from "axios";
import {handleApiError} from "../utils/toastHandler.tsx";

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

export const CategoryService = {
    createCategory: async (data, token, toast, logout) => {
        try {
            const response = await axios.post(`${apiUri}/api/category`, { name: data.name }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            return response.data.data;
        } catch (error) {
            handleApiError(error, toast, logout);
            throw error;
        }
    },
    listCategories: async (signal?: AbortSignal) => {
        try {
            const response = await axios.get(`${apiUri}/api/category`, {
                signal
            });

            return response.data;
        } catch (error: any) {
            if ((error as any).name === 'CanceledError') {
                throw new Error('Request was cancelled');
            }
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data?.error || "Gagal memuat daftar kategori");
            }
            throw new Error(error.response?.status === 500 ? "Kesalahan server, coba lagi nanti" : error.response?.data?.error || "Terjadi kesalahan jaringan");
        }
    },
    getCategory: async (id, token, toast, logout) => {
        try {
            const response = await axios.get(`${apiUri}/api/category/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data.data;
        } catch (error) {
            handleApiError(error, toast, logout);
            throw error;
        }
    },
    updateCategory: async (id, data, token, toast, logout) => {
        try {
            const response = await axios.put(`${apiUri}/api/category/${id}`, { name: data.name }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            return response.data.data;
        } catch (error) {
            handleApiError(error, toast, logout);
            throw error;
        }
    },
    deleteCategory: async (id, token, toast, logout) => {
        try {
            const response = await axios.delete(`${apiUri}/api/category/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data.message || "Kategori berhasil dihapus";
        } catch (error) {
            handleApiError(error, toast, logout);
            throw error;
        }
    }
};
