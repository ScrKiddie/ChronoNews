import apiClientUtils from '../utils/apiClientUtils.ts';
import { GenericAbortSignal } from 'axios';
import { UserCreateRequest, UserUpdateRequest } from '../types/user.ts';
import { UserSearchParams } from '../types/search.ts';

export const UserService = {
    createUser: async (data: UserCreateRequest) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('phoneNumber', data.phoneNumber);
        formData.append('email', data.email);
        formData.append('role', data.role);
        if (data.profilePicture) {
            formData.append('profilePicture', data.profilePicture);
        }

        const response = await apiClientUtils.post(`/user`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data;
    },

    searchUser: async (filters: Partial<UserSearchParams> = {}, signal?: GenericAbortSignal) => {
        const queryParams = new URLSearchParams(filters as Record<string, string>).toString();
        const response = await apiClientUtils.get(`/user?${queryParams}`, { signal });
        return response.data;
    },

    getUser: async (id: number) => {
        const response = await apiClientUtils.get(`/user/${id}`);
        return response.data.data;
    },

    updateUser: async (id: number, data: UserUpdateRequest) => {
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
        if (data.email) formData.append('email', data.email);
        if (data.role) formData.append('role', data.role);
        if (data.password) {
            formData.append('password', data.password);
        }
        if (data.profilePicture) {
            formData.append('profilePicture', data.profilePicture);
        }
        if (data.deleteProfilePicture) {
            formData.append('deleteProfilePicture', String(data.deleteProfilePicture));
        }

        const response = await apiClientUtils.put(`/user/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data;
    },

    deleteUser: async (id: number) => {
        const response = await apiClientUtils.delete(`/user/${id}`);
        return response.data.message || 'User berhasil dihapus';
    },
};
