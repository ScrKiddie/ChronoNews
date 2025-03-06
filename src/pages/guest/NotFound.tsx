import React from "react";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-[#49576b] text-center">
            <svg
                width="60"
                height="60"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#49576b]"
                color="#49576b"
            >
                <path
                    d="M15.5 4.8c2 3 1.7 7-1 9.7h0l4.3 4.3-4.3-4.3a7.8 7.8 0 01-9.8 1m-2.2-2.2A7.8 7.8 0 0113.2 2.4M2 18L18 2"></path>
            </svg>
            <h1 className="text-2xl font-normal mt-4">Page Not Found</h1>
        </div>
    );
};

export default NotFound;
