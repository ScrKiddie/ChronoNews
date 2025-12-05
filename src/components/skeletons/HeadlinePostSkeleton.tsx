import { Skeleton } from "primereact/skeleton";

const HeadlinePostSkeleton: React.FC = () => {
    return (
        <div>
            <div className="shadow-[0_1px_6px_rgba(0,0,0,0.1)] rounded-lg w-full break-all">
                <div className="relative">
                    <Skeleton width="100%" height="auto" className="aspect-[16/9] rounded-t-lg" />
                </div>
                <div className="px-4 pb-6 pt-2">
                    <Skeleton width="80%" height="2rem" className="mb-2" />
                    <Skeleton width="40%" height="1rem" className="mb-2" />
                    <Skeleton width="100%" height="3rem" />
                </div>
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

export default HeadlinePostSkeleton;
