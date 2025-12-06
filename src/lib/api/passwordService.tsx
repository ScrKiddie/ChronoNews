import apiClient from './apiClient.tsx';
import { z } from 'zod';
import { PasswordSchema } from '../../schemas/passwordSchema.tsx';

export const PasswordService = {
    updatePassword: async (data: z.infer<typeof PasswordSchema>) => {
        const response = await apiClient.patch(`/user/current/password`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data.data;
    },
};
