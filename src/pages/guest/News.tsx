import React, {useEffect} from "react";
import {TabMenu} from "primereact/tabmenu";
import {InputText} from "primereact/inputtext";
import {Menu} from "primereact/menu";
import chronoverseLogo from "../../../public/chronoverse.svg";
import GuestFooter from "../../components/GuestFooter.tsx";
import useNews from "../../hooks/useNews.tsx";
import {useNavigate} from "react-router-dom";
import {ScrollTop} from "primereact/scrolltop";
import HeadlinePost from "../../components/HeadlinePost.tsx";
import useQuillConfig from "../../hooks/useQuillConfig.tsx";
import {Button} from "primereact/button";
import NotFound from "./NotFound.tsx";
import MainPost from "../../components/MainPost.tsx";
import TopPost from "../../components/TopPost.tsx";
import RegularPost from "../../components/RegularPost.tsx";
import LoadingRetry from "../../components/LoadingRetry.tsx";
import EmptyData from "../../components/EmptyData.tsx";

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
        handleCategoryChange,
        topNewsSize,
        headlineSize,
        newsSize,
        headlineMode,
        truncateText,
        post,
        notFound,
        searchMode,
        searchNews,
        searchNewsSize,
        searchNewsPagination,
        searchNewsPage,
        setSearchNewsPage,
        handleRetry,
        categories
    } = useNews();

    const navigate = useNavigate();
    useQuillConfig();
    const handleSearch = () => {
        if (searchQuery !== "") {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    useEffect(() => {
        if (loading || error) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [loading, error]);

    return (
        !notFound ?
        <div className="min-h-screen bg-white ">
            <ScrollTop className="bg-[#f59e0b] color-[#465569]"/>
            <div className={`flex flex-col fixed top-0 w-full z-[600] `}>
                <nav
                    className="flex justify-between items-center lg:flex-row flex-col bg-white  w-full lg:fixed h-[56px]   bg-none">
                    <div className={`flex lg:block justify-between items-center w-full lg:w-fit mt-2 lg:mt-0`}>
                        <div className="flex items-center h-full ml-3 ">
                            <img src={chronoverseLogo} className="lg:w-8 w-11" alt="Chronoverse Logo"/>
                            <h1 style={{color: 'var(--surface-600)'}}
                                className="ml-1 text-[#475569] font-bold text-2xl lg:block hidden">
                                CHRONO<span style={{color: 'var(--primary-500)'}}>VERSE</span>
                            </h1>
                        </div>

                        <div className="h-full flex items-center w-full justify-center lg:hidden pl-2 pr-3">
                            <div className="p-inputgroup  rounded-md h-10 w-full">
                                <InputText placeholder="Cari Berita" onChange={(e) => setSearchQuery(e.target.value)}
                                           onKeyDown={(e) => {
                                               if (e.key === "Enter") {
                                                   handleSearch();
                                               }
                                           }}
                                           value={searchQuery || ""}/>
                                <Button icon="pi pi-search" onClick={handleSearch} className={`size-10`}/>
                            </div>
                        </div>
                    </div>
                    <Menu
                        className="menu-news text-md shadow-[0_1px_6px_rgba(0,0,0,0.1)] flex items-center justify-center "
                        model={moreCategories} popup ref={menuRef}
                        style={{borderRadius: "5px", width: "fit-content"}}/>
                    <div className="lg:flex hidden h-full w-fit  items-center justify-center">
                        <div className="p-inputgroup  rounded-md mr-2 h-9 w-52">
                            <InputText placeholder="Cari Berita" onChange={(e) => setSearchQuery(e.target.value)}
                                       onKeyDown={(e) => {
                                           if (e.key === "Enter") {
                                               handleSearch();
                                           }
                                       }}
                                       value={searchQuery || ""}
                            />
                            <Button icon="pi pi-search" className={`size-9`} onClick={handleSearch}/>
                        </div>
                    </div>
                </nav>
                <TabMenu
                    model={allCategories}
                    activeIndex={activeIndex}
                    onTabChange={(e) => {
                        if (e.index !== 4) {
                            setActiveIndex(e.index);
                            if (menuRef.current) {
                                menuRef.current.hide(e);
                            }
                        }
                    }}
                    className="lg:h-full overflow-y-hidden h-[58px] w-full "
                />
            </div>

            <div className="min-h-screen p-4 mx-auto max-w-4xl bg-white lg:pt-[4.6rem] pt-32 rounded-md">
                {(error || loading) ?
                    <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999] overflow-hidden overflow-y-hidden">
                        <LoadingRetry visibleConnectionError={error} visibleLoadingConnection={loading}
                                      onRetry={handleRetry}/>
                    </div>

                    :
                    <div >
                        {searchMode ? (
                            <>
                                {searchNews.length > 0 ? (
                                    <>
                                        <h3 className="text-[#4b5563] mb-3" >Hasil Pencarian</h3>
                                        <RegularPost
                                            posts={searchNews}
                                            postPage={searchNewsPage}
                                            setPostPage={setSearchNewsPage}
                                            postSize={searchNewsSize}
                                            postPagination={searchNewsPagination}
                                            truncateText={truncateText}
                                            handleCategoryChange={handleCategoryChange}
                                        />
                                    </>

                                ) : (
                                    <EmptyData/>
                                )}</>
                        ) : (
                            <>
                                {topNews.length <= 0 ?
                                    <EmptyData/>
                                    :
                                    <>
                                        {headlineMode ? (
                                            <>
                                                <h3 className="text-[#4b5563] mb-3">Berita Terkini</h3>
                                                <HeadlinePost
                                                    headlineNews={headlineNews}
                                                    headlinePage={headlinePage}
                                                    setHeadlinePage={setHeadlinePage}
                                                    headlinePagination={headlinePagination}
                                                    headlineSize={headlineSize}
                                                    handleCategoryChange={handleCategoryChange}
                                                />
                                                <h3 className="text-[#4b5563]">Berita Populer</h3>
                                            </>
                                        ) : (
                                            <>
                                                <MainPost post={post} handleCategoryChange={handleCategoryChange}/>
                                                <h3 className="text-[#4b5563]">Berita Terkait</h3>
                                            </>
                                        )}
                                        <TopPost
                                            topPosts={topNews}
                                            topPostPage={topNewsPage}
                                            setTopPostPage={setTopNewsPage}
                                            topPostSize={topNewsSize}
                                            topPostPagination={topNewsPagination}
                                            truncateText={truncateText}
                                            handleCategoryChange={handleCategoryChange}
                                        />
                                        {headlineMode && <h3 className="text-[#4b5563]">Berita Lainnya</h3>}
                                        {!headlineMode && !searchMode && <h3 className="text-[#4b5563]">Berita Lainnya</h3>}
                                        <RegularPost
                                            posts={news}
                                            postPage={newsPage}
                                            setPostPage={setNewsPage}
                                            postSize={newsSize}
                                            postPagination={newsPagination}
                                            truncateText={truncateText}
                                            classKu={"mt-4"}
                                            handleCategoryChange={handleCategoryChange}
                                        />
                                    </>
                                }


                            </>
                        )}
                    </div>
                }
            </div>


            <GuestFooter quickLinks={categories}/>
        </div> :
            <NotFound/>
    );
};

export default News;
