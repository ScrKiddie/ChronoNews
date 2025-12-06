import { RefObject } from 'react';
import { Toast } from 'primereact/toast';

export type ToastRef = RefObject<Toast | null>;

export type ToastContextType = ToastRef | null;
