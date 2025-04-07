import React from "react";
import {DataView} from "primereact/dataview";
import {Paginator} from "primereact/paginator";
import {useNavigate} from "react-router-dom";
import thumbnail from "../../public/thumbnail.svg";

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

const HeadlinePost = ({
                          headlinePost,
                          headlinePostPage,
                          setHeadlinePostPage,
                          headlinePostPagination,
                          headlineSize,
                          handleCategoryChange
                      }) => {

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    const navigate = useNavigate();

    return (
        <div>
            {/* Headline RegularPost */}
            <DataView
                value={headlinePost ? [headlinePost] : []}
                layout="grid"
                className="grid-custom"
                itemTemplate={(post) => (
                    <div key={post.id} className="shadow-[0_1px_6px_rgba(0,0,0,0.1)] rounded-lg w-full">
                        <img
                            src={post.thumbnail ? `${apiUri}/post_picture/${post.thumbnail}` : thumbnail}
                            alt={post.title}
                            className="w-full md:h-[480px] h-[240px] object-cover rounded-t-lg bg-[#f59e0b] cursor-pointer"
                            onClick={() => navigate(`/post?id=${post.id}`)}
                        />

                        <div className="p-4 min-h-[240px] md:min-h-[160px]">
                            <h3
                                className="text-2xl font-semibold w-fit cursor-pointer"
                                onClick={() => navigate(`/post?id=${post.id}`)}
                            >
                                {truncateText(post.title, 50)}
                            </h3>
                            <p className=""><span
                                className="no-underline text-gray-600 hover:text-gray-600 cursor-pointer"
                                onClick={() => {
                                    handleCategoryChange(headlinePost.category?.name.toLowerCase())
                                }}
                            >
                            {post.category?.name}
                          </span> - {post.publishedDate}</p>
                            <p className="mt-1">
                                {truncateText(post.summary, 150)}
                            </p>
                        </div>
                    </div>
                )}
            />
            <Paginator
                first={(headlinePostPage - 1) * headlineSize}
                rows={headlineSize}
                totalRecords={headlinePostPagination.totalItem}
                onPageChange={(e) => setHeadlinePostPage(e.page + 1)}
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                className="mt-4"
            />
        </div>
    );
};

export default HeadlinePost;
