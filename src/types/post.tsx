export interface Category {
    id: number;
    name: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    role: string
}

export interface Post {
    id: string;
    title: string;
    summary: string;
    content: string;
    thumbnail: string;
    viewCount: number;
    createdAt: number;
    updatedAt: number;
    category: Category;
    user: User;
}

export interface Pagination {
    totalItem: number;
    totalPage: number;
    currentPage: number;
    size: number;
}

export interface SearchPostResponse {
    data: Post[];
    pagination: Pagination;
}

export interface SearchFilters {
    title?: string;
    categoryName?: string;
    userName?: string;
    summary?: string;
    page?: number;
    size?: number;
    sort?: string;
    startDate?: number;
    endDate?: number;
    userID?: number | string;
}

export interface PostFormData {
    title: string;
    summary: string;
    content: string;
    userID?: number;
    categoryID: number;
    thumbnail?: string | File;
    deleteThumbnail?: boolean;
}

export interface ApiPostRequest {
    title: string;
    summary: string;
    content: string;
    userID: number;
    categoryID: number;
    thumbnail?: File;
    deleteThumbnail?: boolean;
}

export interface PostFormErrors {
    [key: string]: string | undefined;
}

export interface DropdownOption {
    label: string;
    value: number;
}