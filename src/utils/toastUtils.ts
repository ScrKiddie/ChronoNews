import { ApiError } from '../types/api.ts';
import { ToastRef } from '../types/toast.ts';

export const showSuccessToast = (toastRef: ToastRef, message: string) => {
    toastRef.current?.show({ severity: 'success', detail: message, life: 2000 });
};

export const showErrorToast = (toastRef: ToastRef, message: string) => {
    toastRef.current?.show({ severity: 'error', detail: message, life: 3000 });
};

export const handleApiError = (error: ApiError, toastRef: ToastRef) => {
    if (error?.isCancelled) {
        void error;
        return;
    }

    if (error?.message) {
        showErrorToast(toastRef, error.message);
    } else {
        showErrorToast(toastRef, 'Terjadi kesalahan yang tidak diketahui.');
    }
};
