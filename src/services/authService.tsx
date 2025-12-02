import axios from "axios";
import apiClient from "./apiClient.tsx";

export const loginUser = async (data) => {
    try {
        const response = await apiClient.post("/user/login", data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data?.error || "Login gagal, periksa kembali kredensial Anda.");
        }
        throw error;
    }
};
