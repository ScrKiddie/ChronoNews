import {DataView} from "primereact/dataview";
import {Paginator, PaginatorPageChangeEvent} from "primereact/paginator";
import {useNavigate} from "react-router-dom";
import thumbnail from "../assets/thumbnail.svg";
import {truncateText} from "../utils/truncateText.tsx";
import {slugify} from "../utils/slugify.tsx";
import {Post} from "../types/post.tsx";
import {Pagination} from "../types/pagination.tsx";

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

interface RegularPostProps {
    post: Post[];
    postPage: number;
    setPostPage: (page: number) => void;
    postSize: number;
    postPagination: Pagination | undefined;
    classKu?: string;
    handleCategoryChange: (category: string) => void;
}

const RegularPost: React.FC<RegularPostProps> = ({
                         post,
                         postPage,
                         setPostPage,
                         postSize,
                         postPagination,
                         classKu = "",
                         handleCategoryChange,
                     }) => {
    const navigate = useNavigate();

    const handleNavigate = (item: Post) => {
        const slug = slugify(item.title);
        navigate(`/post/${item.id}/${slug}`);
    }

    return (
        <div className={`${classKu}`}>
            <DataView
                value={post}
                layout="list"
                itemTemplate={(item: Post) => (
                    <div key={item.id}
                         className={`flex mb-3 break-all justify-between h-40 shadow-[0_1px_6px_rgba(0,0,0,0.1)] rounded-lg overflow-hidden`}>
                        <div className="relative flex-shrink-0 w-48 sm:w-56 md:w-64 lg:w-72">
                            <img
                                src={item.thumbnail ? `${apiUri}/post_picture/${item.thumbnail}` : thumbnail as string}
                                alt={item.title}
                                className="h-full w-full object-cover bg-[#f59e0b] cursor-pointer"
                                onClick={() => handleNavigate(item)}
                            />
                            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 px-2 rounded-md flex items-center text-xs">
                                <i className="pi pi-eye mr-1"></i>
                                <span>{item.viewCount}</span>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col lg:p-4 p-3">
                            <h3
                                className="text-sm sm:text-sm lg:text-lg font-semibold cursor-pointer w-fit line-clamp-2"
                                onClick={() => handleNavigate(item)}
                            >
                                {item.title}
                            </h3>
                            <p className="text-gray-600 text-xs sm:text-sm mb-1">
                                <span
                                    className="no-underline text-gray-600 hover:text-gray-600 cursor-pointer"
                                    onClick={() => {
                                        if (item.category?.name) {
                                            handleCategoryChange(item.category.name.toLowerCase())
                                        }
                                    }}
                                >
                                    {truncateText(item.category?.name, 13)}
                                </span> - {item.createdAt}
                            </p>
                            <p className="text-gray-600 md:line-clamp-2 line-clamp-5 text-xs sm:text-sm break-all">
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
                    onPageChange={(e: PaginatorPageChangeEvent) => setPostPage(e.page + 1)}
                    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                    className="mt-4"
                />
            )}
        </div>
    );
};

export default RegularPost;
