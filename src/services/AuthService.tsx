import axios from "axios";
import { LoginData } from "../schemas/authSchema";

const API_URL = "http://localhost:3000/api/user/login";

export const loginUser = async (data: LoginData) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error: never) {
        throw new Error(error.response?.data?.error || "Terjadi kesalahan jaringan");
    }
};
