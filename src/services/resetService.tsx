import axios from "axios";
import apiClient from "./apiClient.tsx";

export const ResetService = {
    resetRequest: async (data) => {
        try {
            const response = await apiClient.post("/reset/request", data);
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
            const response = await apiClient.patch("/reset", data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data?.error || "Gagal mereset password");
            }
            throw error;
        }
    }
};
