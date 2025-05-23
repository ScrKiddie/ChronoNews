import {DataView} from "primereact/dataview";
import {Paginator} from "primereact/paginator";
import {useNavigate} from "react-router-dom";
import thumbnail from "../assets/thumbnail.svg";
import emptyData from "../assets/emptydata.webp";
import {truncateText} from "../utils/truncateText.tsx";

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

const TopPost = ({
                     topPost,
                     topPostPage,
                     setTopPostPage,
                     topPostSize,
                     topPostPagination,
                     handleCategoryChange,
                 }) => {
    const navigate = useNavigate();


    return (
        <div className="mt-4">
            <DataView
                // @ts-expect-error: using custom empty message
                emptyMessage={(<>
                        <div className="w-full flex flex-col h-fit justify-center items-center">
                            <img src={emptyData as string} className="lg:w-[26%] w-[60%]" alt="emptyData"/>
                            <h3 className="text-[#4d555e] text-2xl font-[600] mt-2 text-center break-all">
                                Data Tidak Ditemukan
                            </h3>
                            <p className="text-[#4d555e] text-center">
                                Data yang kamu cari belum tersedia.
                            </p>
                        </div>
                    </>
                )}
                value={topPost}
                layout="grid"
                className="grid-custom"
                itemTemplate={(post) => (
                    <div key={post.id} className="w-full lg:w-1/3 break-all">
                        <div className="shadow-[0_1px_6px_rgba(0,0,0,0.1)] rounded-lg sm:min-h-[350px] flex flex-col  ">
                            <img
                                src={post.thumbnail ? `${apiUri}/post_picture/${post.thumbnail}` : thumbnail as string}
                                alt={post.title}
                                className="w-full h-auto aspect-[16/9] object-cover rounded-t-lg bg-[#f59e0b] cursor-pointer"
                                onClick={() => navigate(`/post?id=${post.id}`)}
                            />
                            <div className="p-4 ">
                                <h3
                                    className="text-md font-semibold w-fit cursor-pointer line-clamp-2"
                                    onClick={() => navigate(`/post?id=${post.id}`)}
                                >
                                    {post.title}
                                </h3>
                                <p className=""><span
                                    className="text-base no-underline text-gray-600 hover:text-gray-600 cursor-pointer"
                                    onClick={() => {
                                        handleCategoryChange(post.category?.name.toLowerCase())
                                    }}
                                >
                            {truncateText(post.category?.name,13)}
                          </span> - {post.publishedDate}</p>
                                <p className="mt-1 line-clamp-3 text-base">
                                    {post.summary}
                                </p>
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
