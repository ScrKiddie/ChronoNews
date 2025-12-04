import { useContext } from "react";
import { ToastContext } from "../contexts/ToastContext";
import { ToastRef } from "../types/toast.tsx";

export const useToast = (): ToastRef => {
    const toastRef = useContext(ToastContext);

    if (!toastRef) {
        throw new Error("useToast harus digunakan dalam ToastProvider");
    }

    return toastRef;
};
