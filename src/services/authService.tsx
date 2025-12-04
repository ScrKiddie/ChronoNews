import apiClient from "./apiClient.tsx";
import { LoginData } from "../types/auth.tsx";

export const loginUser = async (data: LoginData) => {
    const response = await apiClient.post("/user/login", data);
    return response.data;
};
