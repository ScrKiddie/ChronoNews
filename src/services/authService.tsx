import axios from "axios";
import {handleResponseError} from "../utils/responseHandler.tsx";

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

export const loginUser = async (data) => {
    try {
        const response = await axios.post(apiUri+"/api/user/login", data);
        return response.data;
    } catch (error) {
        handleResponseError(error);
    }
};
