import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../features/guest/Login.tsx';
import NotFound from '../features/guest/NotFound.tsx';
import Post from '../features/guest/Post.tsx';
import Reset from '../features/guest/Reset.tsx';
import Forgot from '../features/guest/ResetRequest.tsx';
import { InitialDataStructure } from '../types/initialData.tsx';

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
