import { useContext } from "react";
import { ToastContext } from "../contexts/ToastContext";

// Custom Hook untuk menggunakan Toast
export const useToast = () => {
    const toastRef = useContext(ToastContext);
    if (!toastRef) {
        throw new Error("useToast harus digunakan dalam ToastProvider");
    }
    return toastRef;
};
