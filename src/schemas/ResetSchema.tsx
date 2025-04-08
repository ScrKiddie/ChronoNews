import { z } from "zod"
import { validateEmail, validatePassword } from "./UserSchema"
import { validateTokenCaptcha } from "./AuthSchema.tsx"

export const ResetRequestSchema = z.object({
    email: validateEmail,
    tokenCaptcha: validateTokenCaptcha,
})

export const ResetSchema = z.object({
        code: z.string().superRefine((value, ctx) => {
            if (value.trim().length === 0) {
                ctx.addIssue({ code: "custom", message: "Kode reset tidak boleh kosong" })
                return
            }
            if (value.length !== 36) {
                ctx.addIssue({ code: "custom", message: "Kode reset tidak valid" })
            }
        }),
        password: validatePassword,
        confirmPassword: z.string(),
    }).superRefine((data, ctx) => {
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
})

