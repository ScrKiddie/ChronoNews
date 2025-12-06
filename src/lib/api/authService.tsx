import apiClient from './apiClient.tsx';
import { z } from 'zod';
import { loginSchema } from '../../schemas/authSchema.tsx';

export const loginUser = async (data: z.infer<typeof loginSchema>) => {
    const response = await apiClient.post('/user/login', data);
    return response.data;
};
