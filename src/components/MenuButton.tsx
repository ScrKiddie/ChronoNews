import React, {useRef, useState} from "react";
import {Button} from "primereact/button";
import {Menu as PrimeMenu} from "primereact/menu";

const MenuButton = ({openProfileModal}) => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [key, setKey] = useState(0);
    const buttonRef = useRef(null);
    const menuContainerRef = useRef(null);

    const toggleMenuVisibility = (event) => {
        event.stopPropagation();
        setIsMenuVisible((prev) => {
            if (!prev) setKey((prevKey) => prevKey + 1);
            return !prev;
        });
    };

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

    React.useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <Button ref={buttonRef} severity="secondary" onClick={toggleMenuVisibility} text rounded
                    className={`size-8`} icon={<i className={`pi pi-bars text-md`}/>}/>
            <div ref={menuContainerRef} className={`absolute top-0 right-0`}>
                <PrimeMenu
                    key={key}
                    className={`${isMenuVisible ? "visible" : "hidden"} text-md shadow-md absolute top-[70px] right-1`}
                    model={[
                        {
                            label: "Profile",
                            icon: <i className="pi pi-user pr-3"/>,
                            command: openProfileModal
                        },
                        {
                            label: "Password",
                            icon: <i className="pi pi-key pr-3"/>,
                            command: () => {
                            } // Add your logic here
                        },
                        {label: "Keluar", icon: <i className="pi pi-sign-out pr-3"/>},
                    ]}
                />
            </div>
        </>
    );
};

export default MenuButton;