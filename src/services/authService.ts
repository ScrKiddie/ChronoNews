import apiClientUtils from '../utils/apiClientUtils.ts';
import { z } from 'zod';
import { loginSchema } from '../schemas/authSchema.ts';

export const loginUser = async (data: z.infer<typeof loginSchema>) => {
    const response = await apiClientUtils.post('/user/login', data);
    return response.data;
};
