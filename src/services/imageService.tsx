import axios from "axios";

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

export const ImageService = {
    uploadImage: async (imageFile: File, token: string) => {
        try {
            const formData = new FormData();
            formData.append("image", imageFile);

            const response = await axios.post(`${apiUri}/api/image`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data.data;
        } catch (error) {
            throw error;
        }
    },
};