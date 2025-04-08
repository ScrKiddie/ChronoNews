import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import {useAuth} from "../hooks/useAuth.tsx";
import Beranda from "../pages/auth/Beranda";
import Journalist from "../pages/auth/Journalist.tsx";
import NotFound from "../pages/guest/NotFound";
import Loading from "../pages/guest/Loading.tsx";
import SidebarResponsive from "../components/SidebarResponsive";
import Category from "../pages/auth/Category.tsx";
import Post from "../pages/auth/Post.tsx";

const GuestRoutes = () => {
    const {token, isAuthChecked, role} = useAuth();

    if (!isAuthChecked) {
        return <Loading/>;
    }

    if (!token) {
        return <Navigate to="/login" replace/>;
    }

    return (
        <Routes>
            <Route path="/beranda" element={<SidebarResponsive><Beranda/></SidebarResponsive>}/>
            {role === "admin" ? <>
                <Route path="/jurnalis" element={<SidebarResponsive><Journalist/></SidebarResponsive>}/>
                <Route path="/kategori" element={<SidebarResponsive><Category/></SidebarResponsive>}/>
            </> : ""}

            <Route path="/berita" element={<SidebarResponsive><Post/></SidebarResponsive>}/>
            <Route path="/*" element={<NotFound/>}/>
        </Routes>
    );
};

export default GuestRoutes;
