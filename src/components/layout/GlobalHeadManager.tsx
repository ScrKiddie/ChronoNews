import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { restoreDefaultHead } from '../../lib/utils/restoreHead.tsx';

export const GlobalHeadManager = () => {
    const location = useLocation();

    useEffect(() => {
        if (!location.pathname.startsWith('/post/')) {
            restoreDefaultHead();
        }
    }, [location]);

    return null;
};
