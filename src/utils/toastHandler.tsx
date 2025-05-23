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
    if (error instanceof Error) {
        if (error.message === "Unauthorized") {
            handleUnauthorized(toastRef, logout);
        } else {
            showErrorToast(toastRef, error.message);
        }
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
