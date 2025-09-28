import {DataView} from "primereact/dataview";
import {Paginator} from "primereact/paginator";
import {useNavigate} from "react-router-dom";
import thumbnail from "../assets/thumbnail.svg";
import {truncateText} from "../utils/truncateText.tsx";

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

const HeadlinePost = ({
                          headlinePost,
                          headlinePostPage,
                          setHeadlinePostPage,
                          headlinePostPagination,
                          headlineSize,
                          handleCategoryChange,
                      }) => {

    const navigate = useNavigate();
    return (
        <div>
            <DataView
                value={headlinePost ? [headlinePost] : []}
                layout="grid"
                className="grid-custom "
                itemTemplate={(post) => (
                    <div key={post.id} className="shadow-[0_1px_6px_rgba(0,0,0,0.1)] rounded-lg w-full break-all">
                        <div className="relative">
                            <img
                                src={post.thumbnail ? `${apiUri}/post_picture/${post.thumbnail}` : thumbnail as string}
                                alt={post.title}
                                className="w-full h-auto aspect-[16/9] object-cover rounded-t-lg bg-[#f59e0b] cursor-pointer"
                                onClick={() => navigate(`/post?id=${post.id}`)}
                            />
                            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 px-2 rounded-md flex items-center text-xs">
                                <i className="pi pi-eye mr-1"></i>
                                <span>{post.viewCount}</span>
                            </div>
                        </div>

                        <div className="px-4 pb-6 pt-2 ">
                            <h3
                                className="text-md sm:text-2xl font-semibold w-fit cursor-pointer line-clamp-2"
                                onClick={() => navigate(`/post?id=${post.id}`)}
                            >
                                {post.title}
                            </h3>
                            <p className=""><span
                                className="text-base no-underline text-gray-600 hover:text-gray-600 cursor-pointer"
                                onClick={() => {
                                    handleCategoryChange(headlinePost.category?.name.toLowerCase())
                                }}
                            >
                            {truncateText(post.category?.name, 13)}
                          </span> - {post.createdAt}</p>
                            <p className="mt-1 text-base line-clamp-3">
                                {post.summary}
                            </p>
                        </div>
                    </div>
                )}
            />
            <Paginator
                pageLinkSize={1}
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
