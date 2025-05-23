import {createContext, useState, useEffect} from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

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
    const [token, setToken] = useState<string | null>(null);
    const [sub, setSub] = useState<number | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    useEffect(() => {
        const savedToken = Cookies.get("token");
        if (savedToken) {
            try {
                const decoded: DecodedToken = jwtDecode(savedToken);
                const currentTime = Math.floor(Date.now() / 1000);

                if (decoded.exp < currentTime) {
                    logout();
                } else {
                    setToken(savedToken);
                    setRole(decoded.role);
                    setSub(decoded.sub);
                }
            } catch (error) {
                console.error("Token tidak valid", error);
                logout();
            }
        }
        setIsAuthChecked(true);
    }, []);

    const login = (token: string) => {
        try {
            const decoded: DecodedToken = jwtDecode(token);

            setToken(token);
            setRole(decoded.role);
            setSub(decoded.sub);
            setIsAuthChecked(true);

            const currentTime = Math.floor(Date.now() / 1000);
            const expiresInSeconds = decoded.exp - currentTime;
            const expiresInDays = expiresInSeconds / (60 * 60 * 24);

            Cookies.set("token", token, {
                expires: expiresInDays,
                secure: true,
                sameSite: "Strict",
            });

        } catch (error) {
            console.error("Token tidak valid", error);
            logout();
        }
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        setSub(null)
        Cookies.remove("token");
    };

    return (
        <AuthContext.Provider value={{sub, token, role, isAuthChecked, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
