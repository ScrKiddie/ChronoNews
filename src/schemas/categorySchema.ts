import { z } from 'zod';

export const CategorySchema = z.object({
    name: z.string().superRefine((value, ctx) => {
        if (value.trim().length === 0) {
            ctx.addIssue({
                code: 'custom',
                message: 'Nama kategori tidak boleh kosong',
            });
            return;
        }

        if (value.length < 3) {
            ctx.addIssue({
                code: 'custom',
                message: 'Nama kategori minimal 3 karakter',
            });
        }

        if (value.length > 100) {
            ctx.addIssue({
                code: 'custom',
                message: 'Nama kategori maksimal 100 karakter',
            });
        }
    }),
});
