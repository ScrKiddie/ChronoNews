import React from "react";
import {Button} from "primereact/button"; // Pastikan Anda memiliki PrimeReact untuk Button

interface ConnectionErrorProps {
    visibleConnectionError: boolean;
    visibleLoadingConnection?: boolean;
    onRetry?: () => void;
}

const ConnectionError: React.FC<ConnectionErrorProps> = ({visibleConnectionError, onRetry, visibleLoadingConnection}) => {
    if (!visibleConnectionError && !visibleLoadingConnection ) return null;

    return (
        <div className="flex flex-col items-center justify-center text-center h-screen">
            {visibleConnectionError &&
                < div className="font-medium text-3xl text-gray-800">
                    Connection Lost
                    <p className="font-normal text-xl mt-1 mb-3 px-2 text-gray-600">
                        It seems there is an error with your internet connection.
                    </p>
                    <Button severity="secondary" onClick={onRetry || (() => console.log("Retry clicked"))}>
                        Retry
                    </Button>
                </div>
            }
            {visibleLoadingConnection &&
            <div className="mt-5">
                <i className="pi pi-spin pi-spinner text-[5rem]"
                   style={{color: "#64748b", animationDuration: "1s"}}></i>
            </div>
            }
        </div>
    );
};

export default ConnectionError;
