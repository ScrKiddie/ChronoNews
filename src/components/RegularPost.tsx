import React from "react";
import {DataView} from "primereact/dataview";
import {Paginator} from "primereact/paginator";
import {useNavigate} from "react-router-dom";
import thumbnail from "../../public/thumbnail.svg";

const apiUri = import.meta.env.VITE_CHRONOVERSE_API_URI;


const RegularPost = ({
                         posts,
                         postPage,
                         setPostPage,
                         postSize,
                         postPagination,
                         truncateText,
                         classKu = "",
                         handleCategoryChange
                     }) => {
    const navigate = useNavigate();

    return (
        <div className={`${classKu}`}>
            <DataView
                value={posts}
                layout="list"
                itemTemplate={(post) => (
                    <div key={post.id}
                         className="flex my-2 justify-between min-h-36 md:min-h-40 shadow-[0_1px_6px_rgba(0,0,0,0.1)] rounded-lg">
                        <div className="lg:w-[50%] w-[80%] h-full sm:h-40">
                            <img
                                src={post.thumbnail ? `${apiUri}/post_picture/${post.thumbnail}` : thumbnail}
                                alt={post.title}
                                className="h-full w-full object-cover bg-[#f59e0b] rounded-tl-lg rounded-bl-lg cursor-pointer"
                                onClick={() => navigate(`/post?id=${post.id}`)}
                            />
                        </div>

                        {/* Konten */}
                        <div className="w-full flex flex-col lg:p-4 p-3">
                            <h3
                                className="text-sm sm:text-sm lg:text-lg font-semibold cursor-pointer w-fit"
                                onClick={() => navigate(`/post?id=${post.id}`)}
                            >
                                {truncateText(post.title, 45)}
                            </h3>
                            <p className="text-gray-600 text-xs sm:text-sm mb-1"><span
                                className="no-underline text-gray-600 hover:text-gray-600 cursor-pointer"
                                onClick={() => {
                                    handleCategoryChange(post.category?.name)
                                }}
                            >
                            {post.category?.name}
                          </span> - {post.publishedDate}</p>

                            <p className="text-gray-600 text-xs sm:text-sm break-all">
                                {truncateText(post.summary, 94)}
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
