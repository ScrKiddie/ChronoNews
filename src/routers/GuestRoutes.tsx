import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import Login from "../pages/guest/Login.tsx";
import NotFound from "../pages/guest/NotFound.tsx";
import News from "../pages/guest/News.tsx";

const GuestRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/news" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/news/*" element={<News />} />
            <Route path="/*" element={<NotFound />} />
        </Routes>
);
};

export default GuestRoutes;
