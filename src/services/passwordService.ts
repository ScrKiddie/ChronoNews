import apiClientUtils from '../utils/apiClientUtils.ts';
import { z } from 'zod';
import { PasswordSchema } from '../schemas/passwordSchema.ts';

export const PasswordService = {
    updatePassword: async (data: z.infer<typeof PasswordSchema>) => {
        const response = await apiClientUtils.patch(`/user/current/password`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data.data;
    },
};
