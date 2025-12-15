import React from 'react';
import { Skeleton } from 'primereact/skeleton';

const DisqusSkeleton: React.FC = () => {
    return (
        <div className="w-full bg-white text-[#2a2e2e] font-sans border border-gray-200 rounded-md overflow-hidden">
            <div className="py-6 text-center">
                <div className="flex justify-center mb-3">
                    <Skeleton width="140px" height="18px" />
                </div>
                <div className="flex justify-center mb-5">
                    <Skeleton width="90px" height="16px" />
                </div>

                <div className="hidden md:flex justify-center gap-[45px] flex-nowrap mx-auto">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-[6px]">
                            <Skeleton shape="circle" size="48px" />
                            <Skeleton width="55px" height="12px" />
                        </div>
                    ))}
                </div>

                <div className="flex md:hidden flex-col gap-[10px]">
                    <div className="flex justify-center gap-[40px]">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-[4px]">
                                <Skeleton shape="circle" size="44px" />
                                <Skeleton width="50px" height="10px" />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center gap-[40px]">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-[4px]">
                                <Skeleton shape="circle" size="44px" />
                                <Skeleton width="50px" height="10px" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="py-4 flex justify-between items-center border-b border-[#e8e8e8]">
                <Skeleton
                    width="110px"
                    height="20px"
                    className="!w-[100px] md:!w-[110px] !h-[18px] md:!h-[20px]"
                />
                <div className="flex gap-3 items-center">
                    <Skeleton
                        shape="circle"
                        size="24px"
                        className="!w-[22px] !h-[22px] md:!w-[24px] md:!h-[24px]"
                    />
                    <Skeleton
                        width="70px"
                        height="18px"
                        className="!w-[65px] !h-[16px] md:!w-[70px] md:!h-[18px]"
                    />
                </div>
            </div>

            <div className="py-5 md:p-4 border-b border-[#e8e8e8]">
                <div className="flex gap-3 mb-4">
                    <div className="hidden md:block shrink-0">
                        <Skeleton shape="circle" size="48px" />
                    </div>
                    <div className="flex-1">
                        <Skeleton height="80px" className="hidden md:block !rounded-lg" />
                        <Skeleton height="60px" className="block md:hidden !rounded-[20px]" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-start md:ml-[60px]">
                    <div className="w-full md:w-auto flex-none">
                        <Skeleton width="100px" height="12px" className="mb-3" />
                        <div className="flex gap-2 flex-wrap">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton
                                    key={i}
                                    shape="circle"
                                    size="42px"
                                    className="!w-[40px] !h-[40px] md:!w-[42px] md:!h-[42px]"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="w-full flex-1 flex flex-col gap-3">
                        <div className="flex items-center gap-[6px]">
                            <Skeleton
                                width="160px"
                                height="12px"
                                className="!w-[180px] md:!w-[160px]"
                            />
                            <Skeleton shape="circle" size="16px" />
                        </div>
                        <Skeleton width="100%" height="42px" className="!rounded" />
                    </div>
                </div>
            </div>

            <div className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 border-b border-[#e8e8e8]">
                <div className="w-full md:w-auto flex gap-4 items-center">
                    <Skeleton shape="circle" size="20px" />
                    <div className="w-[1px] h-[14px] bg-[#e8e8e8] hidden md:block"></div>
                    <Skeleton width="60px" height="16px" />
                </div>
                <div className="w-full md:w-auto flex gap-4">
                    <Skeleton width="55px" height="16px" />
                    <Skeleton width="55px" height="16px" />
                    <Skeleton width="55px" height="16px" />
                </div>
            </div>

            <div className="py-10 text-center">
                <div className="flex justify-center">
                    <Skeleton width="220px" height="18px" />
                </div>
            </div>

            <div className="py-5 flex flex-wrap justify-between items-start gap-2 border-t border-[#e8e8e8]">
                <div className="flex flex-wrap gap-2 w-[calc(100%-110px)] md:w-auto">
                    <Skeleton width="75px" height="14px" className="!w-[90px] md:!w-[75px]" />
                    <Skeleton width="75px" height="14px" className="!w-[90px] md:!w-[75px]" />
                    <Skeleton width="75px" height="14px" className="!w-[90px] md:!w-[75px]" />
                </div>
                <div className="ml-auto">
                    <Skeleton width="120px" height="14px" className="!w-[100px] md:!w-[120px]" />
                </div>
            </div>
        </div>
    );
};

export default DisqusSkeleton;
