import axios from "axios";

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

export const loginUser = async (data) => {
    try {
        const response = await axios.post(apiUri+"/api/user/login", data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data?.error || "Login gagal, periksa kembali kredensial Anda.");
        }
        throw error;
    }
};
