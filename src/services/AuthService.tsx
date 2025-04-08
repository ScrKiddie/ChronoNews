import axios from "axios";
const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

export const loginUser = async (data) => {
    try {
        const response = await axios.post(apiUri+"/api/user/login", data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.status === 500 ? "Kesalahan server, coba lagi nanti" : error.response?.data?.error || "Terjadi kesalahan jaringan");
    }
};
