import React, { createContext, useRef, RefObject } from "react";
import { Toast } from "primereact/toast";

// Tentukan tipe RefObject untuk Toast
type ToastRef = RefObject<Toast> | null;

// Buat Context dengan tipe yang sesuai
export const ToastContext = createContext<ToastRef>(null);

export const ToastProvider = ({ children }) => {
    const toastRef = useRef<Toast>(null);
    return (
        <ToastContext.Provider value={toastRef}>
            {children}
            <Toast ref={toastRef} position="top-center" />
        </ToastContext.Provider>
    );
};
