import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.tsx";
import Beranda from "../pages/auth/Beranda";
import Journalist from "../pages/auth/Journalist.tsx";
import NotFound from "../pages/guest/NotFound";
import Loading from "../pages/guest/Loading.tsx";
import SidebarResponsive from "../components/SidebarResponsive";
import Category from "../pages/auth/Category.tsx";

const GuestRoutes = () => {
    const { token, isAuthChecked } = useAuth();

    if (!isAuthChecked) {
        return <Loading />;
    }

    if (!token) {
        return <NotFound />;
    }

    return (
            <Routes>
                <Route path="/beranda" element={<SidebarResponsive><Beranda /></SidebarResponsive>} />
                <Route path="/jurnalis" element={<SidebarResponsive><Journalist /></SidebarResponsive>} />
                <Route path="/kategori" element={<SidebarResponsive><Category /></SidebarResponsive>} />
                <Route path="/*" element={<NotFound />} />
            </Routes>
    );
};

export default GuestRoutes;
