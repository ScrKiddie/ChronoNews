import {useEffect, useRef, useState} from "react";
import {useAuth} from "./useAuth.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {useToast} from "./useToast.tsx";

export const useSidebar = () => {
    const toastRef = useToast();
    const [collapsed, setCollapsed] = useState(false);
    const [toggled, setToggled] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [key, setKey] = useState(0);
    const [isModalLogoutVisible, setIsModalLogoutVisible] = useState(false)
    const {logout} = useAuth();
    const buttonRef = useRef(null);
    const menuContainerRef = useRef(null);
    const navigate = useNavigate();
    const [lastPath, setLastPath] = useState('');
    const location = useLocation();
    useEffect(() => {
        const path = location.pathname;
        const pathParts = path.split('/');
        const lastPathSegment = pathParts[pathParts.length - 1];

        const formattedPath = lastPathSegment.charAt(0).toUpperCase() + lastPathSegment.slice(1);
        setLastPath(formattedPath);
    }, [location]);

    const onLogout = () => {
        logout();
        toastRef.current?.show({severity: "success", detail: "Berhasil keluar dari sistem", life: 2000});
        navigate("/login");
    }

    useEffect(() => {
        document.querySelectorAll('.ps-menu-label').forEach((menuLabel) => {
            menuLabel.style.display = collapsed ? "none" : "block";
        });
    }, [collapsed]);

    useEffect(() => {
        const checkViewportWidth = () => {
            if (window.innerWidth <= 768) {
                setCollapsed(false);
            } else {
                setToggled(false);
            }
        };

        checkViewportWidth();
        window.addEventListener("resize", checkViewportWidth);

        return () => {
            window.removeEventListener("resize", checkViewportWidth);
        };
    }, []);

    const handleSidebarToggle = () => setToggled(!toggled);

    const toggleMenuVisibility = (event) => {
        event.stopPropagation();
        setIsMenuVisible((prev) => {
            if (!prev) setKey((prevKey) => prevKey + 1);
            return !prev;
        });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuContainerRef.current &&
                !menuContainerRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsMenuVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return {
        collapsed,
        toggled,
        isMenuVisible,
        key,
        buttonRef,
        menuContainerRef,
        handleSidebarToggle,
        toggleMenuVisibility,
        setIsMenuVisible,
        setToggled,
        setCollapsed,
        isModalLogoutVisible,
        setIsModalLogoutVisible,
        onLogout,
        lastPath
    };
};
