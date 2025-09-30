import axios from "axios";
import {handleApiError} from "../utils/toastHandler.tsx";

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

export const PasswordService = {
    updatePassword: async (data, token, toast, logout) => {
        try {
            const response = await axios.patch(`${apiUri}/api/user/current/password`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            return response.data.data;
        } catch (error) {
            handleApiError(error, toast, logout);
            throw error;
        }
    }
};