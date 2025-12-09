import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useNavigate } from 'react-router-dom';
import thumbnail from '../../../public/thumbnail.svg';
import { truncateText } from '../../lib/utils/truncateText.tsx';
import { slugify } from '../../lib/utils/slugify.tsx';
import { Post } from '../../types/post.tsx';
import { Pagination } from '../../types/pagination.tsx';
import { FC } from 'react';
import TopPostSkeleton from '../ui/TopPostSkeleton.tsx';
import SafeImage from '../ui/SafeImage.tsx';

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

interface TopPostProps {
    topPost: Post[] | null;
    loading: boolean;
    topPostPage: number;
    handlePageChange: (page: number) => void;
    topPostSize: number;
    topPostPagination: Pagination | undefined;
    handleCategoryChange: (category: string) => void;
}

const TopPost: FC<TopPostProps> = ({
    topPost,
    loading,
    topPostPage,
    handlePageChange,
    topPostSize,
    topPostPagination,
    handleCategoryChange,
}) => {
    const navigate = useNavigate();

    const handleNavigate = (item: Post) => {
        const slug = slugify(item.title);
        navigate(`/post/${item.id}/${slug}`);
    };

    if (loading) {
        return <TopPostSkeleton topPostSize={topPostSize} />;
    }

    if (!topPost || topPost.length === 0) {
        return null;
    }

    return (
        <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topPost.map((post) => (
                    <div key={post.id} className="break-all">
                        <div className="shadow-[0_1px_6px_rgba(0,0,0,0.1)] rounded-lg flex flex-col h-full">
                            <div className="relative w-full aspect-[16/9] bg-[#f59e0b] rounded-t-lg overflow-hidden">
                                <SafeImage
                                    src={
                                        post.thumbnail
                                            ? `${apiUri}/post_picture/${post.thumbnail}`
                                            : (thumbnail as string)
                                    }
                                    alt={post.title}
                                    className="absolute top-0 left-0 w-full h-full object-cover cursor-pointer"
                                    onClick={() => handleNavigate(post)}
                                />
                                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 px-2 rounded-md flex items-center text-xs z-10">
                                    <i className="pi pi-eye mr-1"></i>
                                    <span>{post.viewCount}</span>
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <h3
                                    className="text-lg md:text-xl font-semibold w-fit cursor-pointer line-clamp-2 text-gray-800"
                                    onClick={() => handleNavigate(post)}
                                >
                                    {post.title}
                                </h3>
                                <p className="text-sm md:text-base text-gray-600">
                                    <span
                                        className="no-underline hover:text-gray-600 cursor-pointer"
                                        onClick={() => {
                                            if (post.category?.name) {
                                                handleCategoryChange(
                                                    post.category.name.toLowerCase()
                                                );
                                            }
                                        }}
                                    >
                                        {truncateText(post.category?.name || '', 13)}
                                    </span>{' '}
                                    - {post.createdAt}
                                </p>
                                <p className="mt-1 line-clamp-3 text-sm md:text-base flex-grow text-gray-700">
                                    {post.summary}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {topPostPagination && (topPostPagination.totalItem || 0) > 0 && (
                <Paginator
                    first={(topPostPage - 1) * topPostSize}
                    rows={topPostSize}
                    totalRecords={topPostPagination.totalItem || 0}
                    onPageChange={(e: PaginatorPageChangeEvent) => handlePageChange(e.page + 1)}
                    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                    className="mt-4"
                />
            )}
        </div>
    );
};

export default TopPost;
