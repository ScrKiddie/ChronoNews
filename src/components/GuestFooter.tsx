import React from "react";
import ChronoNewsLogo from "../../public/chrononews.svg";
import {Link} from "react-router-dom";
import {truncateText} from "../utils/truncateText.tsx";

interface GuestFooterProps {
    quickLinks: Array<{ id: string; name: string }>;
}

const GuestFooter: React.FC<GuestFooterProps> = ({quickLinks}) => {
    return (
        <footer className="bg-[#242b35] dark:bg-blackHover dark:text-white pt-10 lg:pb-1">
            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="flex flex-col mx-auto items-center">
                    <div className="flex items-center gap-1">
                        <img src={ChronoNewsLogo as string} className="w-8" alt="ChronoNewsLogo"/>
                        <h1 className="text-white font-bold text-2xl">
                            CHRONO<span className="text-[#f59e0b]">NEWS</span>
                        </h1>
                    </div>
                    <div className="flex space-x-4 mt-4">
                        <i className="pi pi-whatsapp" style={{fontSize: "28px"}}></i>
                        <i className="pi pi-facebook" style={{fontSize: "28px"}}></i>
                        <i className="pi pi-instagram" style={{fontSize: "28px"}}></i>
                    </div>
                </div>
                <div className="flex flex-col mx-auto items-center lg:items-start pt-2">
                    <h2 className="text-xl font-semibold mb-4 text-center text-white">Tautan Cepat</h2>
                    <p key={"beranda"} className="text-white text-sm ">
                        <Link to={`/beranda`} className="no-underline text-inherit">
                            Beranda
                        </Link>
                    </p>
                    {quickLinks.map((category) => (
                        <p key={category.id} className="text-white text-sm">
                            <Link to={`/${category.name.toLowerCase()}`} className="no-underline text-inherit">
                                {truncateText(category.name, 13)}
                            </Link>
                        </p>
                    ))}


                </div>
                <div className="mx-auto pt-2">
                    <h2 className="text-xl font-semibold mb-4 text-center">Kontak Kami</h2>
                    <p className="text-sm mb-2 flex gap-2 justify-center items-center">
                        <i className="pi pi-envelope" style={{fontSize: "20px"}}></i>
                        <span>chrononews@gmail.com</span>
                    </p>
                </div>
            </div>
            <div className="pb-2 pt-2 text-center text-sm mx-6" style={{borderTop: "1px solid"}}>
                <p className="flex gap-1 items-center justify-center">
                    &copy; {new Date().getFullYear()} ChronoNews. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default GuestFooter;
