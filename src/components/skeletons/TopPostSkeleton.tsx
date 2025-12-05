import { Skeleton } from "primereact/skeleton";

interface TopPostSkeletonProps {
    topPostSize: number;
}

const TopPostSkeleton: React.FC<TopPostSkeletonProps> = ({ topPostSize }) => {
    const skeletonItems = Array.from({ length: topPostSize });

    return (
        <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skeletonItems.map((_, index) => (
                    <div key={index} className="w-full break-all">
                        <div className="shadow-[0_1px_6px_rgba(0,0,0,0.1)] rounded-lg sm:min-h-[350px] flex flex-col">
                            <div className="relative">
                                <Skeleton width="100%" height="auto" className="aspect-[16/9] rounded-t-lg" />
                            </div>
                            <div className="p-4">
                                <Skeleton width="80%" height="1.5rem" className="mb-2" />
                                <Skeleton width="50%" height="1rem" className="mb-1" />
                                <Skeleton width="100%" height="3rem" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-center items-center mt-4 gap-2">
                <Skeleton shape="circle" size="2.5rem" />
                <Skeleton shape="circle" size="2.5rem" />
                <Skeleton shape="circle" size="2.5rem" />
                <Skeleton shape="circle" size="2.5rem" />
            </div>
        </div>
    );
};

export default TopPostSkeleton;
