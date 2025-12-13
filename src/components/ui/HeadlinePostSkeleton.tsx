import { Skeleton } from 'primereact/skeleton';

const HeadlinePostSkeleton: React.FC = () => {
    return (
        <div>
            <div className="shadow-[0_1px_6px_rgba(0,0,0,0.1)] rounded-lg w-full break-all">
                <div className="relative w-full aspect-[16/9] rounded-t-lg overflow-hidden">
                    <Skeleton
                        width="100%"
                        height="100%"
                        className="absolute top-0 left-0 !rounded-none"
                    />
                </div>
                <div className="p-4 ">
                    <Skeleton width="80%" height="2.25rem" className="mb-3" />
                    <Skeleton width="40%" height="1.25rem" className="mb-3" />
                    <div className="flex-grow">
                        <Skeleton width="100%" height="1rem" className="mb-2" />
                        <Skeleton width="100%" height="1rem" className="mb-2" />
                        <Skeleton width="75%" height="1rem" />
                    </div>
                </div>
            </div>
            <div className="flex justify-center mt-4">
                <Skeleton width="20rem" height="2.5rem" />
            </div>
        </div>
    );
};

export default HeadlinePostSkeleton;
