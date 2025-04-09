import { useContext } from "react";
import { AbortContext } from "../contexts/AbortContext";

export const useAbort = () => {
    const context = useContext(AbortContext);

    if (!context) {
        throw new Error("useAbort must be used within an AbortProvider");
    }

    return context;
};
