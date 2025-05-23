import {z} from "zod"
import {validatePassword} from "./userSchema.tsx"

export const PasswordSchema =
    z.object({
    oldPassword: validatePassword,
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
