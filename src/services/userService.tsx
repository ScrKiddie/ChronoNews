import axios from "axios";
import {handleApiError, handleApiErrorWithRetry} from "../utils/toastHandler.tsx";

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

export const UserService = {
    createUser: async (data, token, toast, logout) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("phoneNumber", data.phoneNumber);
            formData.append("email", data.email);
            formData.append("role", data.role);
            if (data.profilePicture) {
                formData.append("profilePicture", data.profilePicture);
            }

            const response = await axios.post(`${apiUri}/api/user`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            return response.data.data;
        } catch (error) {
            handleApiError(error, toast, logout);
            throw error;
        }
    },
    searchUser: async (token, filters: any = {}, signal: any = null, toast, logout, setVisibleConnectionError) => {
        try {
            const { name = "", phoneNumber = "", email = "", page = "", size = "",role="" } = filters;
            const queryParams = new URLSearchParams({ name, phoneNumber, email, page, size,role }).toString();
            const url = `${apiUri}/api/user?${queryParams}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                signal
            });

            return response.data;
        } catch (error) {
            if ((error as any).name === 'CanceledError') {
                throw new Error('Request was cancelled');
            }
            handleApiErrorWithRetry(error, toast, logout, setVisibleConnectionError);
            throw error;
        }
    },
    getUser: async (id, token, toast, logout) => {
        try {
            const response = await axios.get(`${apiUri}/api/user/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data.data;
        } catch (error) {
            handleApiError(error, toast, logout);
            throw error;
        }
    },
    updateUser: async (id, data, token, toast, logout) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("phoneNumber", data.phoneNumber);
            formData.append("email", data.email);
            formData.append("role", data.role);
            if (data.password) {
                formData.append("password", data.password);
            }
            if (data.profilePicture) {
                formData.append("profilePicture", data.profilePicture);
            }
            if (data.deleteProfilePicture) {
                formData.append("deleteProfilePicture", data.deleteProfilePicture);
            }
            const response = await axios.put(`${apiUri}/api/user/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            return response.data.data;
        } catch (error) {
            handleApiError(error, toast, logout);
            throw error;
        }
    },
    deleteUser: async (id, token, toast, logout) => {
        try {
            const response = await axios.delete(`${apiUri}/api/user/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data.message || "User berhasil dihapus";
        } catch (error) {
            handleApiError(error, toast, logout);
            throw error;
        }
    }
};
