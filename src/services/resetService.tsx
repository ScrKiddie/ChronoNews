import apiClient from "./apiClient.tsx";
import { Reset, ResetRequest } from "../types/reset.tsx";

export const ResetService = {
    resetRequest: async (data: ResetRequest) => {
        const response = await apiClient.post("/reset/request", data);
        return response.data;
    },
    
    reset: async (data: Reset) => {
        const response = await apiClient.patch("/reset", data);
        return response.data;
    }
};
