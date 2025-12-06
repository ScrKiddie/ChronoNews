import { Skeleton } from 'primereact/skeleton';

interface TopPostSkeletonProps {
    topPostSize: number;
}

const TopPostSkeleton: React.FC<TopPostSkeletonProps> = ({ topPostSize }) => {
    const skeletonItems = Array.from({ length: topPostSize });

    return (
        <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skeletonItems.map((_, index) => (
                    <div key={index} className="break-all">
                        <div className="shadow-[0_1px_6px_rgba(0,0,0,0.1)] rounded-lg flex flex-col h-full">
                            <div className="relative w-full aspect-[16/9] rounded-t-lg overflow-hidden">
                                <Skeleton
                                    width="100%"
                                    height="100%"
                                    className="absolute top-0 left-0 !rounded-none"
                                />
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <Skeleton width="80%" height="1.75rem" className="mb-3" />
                                <Skeleton width="50%" height="1.25rem" className="mb-3" />
                                <div className="flex-grow">
                                    <Skeleton width="100%" height="1rem" className="mb-2" />
                                    <Skeleton width="100%" height="1rem" className="mb-2" />
                                    <Skeleton width="75%" height="1rem" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-4">
                <Skeleton width="20rem" height="2.5rem" />
            </div>
        </div>
    );
};

export default TopPostSkeleton;
