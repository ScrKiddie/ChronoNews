import {createContext, useRef, RefObject} from "react";
import {Toast} from "primereact/toast";


type ToastRef = RefObject<Toast | null>;
export const ToastContext = createContext<ToastRef | null>(null);

export const ToastProvider = ({children}) => {
    const toastRef = useRef<Toast>(null);
    return (
        <ToastContext.Provider value={toastRef}>
            {children}
            <Toast ref={toastRef} position="top-center"/>
        </ToastContext.Provider>
    );
};
