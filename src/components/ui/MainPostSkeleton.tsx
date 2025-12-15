import React from 'react';
import { Skeleton } from 'primereact/skeleton';
import DisqusSkeleton from './DisqusSkeleton.tsx';

const MainPostSkeleton: React.FC = () => {
    return (
        <main className="break-all">
            <Skeleton height="1.5rem" width="30%" className="mb-4" />

            <Skeleton height="2.5rem" width="90%" className="mb-2" />
            <Skeleton height="1rem" width="70%" className="mb-4" />

            <div className="relative w-full aspect-[16/9] mb-4 overflow-hidden">
                <Skeleton
                    width="100%"
                    height="100%"
                    className="absolute top-0 left-0 !rounded-none"
                />
            </div>

            <div className="flex justify-between mb-4 mt-2 flex-row items-center">
                <div className="flex gap-2 items-center">
                    <Skeleton shape="circle" size="3rem" />
                    <div>
                        <Skeleton height="1.25rem" width="10rem" className="mb-2" />
                        <Skeleton height="1rem" width="15rem" />
                    </div>
                </div>
                <Skeleton shape="circle" size="2.5rem" />
            </div>

            <div
                className="w-full my-4 opacity-30"
                style={{ borderTop: '1px solid #8496af' }}
            ></div>

            <div>
                <Skeleton width="100%" height="1rem" className="mb-2" />
                <Skeleton width="100%" height="1rem" className="mb-2" />
                <Skeleton width="100%" height="1rem" className="mb-2" />
                <Skeleton width="100%" height="1rem" className="mb-2" />
                <Skeleton width="100%" height="1rem" className="mb-2" />
                <Skeleton width="75%" height="1rem" />
            </div>

            <div
                className="w-full my-4 opacity-30"
                style={{ borderTop: '1px solid #8496af' }}
            ></div>

            <DisqusSkeleton />
        </main>
    );
};

export default MainPostSkeleton;
