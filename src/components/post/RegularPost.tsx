import { DataView } from 'primereact/dataview';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useNavigate } from 'react-router-dom';
import thumbnail from '../../../public/thumbnail.svg';
import { truncateText } from '../../lib/utils/truncateText.tsx';
import { slugify } from '../../lib/utils/slugify.tsx';
import { Post } from '../../types/post.tsx';
import { Pagination } from '../../types/pagination.tsx';
import RegularPostSkeleton from '../ui/RegularPostSkeleton.tsx';
import React from 'react';
import SafeImage from '../ui/SafeImage.tsx';

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

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
                        className={`flex mb-3 break-all justify-between h-40 shadow-[0_1px_6px_rgba(0,0,0,0.1)] rounded-lg overflow-hidden`}
                    >
                        <div className="relative flex-shrink-0 w-48 sm:w-56 md:w-64 lg:w-72 h-full bg-[#f59e0b] overflow-hidden">
                            <SafeImage
                                src={
                                    item.thumbnail
                                        ? `${apiUri}/post_picture/${item.thumbnail}`
                                        : (thumbnail as string)
                                }
                                alt={item.title}
                                className="absolute top-0 left-0 h-full w-full object-cover cursor-pointer"
                                onClick={() => handleNavigate(item)}
                            />
                            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 px-2 rounded-md flex items-center text-xs z-10">
                                <i className="pi pi-eye mr-1"></i>
                                <span>{item.viewCount}</span>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col lg:p-4 p-3">
                            <h3
                                className="text-lg md:text-xl font-semibold cursor-pointer w-fit line-clamp-2 text-gray-800"
                                onClick={() => handleNavigate(item)}
                            >
                                {item.title}
                            </h3>
                            <p className="text-sm md:text-base text-gray-600 mb-1">
                                <span
                                    className="no-underline hover:text-gray-600 cursor-pointer"
                                    onClick={() => {
                                        if (item.category?.name) {
                                            handleCategoryChange(item.category.name.toLowerCase());
                                        }
                                    }}
                                >
                                    {truncateText(item.category?.name || '', 13)}
                                </span>{' '}
                                - {item.createdAt}
                            </p>
                            <p className="md:line-clamp-2 line-clamp-5 text-sm md:text-base break-all text-gray-700">
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
                />
            )}
        </div>
    );
};

export default RegularPost;
