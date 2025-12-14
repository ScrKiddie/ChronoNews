import apiClientUtils from '../utils/apiClientUtils.ts';

export const ImageService = {
    uploadImage: async (imageFile: File) => {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await apiClientUtils.post(`/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.data;
    },
};
