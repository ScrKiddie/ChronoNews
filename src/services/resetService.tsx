import apiClient from "./apiClient.tsx";
import { z } from "zod";
import { ResetRequestSchema, ResetSchema } from "../schemas/resetSchema.tsx";

export const ResetService = {
    resetRequest: async (data: z.infer<typeof ResetRequestSchema>) => {
        const response = await apiClient.post("/reset/request", data);
        return response.data;
    },
    
    reset: async (data: z.infer<typeof ResetSchema>) => {
        const response = await apiClient.patch("/reset", data);
        return response.data;
    }
};
