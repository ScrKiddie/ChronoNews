import { z } from "zod";
import { PostCreateSchema, PostUpdateSchema } from "../schemas/postSchema.tsx";
import { User } from "./user.tsx";
import { Category } from "./category.tsx";

export type { User, Category };

export interface Post {
    id: number | null;
    title: string;
    summary: string;
    content: string;
    thumbnail: string;
    viewCount: number;
    createdAt: string | number;
    updatedAt?: string | number;
    category: Category;
    user: User;
}

export type PostFormData = z.infer<typeof PostCreateSchema> & z.infer<typeof PostUpdateSchema> & {
    thumbnail?: string | File;
    deleteThumbnail?: boolean;
};

export type ApiPostRequest = z.infer<typeof PostCreateSchema> & {
    thumbnail?: File;
    deleteThumbnail?: boolean;
};

export interface PostFormErrors {
    [key: string]: string | undefined;
}

export interface DropdownOption {
    label: string;
    value: number;
}
