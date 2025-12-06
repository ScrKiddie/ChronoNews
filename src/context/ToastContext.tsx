import { createContext } from 'react';
import { ToastRef } from '../types/toast';

export const ToastContext = createContext<ToastRef | null>(null);
