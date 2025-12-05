import {DataView} from "primereact/dataview";
import {Paginator, PaginatorPageChangeEvent} from "primereact/paginator";
import {useNavigate} from "react-router-dom";
import thumbnail from "../assets/thumbnail.svg";
import emptyData from "../assets/emptydata.webp";
import {truncateText} from "../utils/truncateText.tsx";
import {slugify} from "../utils/slugify.tsx";
import {Post} from "../types/post.tsx";
import {Pagination} from "../types/pagination.tsx";
import {FC} from "react";

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

interface TopPostProps {
    topPost: Post[];
    topPostPage: number;
    setTopPostPage: (page: number) => void;
    topPostSize: number;
    topPostPagination: Pagination | undefined;
    handleCategoryChange: (category: string) => void;
}

const TopPost: FC<TopPostProps> = ({
                     topPost,
                     topPostPage,
                     setTopPostPage,
                     topPostSize,
                     topPostPagination,
                     handleCategoryChange,
                 }) => {
    const navigate = useNavigate();

    const handleNavigate = (item: Post) => {
        const slug = slugify(item.title);
        navigate(`/post/${item.id}/${slug}`);
    }

    return (
        <div className="mt-4">
            <DataView
                // @ts-expect-error: using custom empty message
                emptyMessage={(
                    <div className="w-full flex flex-col h-fit justify-center items-center">
                        <img src={emptyData as string} className="lg:w-[26%] w-[60%]" alt="emptyData"/>
                        <h3 className="text-[#4d555e] text-2xl font-[600] mt-2 text-center break-all">
                            Data Tidak Ditemukan
                        </h3>
                        <p className="text-[#4d555e] text-center">
                            Data yang kamu cari belum tersedia.
                        </p>
                    </div>
                )}
                value={topPost}
                layout="grid"
                className="grid-custom"
                itemTemplate={(post: Post) => (
                    <div key={post.id} className="w-full lg:w-1/3 break-all">
                        <div className="shadow-[0_1px_6px_rgba(0,0,0,0.1)] rounded-lg sm:min-h-[350px] flex flex-col">
                            <div className="relative">
                                <img
                                    src={post.thumbnail ? `${apiUri}/post_picture/${post.thumbnail}` : thumbnail as string}
                                    alt={post.title}
                                    className="w-full h-auto aspect-[16/9] object-cover rounded-t-lg bg-[#f59e0b] cursor-pointer"
                                    onClick={() => handleNavigate(post)}
                                />
                                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 px-2 rounded-md flex items-center text-xs">
                                    <i className="pi pi-eye mr-1"></i>
                                    <span>{post.viewCount}</span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3
                                    className="text-md font-semibold w-fit cursor-pointer line-clamp-2"
                                    onClick={() => handleNavigate(post)}
                                >
                                    {post.title}
                                </h3>
                                <p>
                                    <span
                                        className="text-base no-underline text-gray-600 hover:text-gray-600 cursor-pointer"
                                        onClick={() => {
                                            if (post.category?.name) {
                                                handleCategoryChange(post.category.name.toLowerCase())
                                            }
                                        }}
                                    >
                                        {truncateText(post.category?.name, 13)}
                                    </span> - {post.createdAt}
                                </p>
                                <p className="mt-1 line-clamp-3 text-base">
                                    {post.summary}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            />

            {topPostPagination && topPostPagination.totalItem > 0 && (
                <Paginator
                    first={(topPostPage - 1) * topPostSize}
                    rows={topPostSize}
                    totalRecords={topPostPagination.totalItem}
                    onPageChange={(e: PaginatorPageChangeEvent) => setTopPostPage(e.page + 1)}
                    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                    className="mt-4"
                />
            )}
        </div>
    );
};

export default TopPost;
