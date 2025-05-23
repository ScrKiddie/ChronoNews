import {DataView} from "primereact/dataview";
import {Paginator} from "primereact/paginator";
import {useNavigate} from "react-router-dom";
import thumbnail from "../assets/thumbnail.svg";
import {truncateText} from "../utils/truncateText.tsx";

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

const RegularPost = ({
                         post,
                         postPage,
                         setPostPage,
                         postSize,
                         postPagination,
                         classKu = "",
                         handleCategoryChange,
                     }) => {
    const navigate = useNavigate();
    return (
        <div className={`${classKu}`}>
            <DataView
                value={post}
                layout="list"
                itemTemplate={(post) => (
                    <div key={post.id}
                         className={`flex ${post.id === post[post.length - 1]?.id ? '' : 'mb-3'} break-all justify-between h-40 shadow-[0_1px_6px_rgba(0,0,0,0.1)] rounded-lg`}>
                        <div className="">
                            <img
                                src={post.thumbnail ? `${apiUri}/post_picture/${post.thumbnail}` : thumbnail as string}
                                alt={post.title}
                                className="h-full md:w-auto w-full object-cover bg-[#f59e0b] rounded-tl-lg rounded-bl-lg cursor-pointer"
                                onClick={() => navigate(`/post?id=${post.id}`)}
                            />
                        </div>
                        <div className="w-full flex flex-col lg:p-4 p-3">
                            <h3
                                className="text-sm sm:text-sm lg:text-lg font-semibold cursor-pointer w-fit line-clamp-2 "
                                onClick={() => navigate(`/post?id=${post.id}`)}
                            >
                                {post.title}
                            </h3>
                            <p className="text-gray-600 text-xs sm:text-sm mb-1"><span
                                className="no-underline text-gray-600 hover:text-gray-600 cursor-pointer"
                                onClick={() => {
                                    handleCategoryChange(post.category?.name.toLowerCase())
                                }}
                            >
                            {truncateText(post.category?.name,13)}
                          </span> - {post.publishedDate}</p>

                            <p className="text-gray-600 md:line-clamp-2 line-clamp-5 text-xs sm:text-sm break-all">
                                {post.summary}
                            </p>
                        </div>
                    </div>
                )}
            />

            <Paginator
                first={(postPage - 1) * postSize}
                rows={postSize}
                totalRecords={postPagination.totalItem}
                onPageChange={(e) => setPostPage(e.page + 1)}
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                className="mt-4"
            />
        </div>
    );
};

export default RegularPost;
