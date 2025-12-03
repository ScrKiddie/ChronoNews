import apiClient from "./apiClient.tsx";

export const ResetService = {
    resetRequest: async (data: any) => {
        const response = await apiClient.post("/reset/request", data);
        return response.data;
    },
    
    reset: async (data: any) => {
        const response = await apiClient.patch("/reset", data);
        return response.data;
    }
};
