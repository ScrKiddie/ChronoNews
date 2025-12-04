export interface ApiError {
    isCancelled?: boolean;
    message: string;
    status?: number;
    isNetworkError?: boolean;
    isSetupError?: boolean;
}
