import { DataView } from 'primereact/dataview';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useNavigate } from 'react-router-dom';
import thumbnail from '../../../public/thumbnail.svg';
import { slugify } from '../../utils/postUtils.ts';
import { Post } from '../../types/post.ts';
import { Pagination } from '../../types/pagination.ts';
import RegularPostSkeleton from '../ui/RegularPostSkeleton.tsx';
import React from 'react';
import SafeImage from '../ui/SafeImage.tsx';

interface RegularPostProps {
    post: Post[] | null;
    loading: boolean;
    postPage: number;
    handlePageChange: (page: number) => void;
    postSize: number;
    postPagination: Pagination | undefined;
    classKu?: string;
    handleCategoryChange: (category: string) => void;
}

const RegularPost: React.FC<RegularPostProps> = ({
    post,
    loading,
    postPage,
    handlePageChange,
    postSize,
    postPagination,
    classKu = '',
    handleCategoryChange,
}) => {
    const navigate = useNavigate();

    const handleNavigate = (item: Post) => {
        const slug = slugify(item.title);
        navigate(`/post/${item.id}/${slug}`);
    };

    if (loading) {
        return <RegularPostSkeleton postSize={postSize} />;
    }

    if (!post || post.length === 0) {
        return null;
    }

    return (
        <div className={`${classKu}`}>
            <DataView
                value={post || []}
                layout="list"
                itemTemplate={(item: Post) => (
                    <div
                        key={item.id}
                        className="flex mb-4 break-word justify-between min-h-40 shadow-[0_1px_6px_rgba(0,0,0,0.1)] rounded-lg overflow-hidden"
                    >
                        {}
                        <div className="relative flex-shrink-0 w-44 sm:w-56 md:w-64 lg:w-72 bg-[#f49f14] overflow-hidden">
                            <SafeImage
                                src={item.thumbnail ? `${item.thumbnail}` : (thumbnail as string)}
                                alt={item.title}
                                className="absolute top-0 left-0 h-full w-full object-cover cursor-pointer"
                                onClick={() => handleNavigate(item)}
                            />
                            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 px-2 rounded-md flex items-center text-xs z-10">
                                <i className="pi pi-eye mr-1"></i>
                                <span>{item.viewCount}</span>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col p-3 lg:p-4 justify-start">
                            <h3
                                className="text-lg md:text-xl font-semibold cursor-pointer w-fit line-clamp-2 text-gray-700 mb-1 leading-normal
"
                                onClick={() => handleNavigate(item)}
                            >
                                {item.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                                <span
                                    className="font-medium cursor-pointer"
                                    onClick={() => {
                                        if (item.category?.name) {
                                            handleCategoryChange(item.category.name.toLowerCase());
                                        }
                                    }}
                                >
                                    {item.category?.name}
                                </span>
                                <span className="text-gray-700">•</span>
                                <time className="text-gray-700">{item.createdAt}</time>
                            </div>
                            {}
                            <p className="text-sm md:text-base line-clamp-2 text-gray-700 leading-relaxed">
                                {item.summary}
                            </p>
                        </div>
                    </div>
                )}
            />

            {postPagination && (postPagination.totalItem || 0) > 0 && (
                <Paginator
                    first={(postPage - 1) * postSize}
                    rows={postSize}
                    totalRecords={postPagination.totalItem || 0}
                    onPageChange={(e: PaginatorPageChangeEvent) => handlePageChange(e.page + 1)}
                    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                    className="mt-4"
                />
            )}
        </div>
    );
};

export default RegularPost;
