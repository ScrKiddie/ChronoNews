import {useLocation, useNavigate} from "react-router-dom";
import {MenuItem} from "react-pro-sidebar";
import {Button} from "primereact/button";

interface MenuItemResponsiveProps {
    collapsed: boolean;
    icon: string;
    link: string;
    label: string;
}

const MenuItemResponsive = ({collapsed, icon, link, label}: MenuItemResponsiveProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleClick = () => {
        if (location.pathname !== link) {
            navigate(link);
        }
    };

    return (
        <MenuItem
            className={`${collapsed ? "mb-[14.5px]" : "mb-3"} `}
            icon={<i style={{fontSize: '1.25rem'}} className={`${icon}`}/>}
            component={

                <Button
                    className={`flex items-center ${
                        collapsed ? "justify-center" : ""
                    } rounded hover:bg-[#f49f14] ${
                        location.pathname === link ? "bg-[#f59e0b]" : ""
                    }  transition-all ${
                        collapsed ? "size-[70%]" : "size-[100%] px-24"
                    }`}
                    text
                    onClick={handleClick}
                />
            }
        >
            <h1 className={`text-[18px] ml-5 text-center font-normal`}>{label}</h1>
        </MenuItem>
    );
};

export default MenuItemResponsive;
