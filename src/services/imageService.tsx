import {handleApiError} from "../utils/toastHandler.tsx";
import apiClient from "./apiClient.tsx";

export const ImageService = {
    uploadImage: async (imageFile: File, token: string, toast: any, logout: () => void) => {
        try {
            const formData = new FormData();
            formData.append("image", imageFile);

            const response = await apiClient.post(`/image`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data.data;
        } catch (error) {
            handleApiError(error, toast, logout);
            throw error;
        }
    },
};