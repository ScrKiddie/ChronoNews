import { z } from "zod"

export const validateTitle = z.string().superRefine((value, ctx) => {
    if (value.trim().length === 0) {
        ctx.addIssue({ code: "custom", message: "Judul tidak boleh kosong" })
        return
    }
    if (value.length < 3) {
        ctx.addIssue({ code: "custom", message: "Judul minimal 3 karakter" })
    }
    if (value.length > 255) {
        ctx.addIssue({ code: "custom", message: "Judul maksimal 255 karakter" })
    }
})

export const validateSummary = z.string().superRefine((value, ctx) => {
    if (value.trim().length === 0) {
        ctx.addIssue({ code: "custom", message: "Ringkasan tidak boleh kosong" })
        return
    }
    if (value.length > 1000) {
        ctx.addIssue({ code: "custom", message: "Ringkasan maksimal 1000 karakter" })
    }
})

export const validateCategoryID = z.number().superRefine((value, ctx) => {
    if (value === undefined || value === null || value === 0) {
        ctx.addIssue({ code: "custom", message: "Kategori tidak boleh kosong" })
        return
    }
    if (!Number.isInteger(value) || value <= 0) {
        ctx.addIssue({ code: "custom", message: "Kategori harus berupa angka positif" })
    }
})

export const validateOptionalUserID = z.number().optional().superRefine((value, ctx) => {
    if (value !== undefined && (!Number.isInteger(value) || value < 0)) {
        ctx.addIssue({ code: "custom", message: "User harus berupa angka positif" })
    }
})

export const validateOptionalStringMax = (label: string, max: number) =>
    z.string().optional().superRefine((value, ctx) => {
        if (value !== undefined && value.length > max) {
            ctx.addIssue({ code: "custom", message: `${label} maksimal ${max} karakter` })
        }
    })

export const validateOptionalPositiveInt = (label: string) =>
    z.number().optional().superRefine((value, ctx) => {
        if (value !== undefined && (!Number.isInteger(value) || value <= 0)) {
            ctx.addIssue({ code: "custom", message: `${label} harus berupa angka positif` })
        }
    })

export const validatePostID = z.number().superRefine((value, ctx) => {
    if (value === undefined || value === null || value === 0) {
        ctx.addIssue({ code: "custom", message: "ID RegularPost tidak boleh kosong" })
        return
    }
    if (!Number.isInteger(value) || value <= 0) {
        ctx.addIssue({ code: "custom", message: "ID RegularPost harus berupa angka positif" })
    }
})

export const PostCreateSchema = z.object({
    title: validateTitle,
    summary: validateSummary,
    categoryID: validateCategoryID,
    userID: validateOptionalUserID,
})

export const PostUpdateSchema = z.object({
    title: validateTitle,
    summary: validateSummary,
    categoryID: validateCategoryID,
    userID: validateOptionalUserID,
})