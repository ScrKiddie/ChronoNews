import { ReactNode, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { ToastContext } from './ToastContext';

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
    const toastRef = useRef<Toast | null>(null);

    return (
        <>
            <Toast ref={toastRef} position="top-center" />
            <ToastContext.Provider value={toastRef}>{children}</ToastContext.Provider>
        </>
    );
};
