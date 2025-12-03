import apiClient from "./apiClient.tsx";

export const PasswordService = {
    updatePassword: async (data: any) => {
        const response = await apiClient.patch(`/user/current/password`, data, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data.data;
    }
};
