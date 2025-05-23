import axios from "axios";
import {handleResponseError} from "../utils/responseHandler.tsx";

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
            handleResponseError(error);
        }
    },
    listCategories: async (signal?: AbortSignal) => {
        try {
            const response = await axios.get(`${apiUri}/api/category`, {
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
    getCategory: async (id, token) => {
        try {
            const response = await axios.get(`${apiUri}/api/category/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data.data;
        } catch (error) {
            handleResponseError(error);
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
            handleResponseError(error);
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
            handleResponseError(error);
        }
    }
};
