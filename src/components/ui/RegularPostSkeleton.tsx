import { Skeleton } from 'primereact/skeleton';

interface RegularPostSkeletonProps {
    postSize: number;
}

const RegularPostSkeleton: React.FC<RegularPostSkeletonProps> = ({ postSize }) => {
    const skeletonItems = Array.from({ length: postSize });

    return (
        <div>
            {skeletonItems.map((_, index) => (
                <div
                    key={index}
                    className="flex mb-3 break-all justify-between h-40 shadow-[0_1px_6px_rgba(0,0,0,0.1)] rounded-lg overflow-hidden"
                >
                    <div className="relative flex-shrink-0 w-48 sm:w-56 md:w-64 lg:w-72 h-full">
                        <Skeleton width="100%" height="100%" className="!rounded-none" />
                    </div>
                    <div className="flex-1 flex flex-col lg:p-4 p-3">
                        <Skeleton width="80%" height="1.75rem" className="mb-3" />
                        <Skeleton width="40%" height="1.25rem" className="mb-3" />
                        <div className="flex-grow">
                            <Skeleton width="100%" height="1rem" className="mb-2" />
                            <Skeleton width="100%" height="1rem" className="mb-2" />
                            <Skeleton width="75%" height="1rem" />
                        </div>
                    </div>
                </div>
            ))}
            <div className="flex justify-center mt-4">
                <Skeleton width="20rem" height="2.5rem" />
            </div>
        </div>
    );
};

export default RegularPostSkeleton;
