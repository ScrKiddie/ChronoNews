import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/guest/Login.tsx";
import NotFound from "../pages/guest/NotFound.tsx";

const GuestRoutes = () => {
    return (
    <Routes>
        <Route path="/*" element={<NotFound />} />
        <Route path="/login" element={
            <Login />} />
    </Routes>
);
};

export default GuestRoutes;
