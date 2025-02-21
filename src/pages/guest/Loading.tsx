import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";

const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-[#49576b] text-center">
                <i className="pi pi-spin pi-spinner text-[10vh]"
                   style={{color: '#64748b', animationDuration: '1s'}}></i>
        </div>
    );
};

export default Loading;
