import { createContext, useRef, ReactNode, FC } from "react";
import { Toast } from "primereact/toast";
import { ToastContextType } from "../types/toast.tsx";

export const ToastContext = createContext<ToastContextType>(null);

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: FC<ToastProviderProps> = ({ children }) => {
    const toastRef = useRef<Toast | null>(null);

    return (
        <ToastContext.Provider value={toastRef}>
            {children}
            <Toast ref={toastRef} position="top-center" />
        </ToastContext.Provider>
    );
};
