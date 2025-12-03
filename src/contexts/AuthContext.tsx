import {createContext, useState, useEffect} from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import apiClient, {setOnUnauthorized} from "../services/apiClient.tsx";

interface DecodedToken {
    role: string;
    exp: number;
    sub: number;
}

interface AuthContextType {
    sub: number | null;
    token: string | null;
    role: string | null;
    isAuthChecked: boolean;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState<string | null>(() => Cookies.get("token") || null);
    const [sub, setSub] = useState<number | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    const logout = () => {
        setToken(null);
        setRole(null);
        setSub(null);
        Cookies.remove("token");
    };

    useEffect(() => {
        setOnUnauthorized(() => logout());

        if (token) {
            try {
                const decoded: DecodedToken = jwtDecode(token);
                const currentTime = Math.floor(Date.now() / 1000);

                if (decoded.exp < currentTime) {
                    logout();
                } else {
                    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    setRole(decoded.role);
                    setSub(decoded.sub);
                }
            } catch (error) {
                console.error("Token tidak valid", error);
                logout();
            }
        } else {
            delete apiClient.defaults.headers.common['Authorization'];
        }
        setIsAuthChecked(true);
    }, [token]);

    const login = (newToken: string) => {
        try {
            const decoded: DecodedToken = jwtDecode(newToken);
            const currentTime = Math.floor(Date.now() / 1000);
            const expiresInSeconds = decoded.exp - currentTime;
            const expiresInDays = expiresInSeconds / (60 * 60 * 24);

            Cookies.set("token", newToken, {
                expires: expiresInDays,
                secure: true,
                sameSite: "Strict",
            });
            setToken(newToken);
        } catch (error) {
            console.error("Token tidak valid", error);
            logout();
        }
    };

    return (
        <AuthContext.Provider value={{sub, token, role, isAuthChecked, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};


