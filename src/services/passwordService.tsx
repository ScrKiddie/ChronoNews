import axios from "axios";
import {handleResponseError} from "../utils/responseHandler.tsx";

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

export const PasswordService = {
    updatePassword: async (data, token) => {
        try {
            const response = await axios.patch(apiUri+"/api/user/current/password", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            return response.data;
        } catch (error) {
            handleResponseError(error);
        }
    }
};
