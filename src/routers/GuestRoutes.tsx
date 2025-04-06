import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import Login from "../pages/guest/Login.tsx";
import NotFound from "../pages/guest/NotFound.tsx";
import News from "../pages/guest/News.tsx";
import Reset from "../pages/guest/Reset.tsx";
import Forgot from "../pages/guest/ResetRequest.tsx";

const GuestRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" replace/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={<News/>}/>
            <Route path="/:id" element={<News/>}/>
            <Route path="/*" element={<NotFound/>}/>
            <Route path="/reset" element={<Reset/>}/>
            <Route path="/reset/request" element={<Forgot/>}/>
        </Routes>
    );
};

export default GuestRoutes;
