import axios from "axios";

const apiUri = import.meta.env.VITE_CHRONOVERSE_API_URI;

export const ProfileService = {
    getCurrentUser: async (token) => {
        try {
            const response = await axios.get(apiUri+"/api/user/current", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Terjadi kesalahan jaringan");
        }
    },
    updateCurrentUser: async (data, token) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("phoneNumber", data.phoneNumber);
            formData.append("email", data.email);
            if (data.profilePicture) {
                formData.append("profilePicture", data.profilePicture);
            }

            const response = await axios.patch(`${apiUri}/api/user/current/profile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            return response.data.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Terjadi kesalahan jaringan");
        }
    }
};
