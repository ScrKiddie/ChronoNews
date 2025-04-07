import React from "react";
import {Button} from "primereact/button";


const LoadingRetry: React.FC = ({visibleConnectionError, onRetry, visibleLoadingConnection}) => {
    if (!visibleConnectionError && !visibleLoadingConnection) return null;

    return (
        <div className="flex flex-col items-center justify-center text-center h-screen">
            <div className="flex flex-col items-center justify-center text-center h-screen text-[#4b5563]">
                {visibleConnectionError ? (
                    <div className="font-medium text-2xl md:text-3xl">
                        <p>Koneksi Terputus</p>
                        <p className="font-normal text-[18px]/[22px] line md:text-xl mt-1 mb-3 px-2">
                            Sepertinya ada masalah dengan koneksi internet Anda.
                        </p>
                        <Button severity="secondary" onClick={onRetry}>
                            Coba Lagi
                        </Button>
                    </div>
                ) : visibleLoadingConnection ? (
                    <div className="flex flex-col font-medium text-2xl md:text-3xl">
                        <p>Memuat Data</p>
                        <p className="font-normal text-[18px]/[22px] line md:text-xl mt-1 mb-3 px-2">
                            Mohon tunggu sementara kami memuat data.
                        </p>
                        <i className="pi pi-spin pi-spinner text-[3rem]"
                           style={{color: "#64748b", animationDuration: "1s"}}></i>
                    </div>
                ) : null}
            </div>
        </div>
    );

};

export default LoadingRetry;
