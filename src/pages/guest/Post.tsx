import React, {useEffect, useState} from "react";
import {TabMenu} from "primereact/tabmenu";
import {InputText} from "primereact/inputtext";
import {Menu} from "primereact/menu";
import ChronoNewsLogo from "../../../public/chrononews.svg";
import GuestFooter from "../../components/GuestFooter.tsx";
import usePost from "../../hooks/usePost.tsx";
import {useNavigate} from "react-router-dom";
import {ScrollTop} from "primereact/scrolltop";
import HeadlinePost from "../../components/HeadlinePost.tsx";
import {Button} from "primereact/button";
import NotFound from "./NotFound.tsx";
import MainPost from "../../components/MainPost.tsx";
import TopPost from "../../components/TopPost.tsx";
import RegularPost from "../../components/RegularPost.tsx";
import LoadingRetry from "../../components/LoadingRetry.tsx";
import EmptyData from "../../components/EmptyData.tsx";
import {Dropdown} from "primereact/dropdown";

const Post: React.FC = () => {
    const {
        categories,
        headlinePost,
        topPosts,
        posts,
        searchPosts,
        mainPost,
        loading,
        error,
        notFound,
        activeIndex,
        setActiveIndex,
        searchQuery,
        setSearchQuery,
        menuRef,
        allCategories,
        moreCategories,
        handleCategoryChange,
        isSearchPage,
        isPostPage,
        topPostRange,
        setTopPostRange,
        headlinePostPage, setHeadlinePostPage, headlinePostPagination,
        topPostPage, setTopPostPage, topPostPagination,
        regularPostPage, setRegularPostPage, regularPostPagination,
        searchPostPage, setSearchPostPage, searchPostPagination,
        sizes,
    } = usePost();

    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [navZIndex, setNavZIndex] = useState("z-[2001]");

    const handleSearch = () => {
        if (searchQuery.trim() !== "") {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    useEffect(() => {
        if (loading || error || isModalVisible) {
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
            document.documentElement.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
            document.documentElement.style.overflow = "auto";
        };
    }, [loading, error, isModalVisible]);

    useEffect(() => {
        let timer: number;
        if (isModalVisible) {
            setNavZIndex("z-[1000]");
        } else {
            timer = setTimeout(() => {
                setNavZIndex("z-[2001]");
            }, 300);
        }
        return () => clearTimeout(timer);
    }, [isModalVisible]);


    if (notFound) {
        return <NotFound />;
    }

    return (
        <div className="min-h-screen bg-white">
            <ScrollTop className={`bg-[#f59e0b] color-[#465569] ${loading && "hidden"} ${error && "hidden"} ${isModalVisible && "hidden"}`} />
            
            <div className={`flex flex-col fixed top-0 w-full ${navZIndex}`}>
                <nav className="flex justify-between items-center xl:flex-row flex-col bg-white w-full xl:fixed h-[56px]">
                    <div className="flex xl:block justify-between items-center w-full xl:w-fit mt-2 xl:mt-0">
                        <div className="flex items-center h-full ml-3">
                            <img src={ChronoNewsLogo as string} className="xl:w-8 w-11" alt="ChronoNewsLogo" />
                            <h1 style={{color: 'var(--surface-600)'}} className="ml-1 text-[#475569] font-bold text-2xl xl:block hidden">
                                CHRONO<span style={{color: 'var(--primary-500)'}}>NEWS</span>
                            </h1>
                        </div>
                        <div className="h-full flex items-center w-full justify-center xl:hidden pl-2 pr-3">
                            <div className="p-inputgroup rounded-md h-10 w-full">
                                <InputText placeholder="Cari Berita" onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} value={searchQuery || ""} />
                                <Button icon="pi pi-search" onClick={handleSearch} className="size-10" />
                            </div>
                        </div>
                    </div>
                    <Menu className="menu-news text-md shadow-[0_1px_6px_rgba(0,0,0,0.1)]" model={moreCategories} popup ref={menuRef} style={{borderRadius: "5px", maxWidth: "162px"}} />
                    <div className="xl:flex hidden h-full w-fit items-center justify-center">
                        <div className="p-inputgroup rounded-md mr-2 h-9 w-52">
                            <InputText placeholder="Cari Berita" onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} value={searchQuery || ""} />
                            <Button icon="pi pi-search" className="size-9" onClick={handleSearch} />
                        </div>
                    </div>
                </nav>
                <TabMenu 
                    model={allCategories} 
                    activeIndex={activeIndex} 
                    onTabChange={(e) => {
                        if (e.index !== 4) {
                            setActiveIndex(e.index);
                            menuRef.current?.hide(e.originalEvent);
                        }
                    }} 
                    className="lg:h-full overflow-y-hidden h-[58px] w-full" 
                />
            </div>

            <div className="min-h-screen p-4 mx-auto max-w-4xl bg-white xl:pt-[4.6rem] pt-32 rounded-md">
                {(loading && posts.length === 0 && searchPosts.length === 0 && !mainPost?.id) || error ? (
                    <div className="fixed inset-0 flex items-center justify-center bg-white z-[1999]">
                        <LoadingRetry visibleConnectionError={error} visibleLoadingConnection={loading} onRetry={() => window.location.reload()} />
                    </div>
                ) : null}

                {isSearchPage ? (
                    <>
                        {searchPosts.length > 0 ? (
                            <RegularPost
                                post={searchPosts}
                                postPage={searchPostPage}
                                setPostPage={setSearchPostPage}
                                postSize={sizes.search}
                                postPagination={searchPostPagination}
                                handleCategoryChange={handleCategoryChange}
                            />
                        ) : (
                            !loading && <EmptyData />
                        )}
                    </>
                ) : isPostPage ? (
                    <>
                        <MainPost mainPost={mainPost} setIsModalVisible={setIsModalVisible} isModalVisible={isModalVisible} handleCategoryChange={handleCategoryChange} />
                        <h3 className="text-[#4b5569] text-xl mt-4">Berita Lainnya</h3>
                        <RegularPost
                            post={posts}
                            postPage={regularPostPage}
                            setPostPage={setRegularPostPage}
                            postSize={sizes.regular}
                            postPagination={regularPostPagination}
                            handleCategoryChange={handleCategoryChange}
                            classKu="mt-4"
                        />
                    </>
                ) : (
                    <>
                        {posts.length > 0 ? (
                            <>
                                <h3 className="text-[#4b5563] mb-3 text-xl">Berita Terkini</h3>
                                <HeadlinePost
                                    headlinePost={headlinePost}
                                    headlinePostPage={headlinePostPage}
                                    setHeadlinePostPage={setHeadlinePostPage}
                                    headlinePostPagination={headlinePostPagination}
                                    headlineSize={sizes.headline}
                                    handleCategoryChange={handleCategoryChange}
                                />
                                
                                <div className="w-full flex md:items-center justify-between mt-4 md:flex-row flex-col text-start">
                                    <h3 className="text-[#4b5569] mb-2 md:mb-0 text-xl">Berita Populer</h3>
                                    <Dropdown
                                        value={topPostRange}
                                        options={[{ label: 'Hari Ini', value: '1' }, { label: '7 Hari Terakhir', value: '7' }, { label: '30 Hari Terakhir', value: '30' }, { label: 'Semua Waktu', value: 'all' }]}
                                        onChange={(e) => setTopPostRange(e.value)}
                                        placeholder="Pilih Waktu"
                                        className="md:w-[200px] w-full guest"
                                    />
                                </div>
                                <TopPost
                                    topPost={topPosts}
                                    topPostPage={topPostPage}
                                    setTopPostPage={setTopPostPage}
                                    topPostSize={sizes.top}
                                    topPostPagination={topPostPagination}
                                    handleCategoryChange={handleCategoryChange}
                                />

                                <h3 className="text-[#4b5569] text-xl mt-4">Berita Lainnya</h3>
                                <RegularPost
                                    post={posts}
                                    postPage={regularPostPage}
                                    setPostPage={setRegularPostPage}
                                    postSize={sizes.regular}
                                    postPagination={regularPostPagination}
                                    handleCategoryChange={handleCategoryChange}
                                />
                            </>
                        ) : (
                            !loading && <EmptyData />
                        )}
                    </>
                )}
            </div>
            <GuestFooter quickLinks={categories} />
        </div>
    );
};

export default Post;
