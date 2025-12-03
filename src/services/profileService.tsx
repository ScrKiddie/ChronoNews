import apiClient from "./apiClient.tsx";

export const ProfileService = {
    getCurrentUser: async () => {
        const response = await apiClient.get("/user/current");
        return response.data.data;
    },
    
    updateCurrentUser: async (data: any) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("email", data.email);
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
