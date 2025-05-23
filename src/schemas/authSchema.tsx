import { z } from "zod"
import { validateEmail, validatePassword } from "./userSchema.tsx"

export const validateTokenCaptcha = z.string().superRefine((value, ctx) => {
    if (value.length === 0 || value.length < 10) {
        ctx.addIssue({
            code: "custom",
            message: "Selesaikan CAPTCHA terlebih dulu",
        })
    }
})

export const loginSchema = z.object({
    email: validateEmail,
    password: validatePassword,
    tokenCaptcha: validateTokenCaptcha
})
