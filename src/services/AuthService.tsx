import axios from "axios";
const apiUri = import.meta.env.VITE_CHRONOVERSE_API_URI;

export const loginUser = async (data: LoginData) => {
    try {
        const response = await axios.post(apiUri+"/api/user/login", data);
        return response.data;
    } catch (error: never) {
        throw new Error(error.response?.status === 500 ? "Terjadi kesalahan jaringan" : error.response?.data?.error || "Terjadi kesalahan jaringan");
    }
};
