import ChronoNewsLogo from "../../public/chrononews.svg";
import React from "react";

interface GuestFormContainerProps {
    children: React.ReactNode;
    title?: string | React.ReactNode;
}

const GuestFormContainer: React.FC<GuestFormContainerProps> = ({children, title = ""}) => {
    return (
        <div
            className="flex justify-center flex-col items-center min-h-screen max-h-fit bg-cover bg-center bg-white xl:bg-[#f2f2f2]">
            <div
                className=" xl:w-[32%] w-[88%] flex items-center justify-center bg-white flex-col rounded-xl xl:shadow-md my-10">
                <div className="xl:p-10 sm:py-10 w-full">
                    <div className="flex items-center justify-center flex-col">
                        <img src={ChronoNewsLogo as string} className="w-[10rem]" alt="ChronoNewsLogo"/>
                        <h1 className="m-0 font-extrabold" style={{color: 'var(--surface-600)'}}>
                            CHRONO<span style={{color: 'var(--primary-500)'}}>NEWS</span>
                        </h1>
                    </div>
                    <h1 className="m-0  text-lg font-[500] text-center" style={{color: 'var(--surface-600)'}}>
                        {title}
                    </h1>
                    <h1 className="m-0  text-sm font-[400] text-center mb-4"
                        style={{color: 'var(--surface-600)'}}>

                    </h1>
                    {children}
                </div>
            </div>
        </div>
    )
}
export default GuestFormContainer