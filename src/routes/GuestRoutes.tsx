import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../features/guest/Login.tsx';
import NotFound from '../features/guest/NotFound.tsx';
import Post from '../features/guest/Post.tsx';
import Reset from '../features/guest/Reset.tsx';
import Forgot from '../features/guest/ResetRequest.tsx';

const GuestRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/beranda" replace />} />
            <Route path="/login" element={<Login />} />

            <Route path="/beranda" element={<Post />} />
            <Route path="/cari" element={<Post />} />
            <Route path="/berita" element={<Post />} />

            <Route path="/post/:id/:slug" element={<Post />} />

            <Route path="/reset" element={<Reset />} />
            <Route path="/reset/request" element={<Forgot />} />
            <Route path="/*" element={<NotFound />} />
        </Routes>
    );
};

export default GuestRoutes;
