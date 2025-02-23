import React from "react";
import {Button} from "primereact/button"; // Pastikan Anda memiliki PrimeReact untuk Button

interface ConnectionErrorProps {
    visibleConnectionError: boolean;
    visibleLoadingConnection?: boolean;
    onRetry?: () => void;
}

const LoadingRetry: React.FC<ConnectionErrorProps> = ({visibleConnectionError, onRetry, visibleLoadingConnection}) => {
    if (!visibleConnectionError && !visibleLoadingConnection ) return null;

    return (
        <div className="flex flex-col items-center justify-center text-center h-screen">
            {(() => {
                if (visibleConnectionError) {
                    return (
                        <div className="font-medium text-2xl md:text-3xl ">
                            <p>Connection Lost</p>
                            <p className="font-normal text-[18px]/[22px] line md:text-xl mt-1 mb-3 px-2 ">
                                It seems there is an error with your internet connection.
                            </p>
                            <Button severity="secondary" onClick={onRetry || (() => console.log("Retry clicked"))}>
                                Retry
                            </Button>
                        </div>
                    );
                } else if (visibleLoadingConnection) {
                    return (
                        <div className="flex flex-col font-medium text-2xl md:text-3xl ">
                            <p>Loading Data</p>
                            <p className="font-normal text-[18px]/[22px] line md:text-xl mt-1 mb-3 px-2 ">
                                Please wait while we load the data.
                            </p>
                            <i className="pi pi-spin pi-spinner text-[3rem]"
                               style={{ color: "#64748b", animationDuration: "1s" }}></i>
                        </div>
                    );
                }
                return null;
            })()}
        </div>
    );

};

export default LoadingRetry;
