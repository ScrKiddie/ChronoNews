import { RefObject } from "react";
import { Toast } from "primereact/toast";

// Type untuk Toast ref yang digunakan di seluruh aplikasi
export type ToastRef = RefObject<Toast | null>;

// Type untuk Toast context
export type ToastContextType = ToastRef | null;
