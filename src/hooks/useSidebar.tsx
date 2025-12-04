import {useEffect, useRef, useState} from "react";
import {useAuth} from "./useAuth.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {useToast} from "./useToast.tsx";
import {Button} from "primereact/button";

export const useSidebar = () => {
    const toastRef = useToast();
    const [collapsed, setCollapsed] = useState(false);
    const [toggled, setToggled] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [key, setKey] = useState(0);
    const [isModalLogoutVisible, setIsModalLogoutVisible] = useState(false)
    const {logout} = useAuth();
    const buttonRef = useRef<Button>(null);
    const menuContainerRef = useRef<HTMLDivElement>(null);
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
            (menuLabel as HTMLElement).style.display = collapsed ? "none" : "block";
        });
    }, [collapsed]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setCollapsed(false);
            } else {
                setToggled(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleSidebarToggle = () => setToggled(!toggled);

    const toggleMenuVisibility = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsMenuVisible((prev) => {
            if (!prev) setKey((prevKey) => prevKey + 1);
            return !prev;
        });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuContainerRef.current &&
                !menuContainerRef.current.contains(event.target as Node)
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
