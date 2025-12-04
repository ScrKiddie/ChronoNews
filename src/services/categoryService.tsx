import apiClient from "./apiClient.tsx";
import { GenericAbortSignal } from "axios";
import { z } from "zod";
import { CategorySchema } from "../schemas/categorySchema.tsx";

export const CategoryService = {
    createCategory: async (data: z.infer<typeof CategorySchema>) => {
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

    updateCategory: async (id: number, data: z.infer<typeof CategorySchema>) => {
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
