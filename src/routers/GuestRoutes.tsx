import {Routes, Route, Navigate} from "react-router-dom";
import Login from "../pages/guest/Login.tsx";
import NotFound from "../pages/guest/NotFound.tsx";
import Post from "../pages/guest/Post.tsx";
import Reset from "../pages/guest/Reset.tsx";
import Forgot from "../pages/guest/ResetRequest.tsx";

const GuestRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/beranda" replace/>}/>
            <Route path="/login" element={<Login/>}/>

            <Route path="/beranda" element={<Post/>}/>
            <Route path="/search" element={<Post/>}/>
            <Route path="/:category" element={<Post/>}/>

            <Route path="/post/:id/:slug" element={<Post/>}/>

            <Route path="/reset" element={<Reset/>}/>
            <Route path="/reset/request" element={<Forgot/>}/>
            <Route path="/*" element={<NotFound/>}/>
        </Routes>
    );
};

export default GuestRoutes;
