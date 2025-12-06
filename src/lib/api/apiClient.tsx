import axios, { AxiosError } from 'axios';

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

const apiClient = axios.create({
    baseURL: `${apiUri}/api`,
});

let onUnauthorized: (() => void) | null = null;
export const setOnUnauthorized = (callback: () => void) => {
    onUnauthorized = callback;
};

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        if (axios.isCancel(error)) {
            return Promise.reject({
                isCancelled: true,
                message: 'Request dibatalkan',
            });
        }

        if (error.response) {
            const { status, data } = error.response;

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
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

export default apiClient;
