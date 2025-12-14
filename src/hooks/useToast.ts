import { useContext } from 'react';
import { ToastRef } from '../types/toast.ts';
import { ToastContext } from '../context/ToastContext';

export const useToast = (): ToastRef => {
    const toastRef = useContext(ToastContext);

    if (!toastRef) {
        throw new Error('useToast harus digunakan dalam ToastProvider');
    }

    return toastRef;
};
