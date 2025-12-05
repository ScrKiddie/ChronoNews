import apiClient from "./apiClient.tsx";
import { GenericAbortSignal } from "axios";
import {Category} from "../types/category.tsx";

export const CategoryService = {
    createCategory: async (data: Category) => {
        const response = await apiClient.post(`/category`, data, {
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

    updateCategory: async (id: number, data: Category) => {
        const response = await apiClient.put(`/category/${id}`, data, {
            headers: { "Content-Type": "application/json" }
        });
        return response.data.data;
    },

    deleteCategory: async (id: number) => {
        const response = await apiClient.delete(`/category/${id}`);
        return response.data.message || "Kategori berhasil dihapus";
    }
};
