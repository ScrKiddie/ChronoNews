import axios from "axios";

const API_URL = "http://localhost:3000/api/user/current";

export const ProfileService = {
    getCurrentUser: async (token) => { // Terima token sebagai parameter
        try {
            const response = await axios.get(API_URL, {
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

            const response = await axios.patch(`${API_URL}/profile`, formData, {
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
