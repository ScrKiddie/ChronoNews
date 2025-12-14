import { createContext } from 'react';

export interface DecodedToken {
    role: string;
    exp: number;
    sub: number;
}

export interface AuthContextType {
    sub: number | null;
    token: string | null;
    role: string | null;
    isAuthChecked: boolean;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
