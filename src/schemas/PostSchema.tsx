import { z } from "zod";

export const PostCreateSchema = z.object({
    title: z.string().superRefine((value, ctx) => {
        if (value.trim().length === 0) {
            ctx.addIssue({ code: "custom", message: "Judul tidak boleh kosong" });
            return;
        }
        if (value.length < 3) {
            ctx.addIssue({ code: "custom", message: "Judul minimal 3 karakter" });
        }
        if (value.length > 255) {
            ctx.addIssue({ code: "custom", message: "Judul maksimal 255 karakter" });
        }
    }),

    summary: z.string().superRefine((value, ctx) => {
        if (value.trim().length === 0) {
            ctx.addIssue({ code: "custom", message: "Ringkasan tidak boleh kosong" });
            return;
        }
        if (value.length > 1000) {
            ctx.addIssue({ code: "custom", message: "Ringkasan maksimal 1000 karakter" });
        }
    }),

    content: z.string().superRefine((value, ctx) => {
        if (value.trim().length === 0) {
            ctx.addIssue({ code: "custom", message: "Konten tidak boleh kosong" });
        }
    }),

    categoryID: z.number().superRefine((value, ctx) => {
        if (value === undefined || value === null || value === 0) {
            ctx.addIssue({ code: "custom", message: "Kategori tidak boleh kosong" });
            return;
        }
        if (!Number.isInteger(value) || value <= 0) {
            ctx.addIssue({ code: "custom", message: "Kategori harus berupa angka positif" });
        }
    }),
    userID: z.number().optional().superRefine((value, ctx) => {
        if (value !== undefined && value !== null) {
            if (!Number.isInteger(value) || value < 0) {
                ctx.addIssue({ code: "custom", message: "User harus berupa angka positif" });
            }
        }
    }),
});

export const PostUpdateSchema = z.object({
    title: z.string().superRefine((value, ctx) => {
        if (value.trim().length === 0) {
            ctx.addIssue({ code: "custom", message: "Judul tidak boleh kosong" });
            return;
        }
        if (value.length < 3) {
            ctx.addIssue({ code: "custom", message: "Judul minimal 3 karakter" });
        }
        if (value.length > 255) {
            ctx.addIssue({ code: "custom", message: "Judul maksimal 255 karakter" });
        }
    }),

    summary: z.string().superRefine((value, ctx) => {
        if (value.trim().length === 0) {
            ctx.addIssue({ code: "custom", message: "Ringkasan tidak boleh kosong" });
            return;
        }
        if (value.length > 1000) {
            ctx.addIssue({ code: "custom", message: "Ringkasan maksimal 1000 karakter" });
        }
    }),

    content: z.string().superRefine((value, ctx) => {
        if (value.trim().length === 0) {
            ctx.addIssue({ code: "custom", message: "Konten tidak boleh kosong" });
        }
    }),

    categoryID: z.number().superRefine((value, ctx) => {
        if (value === undefined || value === null || value === 0) {
            ctx.addIssue({ code: "custom", message: "Kategori tidak boleh kosong" });
            return;
        }
        if (!Number.isInteger(value) || value <= 0) {
            ctx.addIssue({ code: "custom", message: "Kategori harus berupa angka positif" });
        }
    }),

    userID: z.number().optional().superRefine((value, ctx) => {
        if (value !== undefined && value !== null) {
            if (!Number.isInteger(value) || value < 0) {
                ctx.addIssue({ code: "custom", message: "User harus berupa angka positif" });
            }
        }
    }),

});

export const PostSearchSchema = z.object({
    userID: z.number().optional().superRefine((value, ctx) => {
        if (value !== undefined && (!Number.isInteger(value) || value <= 0)) {
            ctx.addIssue({ code: "custom", message: "User ID harus berupa angka positif" });
        }
    }),

    title: z.string().optional().superRefine((value, ctx) => {
        if (value !== undefined && value.length > 255) {
            ctx.addIssue({ code: "custom", message: "Judul maksimal 255 karakter" });
        }
    }),

    categoryName: z.string().optional().superRefine((value, ctx) => {
        if (value !== undefined && value.length > 255) {
            ctx.addIssue({ code: "custom", message: "Nama kategori maksimal 255 karakter" });
        }
    }),

    userName: z.string().optional().superRefine((value, ctx) => {
        if (value !== undefined && value.length > 255) {
            ctx.addIssue({ code: "custom", message: "Nama pengguna maksimal 255 karakter" });
        }
    }),

    summary: z.string().optional().superRefine((value, ctx) => {
        if (value !== undefined && value.length > 1000) {
            ctx.addIssue({ code: "custom", message: "Ringkasan maksimal 1000 karakter" });
        }
    }),

    page: z.number().optional().superRefine((value, ctx) => {
        if (value !== undefined && (!Number.isInteger(value) || value <= 0)) {
            ctx.addIssue({ code: "custom", message: "Halaman harus berupa angka positif" });
        }
    }),

    size: z.number().optional().superRefine((value, ctx) => {
        if (value !== undefined && (!Number.isInteger(value) || value <= 0)) {
            ctx.addIssue({ code: "custom", message: "Ukuran halaman harus berupa angka positif" });
        }
    }),
});

export const PostDeleteSchema = z.object({
    id: z.number().superRefine((value, ctx) => {
        if (value === undefined || value === null || value === 0) {
            ctx.addIssue({ code: "custom", message: "ID Post tidak boleh kosong" });
            return;
        }
        if (!Number.isInteger(value) || value <= 0) {
            ctx.addIssue({ code: "custom", message: "ID Post harus berupa angka positif" });
        }
    }),
});

// Exporting inferred types
export type PostCreateType = z.infer<typeof PostCreateSchema>;
export type PostUpdateType = z.infer<typeof PostUpdateSchema>;
export type PostSearchType = z.infer<typeof PostSearchSchema>;
export type PostDeleteType = z.infer<typeof PostDeleteSchema>;
