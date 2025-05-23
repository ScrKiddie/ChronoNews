import React, { createContext, useState, ReactNode } from "react";

interface AbortContextType {
    abortController: AbortController | null;
    setAbortController: React.Dispatch<React.SetStateAction<AbortController | null>>;
}

export const AbortContext = createContext<AbortContextType | undefined>(undefined);

interface AbortProviderProps {
    children: ReactNode;
}

export const AbortProvider: React.FC<AbortProviderProps> = ({ children }) => {
    const [abortController, setAbortController] = useState<AbortController | null>(null);

    return (
        <AbortContext.Provider value={{ abortController, setAbortController }}>
            {children}
        </AbortContext.Provider>
    );
};
