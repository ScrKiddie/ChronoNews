import emptyData from '../../assets/emptydata.webp';
import React from 'react';

interface EmptyDataProps {
    message?: React.ReactNode;
    className?: string;
}

const EmptyData: React.FC<EmptyDataProps> = ({ message, className }) => {
    return (
        <div className={`text-center ${className}`}>
            <div className="flex flex-col items-center">
                <img
                    src={emptyData as string}
                    className="w-48 md:w-64 h-auto mb-4 md:mb-6"
                    alt="emptyData"
                />
                <h3 className="text-[#4d555e] text-xl md:text-2xl font-semibold mb-2 md:mb-3">
                    Data Tidak Ditemukan
                </h3>
                <p className="text-gray-600 max-w-xs md:max-w-md text-base md:text-lg">
                    {message ||
                        'Maaf, kami tidak dapat menemukan data yang Anda cari. Coba sesuaikan filter atau kata kunci Anda.'}
                </p>
            </div>
        </div>
    );
};
export default EmptyData;
