import apiClient from "./apiClient.tsx";

export const loginUser = async (data: any) => {
    const response = await apiClient.post("/user/login", data);
    return response.data;
};
