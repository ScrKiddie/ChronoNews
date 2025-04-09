import React, { createContext, useState } from "react";

interface AbortContextType {
    abortController: AbortController | null;
    setAbortController: React.Dispatch<React.SetStateAction<AbortController | null>>;
}

export const AbortContext = createContext<AbortContextType | undefined>(undefined);

export const AbortProvider: React.FC = ({ children }) => {
    const [abortController, setAbortController] = useState<AbortController | null>(null);

    return (
        <AbortContext.Provider value={{ abortController, setAbortController }}>
            {children}
        </AbortContext.Provider>
    );
};

