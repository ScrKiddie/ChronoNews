import React from "react";
import {Button} from "primereact/button";

type LoadingRetryProps = {
    visibleConnectionError?: boolean;
    visibleLoadingConnection?: boolean;
    onRetry?: () => void;
    className?: string;
};

const LoadingRetry: React.FC<LoadingRetryProps> = ({
                                                       visibleConnectionError,
                                                       onRetry,
                                                       visibleLoadingConnection,
                                                       className = "p-4"
                                                   }) => {
    if (!visibleConnectionError && !visibleLoadingConnection) return null;

    return (
        <div className={`flex flex-col items-center justify-center text-center h-screen ${className}`} >
            <div className="flex flex-col items-center justify-center text-center h-screen text-[#4b5563]">
                {visibleLoadingConnection ? ( // Prioritaskan tampilan loading
                    <div className="flex flex-col font-medium text-2xl md:text-3xl">
                        <p>Memuat Data</p>
                        <p className="font-normal text-[18px]/[22px] line md:text-xl mt-1 mb-3 px-2">
                            Mohon tunggu sementara kami memuat data.
                        </p>
                        <i className="pi pi-spin pi-spinner text-[3rem]"
                           style={{color: "#64748b", animationDuration: "1s"}}></i>
                    </div>
                ) : visibleConnectionError ? ( // Tampilkan error jika tidak loading
                    <div className="font-medium text-2xl md:text-3xl">
                        <p>Koneksi Terputus</p>
                        <p className="font-normal text-[18px]/[22px] line md:text-xl mt-1 mb-3 px-2">
                            Sepertinya ada masalah dengan koneksi internet Anda.
                        </p>
                        <Button severity="secondary" onClick={onRetry} disabled={visibleLoadingConnection}>
                            Coba Lagi
                        </Button>
                    </div>
                ) : null}
            </div>
        </div>
    );

};

export default LoadingRetry;
