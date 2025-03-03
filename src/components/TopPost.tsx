import React from "react";
import { DataView } from "primereact/dataview";
import { Paginator } from "primereact/paginator";
import { useNavigate } from "react-router-dom";
import thumbnail from "../../public/thumbnail.svg";

interface TopPostProps {
    topPosts: any[];
    topPostPage: number;
    setTopPostPage: (page: number) => void;
    topPostSize: number;
    topPostPagination: any;
    truncateText: (text: string, maxLength: number) => string;
}

const TopPost: React.FC<TopPostProps> = ({ topPosts, topPostPage, setTopPostPage, topPostSize, topPostPagination, truncateText }) => {
    const navigate = useNavigate();

    return (
        <div className="mt-4">
            <DataView
                value={topPosts}
                layout="grid"
                className="grid-custom"
                itemTemplate={(post) => (
                    <div key={post.id} className="sm:w-1/3">
                        <div className="shadow-[0_1px_6px_rgba(0,0,0,0.1)] rounded-lg min-h-[320px] flex flex-col">
                            <img
                                src={post.thumbnail ? `http://localhost:3000/post_picture/${post.thumbnail}` : thumbnail}
                                alt={post.title}
                                className="bg-[#f59e0b] w-full h-40 object-cover rounded-t-lg cursor-pointer"
                                onClick={() => navigate(`/${post.id}`)}
                            />
                            <div className="p-3">
                                <h3 className="text-md font-semibold cursor-pointer w-fit" onClick={() => navigate(`/${post.id}`)}>
                                    {truncateText(post.title, 40)}
                                </h3>
                                <p className="text-gray-600 text-sm mb-1">{post.user?.name} - {post.publishedDate}</p>
                                <p className="text-gray-600 text-sm">{truncateText(post.summary, 100)}</p>
                            </div>
                        </div>
                    </div>
                )}
            />

            {/* Paginator */}
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
