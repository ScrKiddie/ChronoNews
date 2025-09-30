import axios from "axios";

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

export const ResetService = {
    resetRequest: async (data) => {
        try {
            const response = await axios.post(apiUri+"/api/reset/request", data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data?.error || "Gagal mengirim permintaan reset");
            }
            throw error;
        }
    },
    reset: async (data) => {
        try {
            const response = await axios.patch(apiUri+"/api/reset", data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data?.error || "Gagal mereset password");
            }
            throw error;
        }
    }
};
