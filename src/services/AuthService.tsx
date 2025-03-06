import axios from "axios";
import { LoginData } from "../schemas/authSchema";
const apiUri = import.meta.env.VITE_CHRONOVERSE_API_URI;

export const loginUser = async (data: LoginData) => {
    try {
        const response = await axios.post(apiUri+"/api/user/login", data);
        return response.data;
    } catch (error: never) {
        throw new Error(error.response?.data?.error || "Terjadi kesalahan jaringan");
    }
};
