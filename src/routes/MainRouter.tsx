import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GuestRoutes from './GuestRoutes';
import AuthRoutes from './AuthRoutes';

const MainRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/*" element={<GuestRoutes />} />
                <Route path="/admin/*" element={<AuthRoutes />} />
            </Routes>
        </Router>
    );
};

export default MainRouter;
