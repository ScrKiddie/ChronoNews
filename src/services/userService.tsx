import apiClient from "./apiClient.tsx";
import {GenericAbortSignal} from "axios";

export const UserService = {
    createUser: async (data: any) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("email", data.email);
        formData.append("role", data.role);
        if (data.profilePicture) {
            formData.append("profilePicture", data.profilePicture);
        }

        const response = await apiClient.post(`/user`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data.data;
    },

    searchUser: async (filters: any = {}, signal?: GenericAbortSignal) => {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await apiClient.get(`/user?${queryParams}`, { signal });
        return response.data;
    },

    getUser: async (id: number) => {
        const response = await apiClient.get(`/user/${id}`);
        return response.data.data;
    },

    updateUser: async (id: number, data: any) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("email", data.email);
        formData.append("role", data.role);
        if (data.password) {
            formData.append("password", data.password);
        }
        if (data.profilePicture) {
            formData.append("profilePicture", data.profilePicture);
        }
        if (data.deleteProfilePicture) {
            formData.append("deleteProfilePicture", String(data.deleteProfilePicture));
        }
        
        const response = await apiClient.put(`/user/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data.data;
    },

    deleteUser: async (id: number) => {
        const response = await apiClient.delete(`/user/${id}`);
        return response.data.message || "User berhasil dihapus";
    }
};
