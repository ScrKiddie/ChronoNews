import React from "react";
import {DataView} from "primereact/dataview";
import {Paginator} from "primereact/paginator";
import {useNavigate} from "react-router-dom";
import thumbnail from "../../public/thumbnail.svg";

const apiUri = import.meta.env.VITE_CHRONOVERSE_API_URI;

const HeadlinePost = ({
                          headlineNews,
                          headlinePage,
                          setHeadlinePage,
                          headlinePagination,
                          headlineSize,
                          handleCategoryChange
                      }) => {

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    const navigate = useNavigate();

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
                            src={news.thumbnail ? `${apiUri}/post_picture/${news.thumbnail}` : thumbnail}
                            alt={news.title}
                            className="w-full md:h-[480px] h-[240px] object-cover rounded-t-lg bg-[#f59e0b] cursor-pointer"
                            onClick={() => navigate(`/post?id=${news.id}`)}
                        />

                        <div className="p-4 min-h-[240px] md:min-h-[160px]">
                            <h3
                                className="text-2xl font-semibold w-fit cursor-pointer"
                                onClick={() => navigate(`/post?id=${news.id}`)}
                            >
                                {truncateText(news.title, 50)}
                            </h3>
                            <p className=""><span
                                className="no-underline text-gray-600 hover:text-gray-600 cursor-pointer"
                                onClick={() => {
                                    handleCategoryChange(headlineNews.category?.name)
                                }}
                            >
                            {news.category?.name}
                          </span> - {news.publishedDate}</p>
                            <p className="mt-1">
                                {truncateText(news.summary, 150)}
                            </p>
                        </div>
                    </div>
                )}
            />
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

export default HeadlinePost;
