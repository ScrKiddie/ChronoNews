import axios from "axios";

export const showSuccessToast = (toastRef: any, message: string) => {
    toastRef?.current?.show({ severity: "success", detail: message, life: 2000 });
};

export const showErrorToast = (toastRef: any, message: string) => {
    toastRef?.current?.show({ severity: "error", detail: message, life: 2000 });
};

export const handleUnauthorized = (toastRef: any, logout: () => void) => {
    showErrorToast(toastRef, "Sesi berakhir, silahkan login kembali");
    logout();
};

export const handleApiError = (
    error: unknown,
    toastRef: any,
    logout: () => void
) => {
    if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const apiErrorMessage = error.response.data?.error;

        if (status === 401) {
            if (apiErrorMessage === "Incorrect old password") {
                showErrorToast(toastRef, apiErrorMessage);
            } else {
                handleUnauthorized(toastRef, logout);
            }
            return;
        }

        const message = apiErrorMessage || "Terjadi kesalahan pada server.";
        showErrorToast(toastRef, message);
    } else if (error instanceof Error) {
        showErrorToast(toastRef, error.message);
    } else {
        showErrorToast(toastRef, "Terjadi kesalahan yang tidak diketahui");
    }
};

export const handleApiErrorWithRetry = (
    error: any,
    toastRef: any,
    logout: () => void,
    setVisibleConnectionError: (visible: boolean) => void
) => {
    if (error?.message === "Unauthorized") {
        handleUnauthorized(toastRef, logout);
    } else if (!error?.response) {
        console.error(error);
        if (error?.message !== "Request was cancelled") {
            setVisibleConnectionError(true);
        }
    } else {
        console.error(error);
        setVisibleConnectionError(true);
    }
};

export const handleApiErrorGuest = (
    error: any,
    setVisibleConnectionError: (visible: boolean) => void
) => {
    if (!error?.response) {
        console.error(error);
        if (error?.message !== "Request was cancelled") {
            setVisibleConnectionError(true);
        }
    } else {
        console.error(error);
        setVisibleConnectionError(true);
    }
};
