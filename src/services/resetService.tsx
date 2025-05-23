import axios from "axios";
import {handleResponseError} from "../utils/responseHandler.tsx";

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

export const ResetService = {
    resetRequest: async (data) => {
        try {
            const response = await axios.post(apiUri+"/api/reset/request", data);
            return response.data;
        } catch (error) {
            handleResponseError(error);
        }
    },
    reset: async (data) => {
        try {
            const response = await axios.patch(apiUri+"/api/reset", data);
            return response.data;
        } catch (error) {
            handleResponseError(error);
        }
    }
};
