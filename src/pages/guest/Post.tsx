import React, { useState, useEffect, useRef } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';
import ChronoNewsLogo from '../../../public/chrononews.svg';
import GuestFooter from '../../components/layout/GuestFooter.tsx';
import usePost from '../../hooks/usePost.ts';
import { useNavigate } from 'react-router-dom';
import { ScrollTop } from 'primereact/scrolltop';
import HeadlinePost from '../../components/post/HeadlinePost.tsx';
import { Button } from 'primereact/button';
import NotFound from './NotFound.tsx';
import MainPost from '../../components/post/MainPost.tsx';
import TopPost from '../../components/post/TopPost.tsx';
import RegularPost from '../../components/post/RegularPost.tsx';
import LoadingRetry from '../../components/ui/LoadingRetry.tsx';
import EmptyData from '../../components/ui/EmptyData.tsx';
import MiniEmptyData from '../../components/ui/MiniEmptyData.tsx';
import { Dropdown } from 'primereact/dropdown';
import { Skeleton } from 'primereact/skeleton';
import SafeImage from '../../components/ui/SafeImage.tsx';
import { InitialDataStructure } from '../../types/initialData.ts';
import { FadeWrapper } from '../../components/ui/FadeWrapper.tsx';

interface PostProps {
    initialData?: InitialDataStructure;
}

