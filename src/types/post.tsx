import { z } from 'zod';
import { PostCreateSchema, PostUpdateSchema } from '../schemas/postSchema.tsx';
import { Category } from './category.tsx';

export interface PostUser {
    id: number;
    name: string;
    profilePicture?: string;
    createdAt: string | number;
    updatedAt?: string | number;
}

export interface Post {
    id: number | string;
    title: string;
    summary: string;
    content: string;
    thumbnail: string;
    viewCount: number;
    createdAt: string | number;
    updatedAt?: string | number;
    category: Category;
    user: PostUser;
}

export type PostFormData = z.infer<typeof PostCreateSchema> &
    z.infer<typeof PostUpdateSchema> & {
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
