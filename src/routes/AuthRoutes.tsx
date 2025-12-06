import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.tsx';
import Home from '../features/auth/Home.tsx';
import Journalist from '../features/auth/Journalist.tsx';
import NotFound from '../features/guest/NotFound';
import SidebarResponsive from '../components/layout/SidebarResponsive.tsx';
import Category from '../features/auth/Category.tsx';
import Post from '../features/auth/Post.tsx';

const GuestRoutes = () => {
    const { token, isAuthChecked, role } = useAuth();

    if (!isAuthChecked) {
        return <div style={{ backgroundColor: '#f2f2f2', height: '100vh', width: '100vw' }}></div>;
    }

    if (!token) {
        return (
            <Routes>
                <Route path="/beranda" element={<Navigate to="/login" replace />} />
                <Route path="/jurnalis" element={<Navigate to="/login" replace />} />
                <Route path="/kategori" element={<Navigate to="/login" replace />} />
                <Route path="/berita" element={<Navigate to="/login" replace />} />
                <Route path="/*" element={<NotFound />} />
            </Routes>
        );
    }
    return (
        <Routes>
            <Route
                path="/beranda"
                element={
                    <SidebarResponsive>
                        <Home />
                    </SidebarResponsive>
                }
            />
            {role === 'admin' ? (
                <>
                    <Route
                        path="/jurnalis"
                        element={
                            <SidebarResponsive>
                                <Journalist />
                            </SidebarResponsive>
                        }
                    />
                    <Route
                        path="/kategori"
                        element={
                            <SidebarResponsive>
                                <Category />
                            </SidebarResponsive>
                        }
                    />
                </>
            ) : null}
            <Route
                path="/berita"
                element={
                    <SidebarResponsive>
                        <Post />
                    </SidebarResponsive>
                }
            />
            <Route path="/*" element={<NotFound />} />
        </Routes>
    );
};

export default GuestRoutes;
