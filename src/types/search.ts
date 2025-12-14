export interface PaginationParams {
    page?: number;
    size?: number;
}

export interface SortParams {
    sort?: string;
}

export interface PostSearchFilters {
    title?: string;
    categoryName?: string;
    userName?: string;
    summary?: string;
    startDate?: number;
    endDate?: number;
    userID?: number | string;
    excludeIds?: string;
}

export interface UserSearchFilters {
    name?: string;
    email?: string;
    phoneNumber?: string;
    role?: string;
}

export type PostSearchParams = PostSearchFilters & PaginationParams & SortParams;

export type UserSearchParams = UserSearchFilters & PaginationParams & SortParams;
