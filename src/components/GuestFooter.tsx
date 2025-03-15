import React from "react";
import chronoverseLogo from "../../public/chronoverse.svg";
import {Link} from "react-router-dom";

const GuestFooter: React.FC = ({quickLinks = null} ) => {
    return (
        <footer className="bg-[#242b35] dark:bg-blackHover dark:text-white pt-10 lg:pb-1">
            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="flex flex-col mx-auto items-center">
                    <div className="flex items-center gap-1">
                        <img src={chronoverseLogo} className="w-8" alt="Chronoverse Logo"/>
                        <h1 className="text-white font-bold text-2xl">
                            CHRONO<span className="text-[#f59e0b]">VERSE</span>
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
                    <p key={"home"} className="text-white text-sm ">
                        <Link to={`/home`} className="no-underline text-inherit">
                            Home
                        </Link>
                    </p>
                    {quickLinks.slice(0, -1).map((category, index) => (
                        <p key={category.id} className="text-white text-sm">
                            <Link to={`/${category.name.toLowerCase()}`} className="no-underline text-inherit">
                                {category.name}
                            </Link>
                        </p>
                    ))}


                </div>
                <div className="mx-auto pt-2">
                    <h2 className="text-xl font-semibold mb-4 text-center">Kontak Kami</h2>
                    <p className="text-sm mb-2 flex gap-2 justify-center items-center">
                        <i className="pi pi-envelope" style={{fontSize: "20px"}}></i>
                        <span>chronoverse@gmail.com</span>
                    </p>
                </div>
            </div>
            <div className="pb-1 pt-2 text-center text-sm mx-6" style={{borderTop: "1px solid"}}>
                <p className="flex gap-1 items-center justify-center">
                    &copy; {new Date().getFullYear()} ChronoVerse. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default GuestFooter;
