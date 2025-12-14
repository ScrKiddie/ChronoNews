import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/guest/Login.tsx';
import NotFound from '../pages/guest/NotFound.tsx';
import Post from '../pages/guest/Post.tsx';
import Reset from '../pages/guest/Reset.tsx';
import Forgot from '../pages/guest/ResetRequest.tsx';
import { InitialDataStructure } from '../types/initialData.ts';

interface GuestRoutesProps {
    initialData?: InitialDataStructure;
}

const GuestRoutes = ({ initialData }: GuestRoutesProps) => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/berita" replace />} />
            <Route path="/login" element={<Login />} />

            <Route path="/cari" element={<Post initialData={initialData} />} />
            <Route path="/berita" element={<Post initialData={initialData} />} />

            <Route path="/post/:id/:slug" element={<Post initialData={initialData} />} />

            <Route path="/reset" element={<Reset />} />
            <Route path="/reset/request" element={<Forgot />} />
            <Route path="/*" element={<NotFound />} />
        </Routes>
    );
};

export default GuestRoutes;
