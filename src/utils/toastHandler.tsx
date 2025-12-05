import { ApiError } from "../types/api.tsx";
import { ToastRef } from "../types/toast.tsx";

export const showSuccessToast = (toastRef: ToastRef, message: string) => {
    toastRef.current?.show({ severity: "success", detail: message, life: 2000 });
};

export const showErrorToast = (toastRef: ToastRef, message: string) => {
    toastRef.current?.show({ severity: "error", detail: message, life: 3000 });
};

export const handleApiError = (
    error: ApiError,
    toastRef: ToastRef
) => {
    if (error?.isCancelled) {
        console.log("Request cancelled:", error.message);
        return;
    }

    if (error?.message) {
        showErrorToast(toastRef, error.message);
    } else {
        showErrorToast(toastRef, "Terjadi kesalahan yang tidak diketahui.");
    }
};

export const handleApiErrorWithRetry = (
    error: ApiError,
    setVisibleConnectionError: (visible: boolean) => void
) => {
    if (error?.isCancelled) {
        console.log("Request cancelled:", error.message);
        return;
    }

    if (error?.isNetworkError || error?.isSetupError) {
        setVisibleConnectionError(true);
    } else {
        console.error("API Error (Retry Handler):", error?.message || error);
        setVisibleConnectionError(true);
    }
};
