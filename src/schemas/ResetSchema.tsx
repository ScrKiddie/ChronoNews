import {z} from "zod";

export const ResetRequestSchema = z.object({
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
    tokenCaptcha: z.string().superRefine((value, ctx) => {
        if (value.length === 0) {
            ctx.addIssue({
                code: "custom",
                message: "Selesaikan CAPTCHA terlebih dulu",
            });
            return;
        }

        if (value.length < 10) {
            ctx.addIssue({
                code: "custom",
                message: "Selesaikan CAPTCHA terlebih dulu",
            });
        }
    }),
});

export const ResetSchema = z.object({
    code: z.string().superRefine((value, ctx) => {
        if (value.trim().length === 0) {
            ctx.addIssue({
                code: "custom",
                message: "Kode reset tidak boleh kosong",
            });
            return;
        }

        if (value.length != 36) {
            ctx.addIssue({
                code: "custom",
                message: "Kode reset tidak valid",
            });
        }

    }),
    password: z.string().superRefine((value, ctx) => {
        if (value.trim().length === 0) {
            ctx.addIssue({
                code: "custom",
                message: "Password baru tidak boleh kosong",
            });
            return;
        }

        if (value.length < 8) {
            ctx.addIssue({
                code: "custom",
                message: "Password baru minimal 8 karakter",
            });
        }

        if (value.length > 255) {
            ctx.addIssue({
                code: "custom",
                message: "Password baru maksimal 255 karakter",
            });
        }

        if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(value)) {
            ctx.addIssue({
                code: "custom",
                message: "Password baru harus mengandung huruf besar, angka, dan simbol",
            });
        }
    }),

    confirmPassword: z.string(),
})
    .superRefine((data, ctx) => {
        if (data.confirmPassword.trim().length === 0) {
            ctx.addIssue({
                path: ["confirmPassword"],
                code: "custom",
                message: "Konfirmasi password baru tidak boleh kosong",
            });
            return;
        }

        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                path: ["confirmPassword"],
                code: "custom",
                message: "Konfirmasi password baru harus sama dengan password baru",
            });
        }
});
