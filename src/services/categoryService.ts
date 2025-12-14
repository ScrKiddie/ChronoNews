import apiClientUtils from '../utils/apiClientUtils.ts';
import { GenericAbortSignal } from 'axios';
import { Category } from '../types/category.ts';

export const CategoryService = {
    createCategory: async (data: Category) => {
        const response = await apiClientUtils.post(`/category`, data, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data.data;
    },

    listCategories: async (signal?: GenericAbortSignal) => {
        const response = await apiClientUtils.get(`/category`, { signal });
        return response.data;
    },

    getCategory: async (id: number) => {
        const response = await apiClientUtils.get(`/category/${id}`);
        return response.data.data;
    },

    updateCategory: async (id: number, data: Category) => {
        const response = await apiClientUtils.put(`/category/${id}`, data, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data.data;
    },

    deleteCategory: async (id: number) => {
        const response = await apiClientUtils.delete(`/category/${id}`);
        return response.data.message || 'Kategori berhasil dihapus';
    },
};
