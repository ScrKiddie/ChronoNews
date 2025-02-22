import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const UserService = {
    createUser: async (data, token) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("phoneNumber", data.phoneNumber);
            formData.append("email", data.email);
            formData.append("password", data.password);
            if (data.profilePicture) {
                formData.append("profilePicture", data.profilePicture);
            }

            const response = await axios.post(`${API_URL}/user`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            return response.data.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || "Terjadi kesalahan jaringan");
        }
    }
};
