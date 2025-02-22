import { z } from "zod";

export const UserCreateSchema = z.object({
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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
    password: z.string().superRefine((value, ctx) => {
        if (value.trim().length === 0) {
            ctx.addIssue({
                code: "custom",
                message: "Password tidak boleh kosong",
            });
            return;
        }

        if (value.length < 8) {
            ctx.addIssue({
                code: "custom",
                message: "Password minimal 8 karakter",
            });
        }

        if (value.length > 255) {
            ctx.addIssue({
                code: "custom",
                message: "Password maksimal 255 karakter",
            });
        }

        if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(value)) {
            ctx.addIssue({
                code: "custom",
                message: "Password harus mengandung huruf besar, angka, dan simbol",
            });
        }
    }),
});

export const UserUpdateSchema = z.object({
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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

    password: z.string().superRefine((value, ctx) => {
        if (value == "") {
            return
        }
        if (value.length < 8) {
            ctx.addIssue({
                code: "custom",
                message: "Password minimal 8 karakter",
            });
        }

        if (value.length > 255) {
            ctx.addIssue({
                code: "custom",
                message: "Password maksimal 255 karakter",
            });
        }

        if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(value)) {
            ctx.addIssue({
                code: "custom",
                message: "Password harus mengandung huruf besar, angka, dan simbol",
            });
        }
    }).optional(),
});


export type UserCreateType = z.infer<typeof UserCreateSchema>;
