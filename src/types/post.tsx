export interface Category {
    id: number;
    name: string;
}

export interface User {
    id: number;
    name: string;
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
