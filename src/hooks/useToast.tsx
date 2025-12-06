import { useContext } from 'react';
import { ToastRef } from '../types/toast.tsx';
import { ToastContext } from '../context/ToastContext.tsx';

export const useToast = (): ToastRef => {
    const toastRef = useContext(ToastContext);

    if (!toastRef) {
        throw new Error('useToast harus digunakan dalam ToastProvider');
    }

    return toastRef;
};
