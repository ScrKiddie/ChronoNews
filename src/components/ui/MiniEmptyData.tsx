import emptyData from '../../assets/emptydata.webp';
import React from 'react';

interface MiniEmptyDataProps {
    message?: React.ReactNode;
    className?: string;
}

const MiniEmptyData: React.FC<MiniEmptyDataProps> = ({ message, className }) => {
    return (
        <div className={`flex flex-col items-center justify-center text-center py-8 ${className}`}>
            <img src={emptyData as string} className="w-32 h-auto mb-3" alt="emptyData" />
            <h3 className="text-[#4d555e] text-lg font-semibold mb-1">Data Tidak Tersedia</h3>
            <p className="text-gray-500 max-w-xs text-sm">
                {message || 'Saat ini belum ada data untuk ditampilkan di bagian ini.'}
            </p>
        </div>
    );
};
export default MiniEmptyData;