const Post: React.FC<PostProps> = ({ initialData }) => {
    const [isRetrying, setIsRetrying] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const tabMenuContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        dropdownRef,
        allDesktopCategories,
        allMobileCategories,
        moreCategories,
        handleCategoryChange,
        isSearchPage,
        isPostPage,
        topPostRange,
        setTopPostRange,
        headlinePostPage,
        headlinePostPagination,
        topPostPage,
        topPostPagination,
        regularPostPage,
        regularPostPagination,
        searchPostPage,
        searchPostPagination,
        sizes,
        handlePageChange,
        refetchAll,
    } = usePost(initialData, isDesktop);

    const navigate = useNavigate();

    useEffect(() => {
        if (tabMenuContainerRef.current) {
            const container = tabMenuContainerRef.current;
            const activeTab = container.querySelector('.p-highlight') as HTMLElement;

            if (activeTab) {
                const scrollPosition =
                    activeTab.offsetLeft - container.clientWidth / 2 + activeTab.clientWidth / 2;

                container.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth',
                });
            }
        }
    }, [activeIndex]);

    const handleRetry = async () => {
        setIsRetrying(true);
        try {
            await refetchAll(true);
        } finally {
            setIsRetrying(false);
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim() !== '') {
            navigate(`/cari?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    if (notFound) {
        return <NotFound />;
    }

    const isCategoryPage = !isSearchPage && !isPostPage;
    const hasNoHeadline = !headlinePost;
    const hasNoTopPosts = !topPosts || topPosts.length === 0;
    const hasNoRegularPosts = !posts || posts.length === 0;

    const isCompletelyEmpty = isCategoryPage && hasNoHeadline && hasNoTopPosts && hasNoRegularPosts;

    const hasLainnyaTab = isDesktop && moreCategories.length > 0;
    const lainnyaIndex = allDesktopCategories.length - 1;

    const renderContent = () => {
        if (isSearchPage) {
            return (
                <div className="relative min-h-[80vh]">
                    {!loading && searchPosts && searchPosts.length > 0 && (
                        <h3 className="text-[#4b5569] text-xl mb-3">Hasil Pencarian</h3>
                    )}
                    {loading ? (
                        <FadeWrapper key="search-loading">
                            <h3 className="text-[#4b5563] mb-4 text-xl">
                                <Skeleton width="10rem" />
                            </h3>
                            <RegularPost
                                loading={true}
                                post={null}
                                postPage={searchPostPage}
                                handlePageChange={(page) => handlePageChange('search', page)}
                                postSize={sizes.search}
                                postPagination={searchPostPagination}
                                handleCategoryChange={handleCategoryChange}
                            />
                        </FadeWrapper>
                    ) : !searchPosts || searchPosts.length === 0 ? (
                        <FadeWrapper
                            key="search-empty"
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <EmptyData message="Tidak ada hasil yang ditemukan untuk kata kunci Anda. Coba cari dengan kata kunci lain." />
                        </FadeWrapper>
                    ) : (
                        <FadeWrapper key="search-data">
                            <RegularPost
                                loading={false}
                                post={searchPosts}
                                postPage={searchPostPage}
                                handlePageChange={(page) => handlePageChange('search', page)}
                                postSize={sizes.search}
                                postPagination={searchPostPagination}
                                handleCategoryChange={handleCategoryChange}
                            />
                        </FadeWrapper>
                    )}
                </div>
            );
        }

        if (isPostPage) {
            return (
                <>
                    <FadeWrapper
                        key={mainPost?.id ? `main-post-${mainPost.id}` : 'main-post-loading'}
                    >
                        <MainPost
                            mainPost={mainPost || null}
                            handleCategoryChange={handleCategoryChange}
                        />
                    </FadeWrapper>

                    <h3 className="text-[#4b5563] my-4 text-xl">
                        {loading ? <Skeleton width="10rem" /> : 'Berita Lainnya'}
                    </h3>
                    {loading ? (
                        <FadeWrapper key="post-regular-loading">
                            <RegularPost
                                loading={true}
                                post={null}
                                postPage={regularPostPage}
                                handlePageChange={(page) => handlePageChange('regular', page)}
                                postSize={sizes.regular}
                                postPagination={regularPostPagination}
                                handleCategoryChange={handleCategoryChange}
                                classKu="mt-4"
                            />
                        </FadeWrapper>
                    ) : hasNoRegularPosts ? (
                        <FadeWrapper key="post-regular-empty">
                            <MiniEmptyData message="Belum ada berita lainnya di kategori ini." />
                        </FadeWrapper>
                    ) : (
                        <FadeWrapper key="post-regular-data">
                            <RegularPost
                                loading={false}
                                post={posts}
                                postPage={regularPostPage}
                                handlePageChange={(page) => handlePageChange('regular', page)}
                                postSize={sizes.regular}
                                postPagination={regularPostPagination}
                                handleCategoryChange={handleCategoryChange}
                                classKu="mt-4"
                            />
                        </FadeWrapper>
                    )}
                </>
            );
        }

        if (!loading && isCompletelyEmpty) {
            return (
                <div className="relative min-h-[80vh] flex items-center justify-center">
                    <FadeWrapper key="empty-loading">
                        <EmptyData message="Belum ada berita untuk ditampilkan." />
                    </FadeWrapper>
                </div>
            );
        }

        return (
            <>
                <h3 className="text-[#4b5563] mb-3 text-xl">
                    {loading ? <Skeleton width="10rem" /> : 'Berita Terkini'}
                </h3>
                {loading ? (
                    <FadeWrapper key="headline-loading">
                        <HeadlinePost
                            loading={true}
                            headlinePost={null}
                            headlinePostPage={headlinePostPage}
                            handlePageChange={(page) => handlePageChange('headline', page)}
                            headlinePostPagination={headlinePostPagination}
                            headlineSize={sizes.headline}
                            handleCategoryChange={handleCategoryChange}
                        />
                    </FadeWrapper>
                ) : hasNoHeadline ? (
                    <FadeWrapper key="headline-empty">
                        <MiniEmptyData message="Tidak ada berita terkini untuk ditampilkan." />
                    </FadeWrapper>
                ) : (
                    <FadeWrapper key="headline-data">
                        <HeadlinePost
                            loading={false}
                            headlinePost={headlinePost}
                            headlinePostPage={headlinePostPage}
                            handlePageChange={(page) => handlePageChange('headline', page)}
                            headlinePostPagination={headlinePostPagination}
                            headlineSize={sizes.headline}
                            handleCategoryChange={handleCategoryChange}
                        />
                    </FadeWrapper>
                )}

                <div className="w-full flex md:items-center justify-between mt-4 md:flex-row flex-col text-start">
                    <h3 className="text-[#4b5569] mb-2 md:mb-0 text-xl">
                        {loading ? <Skeleton width="10rem" /> : 'Berita Populer'}
                    </h3>
                    {loading ? (
                        <div className={`md:w-[200px] w-full`}>
                            <Skeleton height="2.5rem" />
                        </div>
                    ) : (
                        <FadeWrapper>
                            <Dropdown
                                ref={dropdownRef}
                                value={topPostRange}
                                options={[
                                    { label: 'Hari Ini', value: '1' },
                                    { label: '7 Hari Terakhir', value: '7' },
                                    { label: '30 Hari Terakhir', value: '30' },
                                    { label: 'Semua Waktu', value: 'all' },
                                ]}
                                onChange={(e) => setTopPostRange(e.value)}
                                placeholder="Pilih Waktu"
                                className="md:w-[200px] w-full guest"
                            />
                        </FadeWrapper>
                    )}
                </div>
                {loading ? (
                    <FadeWrapper key="top-loading">
                        <TopPost
                            loading={true}
                            topPost={null}
                            topPostPage={topPostPage}
                            handlePageChange={(page) => handlePageChange('top', page)}
                            topPostSize={sizes.top}
                            topPostPagination={topPostPagination}
                            handleCategoryChange={handleCategoryChange}
                        />
                    </FadeWrapper>
                ) : hasNoTopPosts ? (
                    <FadeWrapper key="top-empty">
                        <MiniEmptyData message="Tidak ada berita populer untuk ditampilkan." />
                    </FadeWrapper>
                ) : (
                    <FadeWrapper key="top-data">
                        <TopPost
                            loading={false}
                            topPost={topPosts}
                            topPostPage={topPostPage}
                            handlePageChange={(page) => handlePageChange('top', page)}
                            topPostSize={sizes.top}
                            topPostPagination={topPostPagination}
                            handleCategoryChange={handleCategoryChange}
                        />
                    </FadeWrapper>
                )}

                <h3 className="text-[#4b5569] text-xl my-3">
                    {loading ? <Skeleton width="10rem" /> : 'Berita Lainnya'}
                </h3>
                {loading ? (
                    <FadeWrapper key="regular-loading">
                        <RegularPost
                            loading={true}
                            post={null}
                            postPage={regularPostPage}
                            handlePageChange={(page) => handlePageChange('regular', page)}
                            postSize={sizes.regular}
                            postPagination={regularPostPagination}
                            handleCategoryChange={handleCategoryChange}
                        />
                    </FadeWrapper>
                ) : hasNoRegularPosts ? (
                    <FadeWrapper key="regular-empty">
                        <MiniEmptyData message="Tidak ada berita lainnya untuk ditampilkan." />
                    </FadeWrapper>
                ) : (
                    <FadeWrapper key="regular-data">
                        <RegularPost
                            loading={false}
                            post={posts}
                            postPage={regularPostPage}
                            handlePageChange={(page) => handlePageChange('regular', page)}
                            postSize={sizes.regular}
                            postPagination={regularPostPagination}
                            handleCategoryChange={handleCategoryChange}
                        />
                    </FadeWrapper>
                )}
            </>
        );
    };

    return (
        <div className="min-h-screen bg-white">
            <ScrollTop
                className={`bg-[#f59e0b] color-[#465569] ${loading && 'hidden'} ${error && 'hidden'}`}
            />

            <div className={`flex flex-col fixed top-0 w-full z-[2001]`}>
                <nav className="flex justify-between items-center xl:flex-row flex-col bg-white w-full xl:fixed h-[56px]">
                    <div className="flex xl:block justify-between items-center w-full xl:w-fit mt-2 xl:mt-0">
                        <div className="flex items-center h-full ml-3">
                            <div className="relative xl:w-8 xl:h-8 w-11 h-11 shrink-0 rounded-md overflow-hidden">
                                <SafeImage
                                    src={String(ChronoNewsLogo)}
                                    className="w-full h-full object-contain"
                                    alt="ChronoNewsLogo"
                                />
                            </div>

                            <h1
                                style={{ color: 'var(--surface-600)' }}
                                className="ml-1 text-[#475569] font-bold text-2xl xl:block hidden"
                            >
                                CHRONO<span style={{ color: 'var(--primary-500)' }}>NEWS</span>
                            </h1>
                        </div>
                        <div className="h-full flex items-center w-full justify-center xl:hidden pl-2 pr-3">
                            <div className="p-inputgroup rounded-md h-10 w-full">
                                <InputText
                                    placeholder="Cari Berita"
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    value={searchQuery || ''}
                                />
                                <Button
                                    icon="pi pi-search"
                                    onClick={handleSearch}
                                    className="size-10"
                                />
                            </div>
                        </div>
                    </div>
                    <Menu
                        className="menu-news text-md shadow-[0_1px_6px_rgba(0,0,0,0.1)]"
                        model={moreCategories}
                        popup
                        ref={menuRef}
                        style={{ borderRadius: '5px', maxWidth: '162px' }}
                    />
                    <div className="xl:flex hidden h-full w-fit items-center justify-center">
                        <div className="p-inputgroup rounded-md mr-2 h-9 w-52">
                            <InputText
                                placeholder="Cari Berita"
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                value={searchQuery || ''}
                            />
                            <Button icon="pi pi-search" className="size-9" onClick={handleSearch} />
                        </div>
                    </div>
                </nav>

                <div
                    ref={tabMenuContainerRef}
                    className="w-full overflow-x-auto hide-scrollbar bg-white"
                >
                    <TabMenu
                        model={isDesktop ? allDesktopCategories : allMobileCategories}
                        activeIndex={activeIndex}
                        onTabChange={(e) => {
                            if (hasLainnyaTab && e.index === lainnyaIndex) {
                                return;
                            }
                            setActiveIndex(e.index);
                            menuRef.current?.hide(e.originalEvent);
                        }}
                        className="lg:h-full h-[58px] min-w-full"
                        style={{ width: 'max-content' }}
                    />
                </div>
            </div>

            {error && !isRetrying ? (
                <LoadingRetry visibleConnectionError={true} onRetry={handleRetry} />
            ) : (
                <div className="relative min-h-screen p-4 mx-auto max-w-4xl bg-white xl:pt-[4.6rem] pt-32 rounded-md">
                    {renderContent()}
                </div>
            )}
            <GuestFooter quickLinks={categories} />
        </div>
    );
};

export default Post;
