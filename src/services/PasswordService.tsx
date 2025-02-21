import axios from "axios";

const API_URL = "http://localhost:3000/api/user/current/password";

export const PasswordService = {
    updatePassword: async (data, token) => {
        try {
            const response = await axios.patch(API_URL, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Terjadi kesalahan jaringan");
        }
    }
};
