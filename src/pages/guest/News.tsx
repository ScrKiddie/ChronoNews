import React, {useEffect, useState} from "react";
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
import {useNavigate, useParams} from "react-router-dom";
import {ScrollTop} from "primereact/scrolltop";
import PostHeadline from "../../components/PostHeadline.tsx";
import {Editor} from "primereact/editor";
import {PostService} from "../../services/PostService.tsx";
import {useUpdatePost} from "../../hooks/useUpdatePost.tsx";
import useQuillConfig from "../../hooks/useQuillConfig.tsx";
import defaultProfilePicture from "../../../public/profilepicture.svg";
import {Button} from "primereact/button";
import {BreadCrumb} from "primereact/breadcrumb";
import NotFound from "./NotFound.tsx";

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
        newsSize,
        headlineMode,
        setHeadlineMode
    } = useNews();

    const [fetchErr, setFetchErr] = useState(null);

    const [post, setPost] = useState({
        id: null,
        category: {
            id: null,
            name: ""
        },
        user: {
            id: null,
            name: "",
            profilePicture: ""
        },
        title: "",
        summary: "",
        content: "",
        publishedDate: null,
        lastUpdated: null,
        thumbnail: ""
    });

    const navigate = useNavigate();
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    const { id } = useParams();
    const { processContent } = useUpdatePost();



    useQuillConfig();
    useEffect(() => {
        if (headlineMode) return;
        if (id) {

            // Jika ada ID, fetch data post
            const fetchPost = async () => {
                try {
                    const post = await PostService.getPost(id);
                    setPost(post); // Set konten dari API ke state
                } catch (error) {
                    console.error("Gagal mengambil data post:", error.message);
                }
            };
            fetchPost();
        }
    }, [id, headlineMode]);



    return (
        <div className="min-h-screen bg-white">
            <ScrollTop className="bg-[#f59e0b] color-[#465569]"/>
            {/* Navbar */}
            <div className={`flex flex-col fixed top-0 w-full z-[999999]`}>
                <nav
                    className="flex justify-between items-center lg:flex-row flex-col bg-white  w-full lg:fixed  lg:mt-2  bg-none">
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
                                <InputText placeholder="Cari Berita" className="rounded-md h-10 w-full"
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
                            <InputText placeholder="Cari Berita" className="rounded-md mr-2 h-10 w-52" value={searchQuery}
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
                        className="lg:h-full overflow-y-hidden h-16  w-full "
                    />
                    {/* More Button untuk kategori tambahan */}

                </div>
            </div>

            {/* Content */}
            {/* Content */}
            <div className="p-4 mx-auto max-w-4xl bg-white lg:pt-20 pt-32 rounded-md min-h-screen">
                {/* Main Post */}
                {!headlineMode ?
                (<>
                    <main>

                        <BreadCrumb model={[
                            {label: 'News', url: '/'}, // Bisa disesuaikan dengan link yang sesuai
                            {
                                label: 'InputText',
                                template: () => <div><a className="text-[#f59e0b] ">{post.category.name}</a></div>
                            }, // Link ke kategori spesifik
                        ]}/>
                        <h1 className={`text-[#475569] font-semibold text-3xl `}>{post.title}</h1>
                        <small className={`text-[#475569] mb-2 mt-2`}>{post.summary}</small>
                        <img
                            src={post.thumbnail ? `http://localhost:3000/post_picture/${post.thumbnail}` : thumbnail}
                            alt={post.title}
                            className="w-full object-cover  bg-[#f59e0b] "
                        />

                        <div className={`flex justify-between mb-4 mt-2`}>
                            <div className={`flex gap-2 items-center `}>
                                <img
                                    src={
                                        (post.user.profilePicture
                                            ? `http://localhost:3000/profile_picture/${post.user.profilePicture}`
                                            : `${defaultProfilePicture}`)
                                    }
                                    className="size-[2.5rem] md:size-[3rem] rounded-full "
                                    style={{border: "1px solid #d1d5db"}}
                                />
                                <div className={`flex flex-col`}>
                                    <p className={`text-[#475569] text:sm md:text-md font-medium`}>{post.user.name}</p>
                                    <p className={`text-[#475569] text-xs md:text-sm`}>Diterbitkan: {post.publishedDate}</p>
                                </div>
                            </div>
                            <div className="flex lg:gap-2 gap-1 items-center md:flex">
                                <Button
                                    icon="pi pi-twitter"
                                    className="p-button-rounded md:size-[40px] size-[30px]  p-button-secondary"
                                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`, "_blank")}
                                />
                                <Button
                                    icon="pi pi-facebook"
                                    className="p-button-rounded md:size-[40px] size-[30px] p-button-info"
                                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(post.title)}`, "_blank")}
                                />
                                <Button
                                    icon="pi pi-instagram"
                                    className="p-button-rounded md:size-[40px] size-[30px] p-button-danger"
                                    onClick={() => window.open(`https://www.instagram.com/`, "_blank")}
                                />
                                <Button
                                    icon="pi pi-clipboard"
                                    className="p-button-rounded md:size-[40px] size-[30px] "
                                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`, "_blank")}
                                />
                            </div>
                        </div>

                        <div className={`w-full my-4 opacity-30`} style={{borderTop: "1px solid #8496af"}}></div>
                        <Editor
                            className={"content-view"}
                            headerTemplate={<></>}
                            value={processContent(post.content)}
                            readOnly={true}
                        />

                        <div className={`w-full my-4 opacity-30`} style={{borderTop: "1px solid #8496af"}}></div>
                        {/*<div className="flex gap-2 items-center justify-end  mb-6">*/}
                        {/*    <Button*/}
                        {/*        icon="pi pi-twitter"*/}
                        {/*        className="p-button-rounded md:size-[40px] size-[30px] p-button-secondary"*/}
                        {/*        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`, "_blank")}*/}
                        {/*    />*/}
                        {/*    <Button*/}
                        {/*        icon="pi pi-facebook"*/}
                        {/*        className="p-button-rounded md:size-[40px] size-[30px] p-button-info"*/}
                        {/*        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(post.title)}`, "_blank")}*/}
                        {/*    />*/}
                        {/*    <Button*/}
                        {/*        icon="pi pi-instagram"*/}
                        {/*        className="p-button-rounded md:size-[40px] size-[30px] p-button-danger"*/}
                        {/*        onClick={() => window.open(`https://www.instagram.com/`, "_blank")}*/}
                        {/*    />*/}
                        {/*</div>*/}
                    </main>
                    <h3 className={`text-[#4b5563]`}>Berita Lainnya</h3>


                </>)

                    :
                <PostHeadline
                    headlineNews={headlineNews}
                    headlinePage={headlinePage}
                    setHeadlinePage={setHeadlinePage}
                    headlinePagination={headlinePagination}
                    headlineSize={headlineSize}
                />
                }

                {/* Headline News */}

                {/*<PostHeadline*/}
                {/*    headlineNews={headlineNews}*/}
                {/*    headlinePage={headlinePage}*/}
                {/*    setHeadlinePage={setHeadlinePage}*/}
                {/*    headlinePagination={headlinePagination}*/}
                {/*    headlineSize={headlineSize}*/}
                {/*/>*/}

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
                                        onClick={() => navigate(`/${news.id}`)}
                                    />

                                    <div className="p-3">
                                        <h3
                                            className="text-md font-semibold cursor-pointer w-fit"
                                            onClick={() => navigate(`/${news.id}`)}
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
                                        onClick={() => navigate(`/${news.id}`)}
                                    />

                                </div>

                                {/* Konten */}
                                <div className="w-full flex flex-col lg:p-4 p-2">
                                    <h3
                                        className="text-sm sm:text-sm lg:text-lg font-semibold cursor-pointer w-fit"
                                        onClick={() => navigate(`/${news.id}`)}
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
