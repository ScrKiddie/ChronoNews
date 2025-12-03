import apiClient from "./apiClient.tsx";
import {GenericAbortSignal} from "axios";

export const CategoryService = {
    createCategory: async (data: { name: string }) => {
        const response = await apiClient.post(`/category`, { name: data.name }, {
            headers: { "Content-Type": "application/json" }
        });
        return response.data.data;
    },

    listCategories: async (signal?: GenericAbortSignal) => {
        const response = await apiClient.get(`/category`, { signal });
        return response.data;
    },

    getCategory: async (id: number) => {
        const response = await apiClient.get(`/category/${id}`);
        return response.data.data;
    },

    updateCategory: async (id: number, data: { name: string }) => {
        const response = await apiClient.put(`/category/${id}`, { name: data.name }, {
            headers: { "Content-Type": "application/json" }
        });
        return response.data.data;
    },

    deleteCategory: async (id: number) => {
        const response = await apiClient.delete(`/category/${id}`);
        return response.data.message || "Kategori berhasil dihapus";
    }
};
