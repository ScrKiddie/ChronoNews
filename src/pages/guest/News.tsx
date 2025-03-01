import React from "react";
import { TabMenu } from "primereact/tabmenu";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import { DataView } from "primereact/dataview";
import { Paginator } from "primereact/paginator";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import chronoverseLogo from "../../../public/chronoverse.svg";
import GuestFooter from "../../components/GuestFooter.tsx";
import useNews from "../../hooks/useNews.tsx";
import thumbnail from "../../../public/thumbnail.svg";
import { useNavigate } from "react-router-dom";
import {ScrollTop} from "primereact/scrolltop";
import PostHeadline from "../../components/PostHeadline.tsx";

const News: React.FC = () => {
    const {
        activeIndex,
        setActiveIndex,
        searchQuery,
        setSearchQuery,
        headlineNews,
        topNews,
        news,
        headlinePage,
        setHeadlinePage,
        topNewsPage,
        setTopNewsPage,
        newsPage,
        setNewsPage,
        headlinePagination,
        topNewsPagination,
        newsPagination,
        menuRef,
        allCategories,
        moreCategories,
        loading,
        error,
        selectedCategory,
        handleCategoryChange,
        topNewsSize,
        headlineSize,
        newsSize
    } = useNews();

    const navigate = useNavigate();
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    return (
        <div className="min-h-screen bg-white">
            {/*<ScrollTop className="bg-[#f59e0b] color-[#465569]"/>*/}
            {/* Navbar */}
            <div className={`flex flex-col fixed top-0 w-full z-[9999999]`}>
                <nav
                    className="flex justify-between lg:flex-row flex-col bg-white items-center w-full lg:fixed  lg:mt-2">
                    {/* Logo */}
                    <div className={`flex lg:block justify-between items-center w-full lg:w-fit mt-2 lg:mt-0`}>
                        <div className="flex items-center h-full ml-3 ">
                            <img src={chronoverseLogo} className="lg:w-8 w-11" alt="Chronoverse Logo"/>
                            <h1 className="ml-1 text-[#475569] font-bold text-2xl lg:block hidden">
                                CHRONO<span className="text-[#f59e0b]">VERSE</span>
                            </h1>
                        </div>

                        <div className="h-full flex items-center w-full justify-center lg:hidden pl-2 pr-3">
                            <IconField iconPosition="left" className={`w-full`}>
                                <InputIcon className="pi pi-search"/>
                                <InputText placeholder="Cari Berita..." className="rounded-md h-10 w-full"
                                           value={searchQuery}
                                           onChange={(e) => setSearchQuery(e.target.value)}/>
                            </IconField>
                        </div>
                    </div>
                    {/* TabMenu - Dibuat Scrollable */}

                    <Menu className="menu-news text-md shadow-[0_1px_6px_rgba(0,0,0,0.1)] flex items-center justify-center "

                          model={moreCategories} popup ref={menuRef}
                          style={{borderRadius: "5px", width: "fit-content"}}/>
                    {/* Search Bar */}
                    <div className="lg:flex hidden h-full w-fit  items-center justify-center">
                        <IconField iconPosition="left">
                            <InputIcon className="pi pi-search"/>
                            <InputText placeholder="Cari Berita..." className="rounded-md mr-2 h-10 w-52" value={searchQuery}
                                       onChange={(e) => {
                                           setSearchQuery(e.target.value)

                                       }}/>
                        </IconField>
                    </div>
                </nav>
                <div className="">
                    <TabMenu
                        model={allCategories}
                        activeIndex={activeIndex}
                        onTabChange={(e) => {
                            if (e.index !== 4) {
                                setActiveIndex(e.index);
                                if (menuRef.current) {
                                    menuRef.current.hide(e); // Menutup menu saat tab berubah
                                }
                            }
                        }}
                        className="h-full w-full"
                    />
                    {/* More Button untuk kategori tambahan */}

                </div>
            </div>

            {/* Content */}
            {/* Content */}
            <div className="p-6 mx-auto max-w-4xl bg-white lg:pt-24 pt-32 rounded-md min-h-screen">
                {/* Headline News */}
                <PostHeadline
                    headlineNews={headlineNews}
                    headlinePage={headlinePage}
                    setHeadlinePage={setHeadlinePage}
                    headlinePagination={headlinePagination}
                    headlineSize={headlineSize}
                />

                {/* Top News */}
                <div className="mt-4">
                    <DataView
                        value={topNews}
                        layout="grid"
                        className="grid-custom"
                        itemTemplate={(news) => (
                            <div key={news.id} className=" sm:w-1/3 ">
                                <div
                                    className="shadow-[0_1px_6px_rgba(0,0,0,0.1)] rounded-lg min-h-[320px] flex flex-col">
                                    <img
                                        src={news.thumbnail ? `http://localhost:3000/post_picture/${news.thumbnail}` : thumbnail}
                                        alt={news.title}
                                        className="bg-[#f59e0b] w-full h-40 object-cover rounded-t-lg cursor-pointer"
                                        onClick={() => navigate(`/news/${news.id}`)}
                                    />

                                    <div className="p-3">
                                        <h3
                                            className="text-md font-semibold cursor-pointer w-fit"
                                            onClick={() => navigate(`/news/${news.id}`)}
                                        >
                                            {truncateText(news.title, 40)}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-1">{news.user.name} - {news.publishedDate}</p>
                                        <p className="text-gray-600 text-sm">
                                            {truncateText(news.summary, 100)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    />

                    {/* Paginator untuk Top News */}
                    <Paginator
                        first={(topNewsPage - 1) * topNewsSize}
                        rows={topNewsSize}
                        totalRecords={topNewsPagination.totalItem}
                        onPageChange={(e) => setTopNewsPage(e.page + 1)}
                        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        className="mt-4"
                    />

                </div>

                {/* Regular News */}
                <div className="mt-4">
                    <DataView
                        value={news}
                        layout="list"
                        itemTemplate={(news) => (
                            <div key={news.id}
                                 className="flex my-2 justify-between min-h-36 md:min-h-40 shadow-[0_1px_6px_rgba(0,0,0,0.1)] rounded-lg">

                                {/* Gambar */}
                                <div className="lg:w-[50%] w-[80%] h-full sm:h-40">
                                    <img
                                        src={news.thumbnail ? `http://localhost:3000/post_picture/${news.thumbnail}` : thumbnail}
                                        alt={news.title}
                                        className="h-full w-full object-cover bg-[#f59e0b] rounded-tl-lg rounded-bl-lg cursor-pointer"
                                        onClick={() => navigate(`/news/${news.id}`)}
                                    />

                                </div>

                                {/* Konten */}
                                <div className="w-full flex flex-col lg:p-4 p-2">
                                    <h3
                                        className="text-sm sm:text-sm lg:text-lg font-semibold cursor-pointer w-fit"
                                        onClick={() => navigate(`/news/${news.id}`)}
                                    >
                                        {truncateText(news.title, 60)}
                                    </h3>

                                    <p className="text-gray-600 text-xs sm:text-sm mb-1">{news.user.name} - {news.publishedDate}</p>
                                    <p className="text-gray-600 text-xs sm:text-sm break-all">
                                        {truncateText(news.summary, 100)}
                                    </p>

                                </div>
                            </div>
                        )}
                    />

                    {/* Paginator untuk News */}
                    <Paginator
                        first={(newsPage - 1) * newsSize}
                        rows={newsSize}
                        totalRecords={newsPagination.totalItem}
                        onPageChange={(e) => setNewsPage(e.page + 1)}
                        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        className="mt-4"
                    />

                </div>
            </div>


            <GuestFooter/>
        </div>
    );
};

export default News;
