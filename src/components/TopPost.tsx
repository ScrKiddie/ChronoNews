import React from "react";
import {DataView} from "primereact/dataview";
import {Paginator} from "primereact/paginator";
import {useNavigate} from "react-router-dom";
import thumbnail from "../../public/thumbnail.svg";

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

const TopPost = ({
                     topPost,
                     topPostPage,
                     setTopPostPage,
                     topPostSize,
                     topPostPagination,
                     truncateText,
                     handleCategoryChange
                 }) => {
    const navigate = useNavigate();

    return (
        <div className="mt-4">
            <DataView
                value={topPost}
                layout="grid"
                className="grid-custom"
                itemTemplate={(post) => (
                    <div key={post.id} className="w-full break-all">
                        <div className="shadow-[0_1px_6px_rgba(0,0,0,0.1)] rounded-lg min-h-[350px] flex flex-col ">
                            <img
                                src={post.thumbnail ? `${apiUri}/post_picture/${post.thumbnail}` : thumbnail as string}
                                alt={post.title}
                                className={`bg-[#f59e0b] w-full h-40 ${topPost.length == 1 ? "md:h-60" : topPost.length == 2 ? "md:h-52" : ""}  object-cover rounded-t-lg cursor-pointer`}
                                onClick={() => navigate(`/post?id=${post.id}`)}
                            />
                            <div className="p-3">
                                <h3 className="text-md font-semibold cursor-pointer w-fit"
                                    onClick={() => navigate(`/post?id=${post.id}`)}>
                                    {truncateText(post.title, 30)}
                                </h3>
                                <p className="text-gray-600 text-xs sm:text-sm mb-1"><span
                                    className="no-underline text-gray-600 hover:text-gray-600 cursor-pointer"
                                    onClick={() => {
                                        handleCategoryChange(post.category?.name.toLowerCase())
                                    }}
                                >
                            {post.category?.name}
                          </span> - {post.publishedDate}</p>
                                <p className="text-gray-600 text-sm">{truncateText(post.summary, 100)}</p>
                            </div>
                        </div>
                    </div>
                )}
            />

            <Paginator
                first={(topPostPage - 1) * topPostSize}
                rows={topPostSize}
                totalRecords={topPostPagination.totalItem}
                onPageChange={(e) => setTopPostPage(e.page + 1)}
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                className="mt-4"
            />
        </div>
    );
};

export default TopPost;
