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
import useQuillConfig from "../../hooks/useQuillConfig.tsx";
import {Button} from "primereact/button";
import NotFound from "./NotFound.tsx";
import MainPost from "../../components/MainPost.tsx";
import TopPost from "../../components/TopPost.tsx";
import RegularPost from "../../components/RegularPost.tsx";
import LoadingRetry from "../../components/LoadingRetry.tsx";
import EmptyData from "../../components/EmptyData.tsx";
import {Dropdown} from "primereact/dropdown";
import dayjs from "dayjs";

const Post: React.FC = () => {
    const {
        activeIndex,
        setActiveIndex,
        searchQuery,
        setSearchQuery,
        headlinePost,
        topPost,
        post,
        headlinePostPage,
        setHeadlinePostPage,
        topPostPage,
        setTopPostPage,
        postPage,
        setPostPage,
        headlinePostPagination,
        topPostPagination,
        postPagination,
        menuRef,
        allCategories,
        moreCategories,
        loading,
        error,
        handleCategoryChange,
        topPostSize,
        headlineSize,
        postSize,
        headlineMode,
        truncateText,
        mainPost,
        notFound,
        searchMode,
        searchPost,
        searchPostSize,
        searchPostPagination,
        searchPostPage,
        setSearchPostPage,
        handleRetry,
        categories,
        setEndDate,
        setStartDate,
        waktuOptions,
        setRange,
        range,
        searchSort,
        setSearchSort,
        previousSearchSort,
        setPreviousSearchSort,
    } = usePost();

    const [dropdownKey, setDropdownKey] = useState(0);

    useEffect(() => {
        setDropdownKey(prev => prev + 1);
    }, [activeIndex]);

    const navigate = useNavigate();
    useQuillConfig();

    const handleSearch = () => {
        if (searchQuery !== "") {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const [isModalVisible, setIsModalVisible] = useState(false);

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


    const [zIndexClass, setZIndexClass] = useState("z-[2001]");

    useEffect(() => {
        if (isModalVisible) {
            setZIndexClass("z-[600]");
        } else {
            const timer = setTimeout(() => {
                setZIndexClass("z-[2001]");
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [isModalVisible]);



    return (
        !notFound ?
            <div className="min-h-screen bg-white ">
                <ScrollTop className={`bg-[#f59e0b] color-[#465569] ${loading && "hidden"} ${error && "hidden"} ${isModalVisible && "hidden" }`}/>
                <div className={`flex flex-col fixed top-0 w-full ${zIndexClass}`}>
                    <nav className="flex justify-between items-center xl:flex-row flex-col bg-white  w-full xl:fixed h-[56px]   bg-none">
                        <div className={`flex xl:block justify-between items-center w-full xl:w-fit mt-2 xl:mt-0`}>
                            <div className="flex items-center h-full ml-3 ">
                                <img src={ChronoNewsLogo as string} className="xl:w-8 w-11" alt="ChronoNewsLogo"/>
                                <h1 style={{color: 'var(--surface-600)'}}
                                    className="ml-1 text-[#475569] font-bold text-2xl xl:block hidden">
                                    CHRONO<span style={{color: 'var(--primary-500)'}}>NEWS</span>
                                </h1>
                            </div>

                            <div className="h-full flex items-center w-full justify-center xl:hidden pl-2 pr-3">
                                <div className="p-inputgroup  rounded-md h-10 w-full">
                                    <InputText placeholder="Cari Berita"
                                               onChange={(e) => setSearchQuery(e.target.value)}
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
                            className="menu-news  text-md shadow-[0_1px_6px_rgba(0,0,0,0.1)] flex items-center justify-center z-[2000]"
                            model={moreCategories} popup ref={menuRef}
                            style={{borderRadius: "5px", width: "fit-content"}}/>
                        <div className="xl:flex hidden h-full w-fit  items-center justify-center">
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

                <div className="min-h-screen p-4 mx-auto max-w-4xl bg-white xl:pt-[4.6rem] pt-32 rounded-md">
                    <div>
                        {(error || loading) ? <div
                            className="fixed inset-0 flex items-center justify-center bg-white overflow-hidden overflow-y-hidden z-[1999]">
                            <LoadingRetry visibleConnectionError={error} className={""}
                                          visibleLoadingConnection={loading}
                                          onRetry={handleRetry}/>
                        </div> : ""}
                        {searchMode ? (
                            <>

                                {searchPost.length > 0 ? (
                                    <>
                                        <div
                                            className={`w-full flex md:items-center  justify-between mb-4  md:flex-row flex-col text-start`}>
                                            <h3 className="text-[#4b5563] mb-2 md:mb-0 text-xl">Hasil Pencarian</h3>
                                            <Dropdown
                                                value={searchSort}
                                                onChange={(e) => {
                                                    setSearchSort(e.value);
                                                }}
                                                options={[
                                                    { label: 'Terbaru', value: '-published_date' },
                                                    { label: 'Terpopuler', value: '-view_count' }
                                                ]}
                                            />
                                        </div>
                                        <RegularPost
                                            post={searchPost}
                                            postPage={searchPostPage}
                                            setPostPage={setSearchPostPage}
                                            postSize={searchPostSize}
                                            postPagination={searchPostPagination}
                                            truncateText={truncateText}
                                            handleCategoryChange={handleCategoryChange}
                                        />
                                    </>

                                ) : (
                                    <EmptyData/>
                                )}</>
                        ) : (
                            <>
                                {post.length <= 0 ?
                                    <EmptyData/>
                                    :
                                    <>
                                        {headlineMode ? (
                                            <>
                                                <h3 className="text-[#4b5563] mb-3 text-xl">Berita Terkini</h3>
                                                <HeadlinePost
                                                    headlinePost={headlinePost}
                                                    headlinePostPage={headlinePostPage}
                                                    setHeadlinePostPage={setHeadlinePostPage}
                                                    headlinePostPagination={headlinePostPagination}
                                                    headlineSize={headlineSize}
                                                    handleCategoryChange={handleCategoryChange}
                                                />


                                            </>
                                        ) : (
                                                <MainPost mainPost={mainPost}
                                                          setIsModalVisible={setIsModalVisible}
                                                          isModalVisible={isModalVisible}
                                                          handleCategoryChange={handleCategoryChange}
                                                />

                                        )}
                                        {headlineMode &&
                                            <>
                                                <div
                                                    className={`w-full flex md:items-center  justify-between mt-4 md:flex-row flex-col text-start`}>
                                                    <h3 className="text-[#4b5563] mb-2 md:mb-0 text-xl">Berita
                                                        Populer</h3>
                                                    <Dropdown
                                                        key={dropdownKey}
                                                        value={range}
                                                        options={waktuOptions}
                                                        onChange={(e) => {
                                                            const value = e.value;
                                                            setRange(value);
                                                            let start = null;
                                                            let end = dayjs().endOf('day').utc().unix();
                                                            if (value === '1') {
                                                                start = dayjs().startOf('day').utc().unix();
                                                            } else if (value === '7') {
                                                                start = dayjs().subtract(6, 'day').startOf('day').utc().unix();
                                                            } else if (value === '30') {
                                                                start = dayjs().subtract(29, 'day').startOf('day').utc().unix();
                                                            } else {
                                                                start = null;
                                                                end = null;
                                                            }
                                                            setStartDate(start);
                                                            setEndDate(end);
                                                            if (topPostPage != 1) {
                                                                setTopPostPage(1)
                                                            }
                                                            return
                                                        }}
                                                        placeholder="Pilih Waktu"
                                                        className={`md:w-[200px] w-full guest`}

                                                    />
                                                </div>
                                                <TopPost
                                                    topPost={topPost}
                                                    topPostPage={topPostPage}
                                                    setTopPostPage={setTopPostPage}
                                                    topPostSize={topPostSize}
                                                    topPostPagination={topPostPagination}
                                                    truncateText={truncateText}
                                                    handleCategoryChange={handleCategoryChange}
                                                />

                                            </>


                                        }
                                        {headlineMode && <h3 className="text-[#4b5563] text-xl">Berita Lainnya</h3>}
                                        {!headlineMode && !searchMode &&
                                            <h3 className="text-[#4b5563] text-xl">Berita Lainnya</h3>}
                                        <RegularPost
                                            post={post}
                                            postPage={postPage}
                                            setPostPage={setPostPage}
                                            postSize={postSize}
                                            postPagination={postPagination}
                                            truncateText={truncateText}
                                            classKu={"mt-4"}
                                            handleCategoryChange={handleCategoryChange}
                                        />
                                    </>
                                }


                            </>
                        )}
                    </div>
                </div>


                <GuestFooter quickLinks={categories}/>
            </div> :
            <NotFound/>
    );
};

export default Post;
