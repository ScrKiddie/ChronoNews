import {z} from "zod";

export const PasswordSchema = z
    .object({
        oldPassword: z.string().superRefine((value, ctx) => {
            if (value.trim().length === 0) {
                ctx.addIssue({
                    code: "custom",
                    message: "Password lama tidak boleh kosong",
                });
                return;
            }

            if (value.length < 8) {
                ctx.addIssue({
                    code: "custom",
                    message: "Password lama minimal 8 karakter",
                });
            }

            if (value.length > 255) {
                ctx.addIssue({
                    code: "custom",
                    message: "Password lama maksimal 255 karakter",
                });
            }

            if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(value)) {
                ctx.addIssue({
                    code: "custom",
                    message: "Password lama harus mengandung huruf besar, angka, dan simbol",
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
                message: "Konfirmasi password tidak boleh kosong",
            });
            return;
        }

        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                path: ["confirmPassword"],
                code: "custom",
                message: "Konfirmasi password harus sama dengan password baru",
            });
        }
    });

