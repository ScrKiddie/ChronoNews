import apiClient from "./apiClient.tsx";
import { UserUpdateRequest } from "../types/user.tsx";

export const ProfileService = {
    getCurrentUser: async () => {
        const response = await apiClient.get("/user/current");
        return response.data.data;
    },
    
    updateCurrentUser: async (data: UserUpdateRequest) => {
        const formData = new FormData();
        if (data.name) formData.append("name", data.name);
        if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
        if (data.email) formData.append("email", data.email);
        if (data.profilePicture) {
            formData.append("profilePicture", data.profilePicture);
        }
        if (data.deleteProfilePicture) {
            formData.append("deleteProfilePicture", String(data.deleteProfilePicture));
        }

        const response = await apiClient.patch(`/user/current/profile`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data.data;
    }
};
