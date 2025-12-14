import apiClientUtils from '../utils/apiClientUtils.ts';
import { z } from 'zod';
import { ResetRequestSchema, ResetSchema } from '../schemas/resetSchema.ts';

export const ResetService = {
    resetRequest: async (data: z.infer<typeof ResetRequestSchema>) => {
        const response = await apiClientUtils.post('/reset/request', data);
        return response.data;
    },

    reset: async (data: z.infer<typeof ResetSchema>) => {
        const response = await apiClientUtils.patch('/reset', data);
        return response.data;
    },
};
