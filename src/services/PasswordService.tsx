import axios from "axios";

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

export const PasswordService = {
    updatePassword: async (data, token) => {
        try {
            const response = await axios.patch(apiUri+"/api/user/current/password", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            return response.data;
        } catch (error) {
            throw new Error(error.response?.status === 500 ? "Kesalahan server, coba lagi nanti" : error.response?.data?.error || "Terjadi kesalahan jaringan");
        }
    }
};
