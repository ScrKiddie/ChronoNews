import {handleApiError} from "../utils/toastHandler.tsx";
import apiClient from "./apiClient.tsx";

export const ProfileService = {
    getCurrentUser: async (token, toast, logout) => {
        try {
            const response = await apiClient.get("/user/current", {
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
    updateCurrentUser: async (data, token, toast, logout) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("phoneNumber", data.phoneNumber);
            formData.append("email", data.email);
            if (data.profilePicture) {
                formData.append("profilePicture", data.profilePicture);
            }
            if (data.deleteProfilePicture) {
                formData.append("deleteProfilePicture", data.deleteProfilePicture);
            }

            const response = await apiClient.patch(`/user/current/profile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            return response.data.data;
        } catch (error) {
            handleApiError(error, toast, logout);
            throw error;
        }
    }
};
