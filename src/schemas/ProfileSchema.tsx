import {z} from "zod";

export const ProfileSchema = z.object({
    name: z.string().superRefine((value, ctx) => {
        if (value.trim().length === 0) {
            ctx.addIssue({
                code: "custom",
                message: "Nama tidak boleh kosong",
            });
            return;
        }

        if (value.length < 3) {
            ctx.addIssue({
                code: "custom",
                message: "Nama minimal 3 karakter",
            });
        }

        if (value.length > 255) {
            ctx.addIssue({
                code: "custom",
                message: "Nama maksimal 255 karakter",
            });
        }
    }),

    phoneNumber: z.string().superRefine((value, ctx) => {
        if (value.trim().length === 0) {
            ctx.addIssue({
                code: "custom",
                message: "Nomor telepon tidak boleh kosong",
            });
            return;
        }

        if (value.length > 20) {
            ctx.addIssue({
                code: "custom",
                message: "Nomor telepon maksimal 20 karakter",
            });
        }
    }),

    email: z.string().superRefine((value, ctx) => {
        if (value.trim().length === 0) {
            ctx.addIssue({
                code: "custom",
                message: "Email tidak boleh kosong",
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]+[a-zA-Z0-9]*[a-zA-Z]$/;
        if (!emailRegex.test(value)) {
            ctx.addIssue({
                code: "custom",
                message: "Format email tidak valid",
            });
        }

        if (value.length > 255) {
            ctx.addIssue({
                code: "custom",
                message: "Email maksimal 255 karakter",
            });
        }
    }),
});

export type ProfileType = z.infer<typeof ProfileSchema>;
