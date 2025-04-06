import axios from "axios";

const apiUri = import.meta.env.VITE_CHRONOVERSE_API_URI;

export const ResetService = {
    resetRequest: async (data) => {
        try {
            const response = await axios.post(apiUri+"/api/reset/request", data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.status === 500 ? "Terjadi kesalahan jaringan" : error.response?.data?.error || "Terjadi kesalahan jaringan");
        }
    },
    reset: async (data) => {
        try {
            const response = await axios.patch(apiUri+"/api/reset", data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.status === 500 ? "Terjadi kesalahan jaringan" : error.response?.data?.error || "Terjadi kesalahan jaringan");
        }
    }
};
