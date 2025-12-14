import apiClientUtils from '../utils/apiClientUtils.ts';
import { ProfileUpdateServiceRequest } from '../types/user.ts';

export const ProfileService = {
    getCurrentUser: async () => {
        const response = await apiClientUtils.get('/user/current');
        return response.data.data;
    },

    updateCurrentUser: async (data: ProfileUpdateServiceRequest) => {
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
        if (data.email) formData.append('email', data.email);
        if (data.profilePicture) {
            formData.append('profilePicture', data.profilePicture);
        }
        if (data.deleteProfilePicture) {
            formData.append('deleteProfilePicture', String(data.deleteProfilePicture));
        }

        const response = await apiClientUtils.patch(`/user/current/profile`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data;
    },
};
