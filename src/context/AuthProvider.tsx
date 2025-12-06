import { ReactNode, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import apiClient, { setOnUnauthorized } from '../lib/api/apiClient';
import { AuthContext, AuthContextType, DecodedToken } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState(() => Cookies.get('token') || null);
    const [sub, setSub] = useState<number | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    const logout = useCallback(() => {
        setToken(null);
        setRole(null);
        setSub(null);
        Cookies.remove('token');
    }, []);

    useEffect(() => {
        setOnUnauthorized(logout);
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
                void error;
                logout();
            }
        } else {
            delete apiClient.defaults.headers.common['Authorization'];
        }
        setIsAuthChecked(true);
    }, [token, logout]);

    const login = useCallback(
        (newToken: string) => {
            try {
                const decoded: DecodedToken = jwtDecode(newToken);
                const currentTime = Math.floor(Date.now() / 1000);
                const expiresInSeconds = decoded.exp - currentTime;
                const expiresInDays = expiresInSeconds / (60 * 60 * 24);
                Cookies.set('token', newToken, {
                    expires: expiresInDays,
                    secure: true,
                    sameSite: 'Strict',
                });
                setToken(newToken);
            } catch (error) {
                void error;
                logout();
            }
        },
        [logout]
    );

    const value: AuthContextType = {
        sub,
        token,
        role,
        isAuthChecked,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
