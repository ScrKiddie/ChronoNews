import {z} from "zod";

export const loginSchema = z.object({
    email: z.string().superRefine((value, ctx) => {
        if (value.length === 0) {
            ctx.addIssue({
                code: "custom",
                message: "Email tidak boleh kosong",
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            ctx.addIssue({
                code: "custom",
                message: "Format email tidak valid",
            });
        }
    }),

    password: z.string().superRefine((value, ctx) => {
        if (value.length === 0) {
            ctx.addIssue({
                code: "custom",
                message: "Password tidak boleh kosong",
            });
            return;
        }

        if (
            value.length < 8 ||
            value.length > 255 ||
            !/[A-Z]/.test(value) ||
            !/[a-z]/.test(value) ||
            !/[0-9]/.test(value) ||
            !/[\W_]/.test(value)
        ) {
            ctx.addIssue({
                code: "custom",
                message: "Format password tidak valid",
            });
        }
    }),

    tokenCaptcha: z.string().superRefine((value, ctx) => {
        if (value.length === 0) {
            ctx.addIssue({
                code: "custom",
                message: "Token CAPTCHA tidak boleh kosong",
            });
            return;
        }

        if (value.length < 10) {
            ctx.addIssue({
                code: "custom",
                message: "Token CAPTCHA tidak valid",
            });
        }

    }),
});

export type LoginData = z.infer<typeof loginSchema>;
