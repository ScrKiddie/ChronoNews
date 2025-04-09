import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import GuestRoutes from "./GuestRoutes";
import AuthRoutes from "./AuthRoutes";
import {AbortProvider} from "../contexts/AbortContext.tsx";

const MainRouter = () => {
    return (
        <AbortProvider>
        <Router>
            <Routes>
                <Route path="/*" element={<GuestRoutes/>}/>

                    <Route path="/admin/*" element={<AuthRoutes/>}/>

            </Routes>
        </Router>
        </AbortProvider>
    );
};

export default MainRouter;
