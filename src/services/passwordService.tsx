import apiClient from "./apiClient.tsx";
import { PasswordUpdate } from "../types/password.tsx";

export const PasswordService = {
    updatePassword: async (data: PasswordUpdate) => {
        const response = await apiClient.patch(`/user/current/password`, data, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data.data;
    }
};
