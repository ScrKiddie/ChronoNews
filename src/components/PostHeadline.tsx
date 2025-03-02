import React from "react";
import { DataView } from "primereact/dataview";
import { Paginator } from "primereact/paginator";
import { useNavigate } from "react-router-dom";
import thumbnail from "../../public/thumbnail.svg";

interface PostHeadlineProps {
    headlineNews: any;
    headlinePage: number;
    setHeadlinePage: (page: number) => void;
    headlinePagination: { totalItem: number };
    headlineSize: number;
}

const PostHeadline: React.FC<PostHeadlineProps> = ({
                                                       headlineNews,
                                                       headlinePage,
                                                       setHeadlinePage,
                                                       headlinePagination,
                                                       headlineSize,
                                                   }) => {
    const navigate = useNavigate();

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    return (
        <div>
            {/* Headline News */}
            <DataView
                value={headlineNews ? [headlineNews] : []} // Mengubah headline menjadi array agar sesuai dengan DataView
                layout="grid"
                className="grid-custom"
                itemTemplate={(news) => (
                    <div key={news.id} className="shadow-[0_1px_6px_rgba(0,0,0,0.1)] rounded-lg">
                        <img
                            src={news.thumbnail ? `http://localhost:3000/post_picture/${news.thumbnail}` : thumbnail}
                            alt={news.title}
                            className="w-full md:h-[480px] h-[240px] object-cover rounded-t-lg bg-[#f59e0b] cursor-pointer"
                            onClick={() => navigate(`/${news.id}`)}
                        />

                        <div className="p-4 min-h-[240px] md:min-h-[160px]">
                            <h3
                                className="text-2xl font-semibold w-fit text-[#4b5563] cursor-pointer"
                                onClick={() => navigate(`/${news.id}`)}
                            >
                                {truncateText(news.title, 50)}
                            </h3>
                            <p className="text-gray-600">{news.user.name} - {news.publishedDate}</p>
                            <p className="text-gray-600 mt-2">
                                {truncateText(news.summary, 150)}
                            </p>
                        </div>
                    </div>
                )}
            />

            {/* Paginator untuk Headline News */}
            <Paginator
                first={(headlinePage - 1) * headlineSize}
                rows={headlineSize}
                totalRecords={headlinePagination.totalItem}
                onPageChange={(e) => setHeadlinePage(e.page + 1)}
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                className="mt-4"
            />
        </div>
    );
};

export default PostHeadline;
