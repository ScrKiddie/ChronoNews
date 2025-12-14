import axios, { AxiosError } from 'axios';

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

interface ApiErrorResponse {
    error?: string;
    message?: string;
}

const apiClientUtils = axios.create({
    baseURL: `${apiUri}/api`,
});

let onUnauthorized: (() => void) | null = null;
export const setOnUnauthorized = (callback: () => void) => {
    onUnauthorized = callback;
};

apiClientUtils.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError<ApiErrorResponse>) => {
        if (axios.isCancel(error)) {
            return Promise.reject({
                isCancelled: true,
                message: 'Request dibatalkan',
            });
        }

        if (error.response) {
            const { status, data } = error.response;

            const message = data?.error || data?.message || error.message;

            if (status === 401 && onUnauthorized && message === 'Unauthorized') {
                onUnauthorized();
            }

            return Promise.reject({ status, message, data, isApiError: true });
        }

        if (error.request) {
            return Promise.reject({
                isNetworkError: true,
                message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
            });
        }

        return Promise.reject({
            isSetupError: true,
            message: error.message || 'Terjadi kesalahan saat menyiapkan permintaan.',
        });
    }
);

export default apiClientUtils;
