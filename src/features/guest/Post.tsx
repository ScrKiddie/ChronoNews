import React from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';
import ChronoNewsLogo from '../../../public/chrononews.svg';
import GuestFooter from '../../components/layout/GuestFooter.tsx';
import usePost from '../../hooks/usePost.tsx';
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
        dropdownRef,
        allCategories,
        moreCategories,
        handleCategoryChange,
        isSearchPage,
        isPostPage,
        topPostRange,
        setTopPostRange,
        headlinePostPage,
        setHeadlinePostPage,
        headlinePostPagination,
        topPostPage,
        setTopPostPage,
        topPostPagination,
        regularPostPage,
        setRegularPostPage,
        regularPostPagination,
        searchPostPage,
        setSearchPostPage,
        searchPostPagination,
        sizes,
    } = usePost();

    const navigate = useNavigate();

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

    const renderContent = () => {
        if (isSearchPage) {
            return (
                <div className="relative min-h-[80vh]">
                    {!loading && searchPosts && searchPosts.length > 0 && (
                        <h3 className="text-[#4b5569] text-xl mb-3">Hasil Pencarian</h3>
                    )}
                    {loading ? (
                        <>
                            <h3 className="text-[#4b5563] mb-4 text-xl">
                                <Skeleton width="10rem" />
                            </h3>
                            <RegularPost
                                loading={true}
                                post={null}
                                postPage={searchPostPage}
                                setPostPage={setSearchPostPage}
                                postSize={sizes.search}
                                postPagination={searchPostPagination}
                                handleCategoryChange={handleCategoryChange}
                            />
                        </>
                    ) : !searchPosts || searchPosts.length === 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <EmptyData message="Tidak ada hasil yang ditemukan untuk kata kunci Anda. Coba cari dengan kata kunci lain." />
                        </div>
                    ) : (
                        <RegularPost
                            loading={false}
                            post={searchPosts}
                            postPage={searchPostPage}
                            setPostPage={setSearchPostPage}
                            postSize={sizes.search}
                            postPagination={searchPostPagination}
                            handleCategoryChange={handleCategoryChange}
                        />
                    )}
                </div>
            );
        }

        if (isPostPage) {
            return (
                <>
                    <MainPost
                        mainPost={mainPost || null}
                        handleCategoryChange={handleCategoryChange}
                    />
                    <h3 className="text-[#4b5563] my-4 text-xl">
                        {loading ? <Skeleton width="10rem" /> : 'Berita Lainnya'}
                    </h3>
                    {loading ? (
                        <RegularPost
                            loading={true}
                            post={null}
                            postPage={regularPostPage}
                            setPostPage={setRegularPostPage}
                            postSize={sizes.regular}
                            postPagination={regularPostPagination}
                            handleCategoryChange={handleCategoryChange}
                            classKu="mt-4"
                        />
                    ) : hasNoRegularPosts ? (
                        <MiniEmptyData message="Belum ada berita lainnya di kategori ini." />
                    ) : (
                        <RegularPost
                            loading={false}
                            post={posts}
                            postPage={regularPostPage}
                            setPostPage={setRegularPostPage}
                            postSize={sizes.regular}
                            postPagination={regularPostPagination}
                            handleCategoryChange={handleCategoryChange}
                            classKu="mt-4"
                        />
                    )}
                </>
            );
        }

        if (!loading && isCompletelyEmpty) {
            return (
                <div className="relative min-h-[80vh] flex items-center justify-center">
                    <EmptyData message="Belum ada berita untuk ditampilkan." />
                </div>
            );
        }

        return (
            <>
                {/* Berita Terkini */}
                <h3 className="text-[#4b5563] mb-3 text-xl">
                    {loading ? <Skeleton width="10rem" /> : 'Berita Terkini'}
                </h3>
                {loading ? (
                    <HeadlinePost
                        loading={true}
                        headlinePost={null}
                        headlinePostPage={headlinePostPage}
                        setHeadlinePostPage={setHeadlinePostPage}
                        headlinePostPagination={headlinePostPagination}
                        headlineSize={sizes.headline}
                        handleCategoryChange={handleCategoryChange}
                    />
                ) : hasNoHeadline ? (
                    <MiniEmptyData message="Tidak ada berita terkini untuk ditampilkan." />
                ) : (
                    <HeadlinePost
                        loading={false}
                        headlinePost={headlinePost}
                        headlinePostPage={headlinePostPage}
                        setHeadlinePostPage={setHeadlinePostPage}
                        headlinePostPagination={headlinePostPagination}
                        headlineSize={sizes.headline}
                        handleCategoryChange={handleCategoryChange}
                    />
                )}

                {/* Berita Populer */}
                <div className="w-full flex md:items-center justify-between mt-4 md:flex-row flex-col text-start">
                    <h3 className="text-[#4b5569] mb-2 md:mb-0 text-xl">
                        {loading ? <Skeleton width="10rem" /> : 'Berita Populer'}
                    </h3>
                    {loading ? (
                        <Skeleton className={`md:w-[200px]`} height="2.5rem" />
                    ) : (
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
                    )}
                </div>
                {loading ? (
                    <TopPost
                        loading={true}
                        topPost={null}
                        topPostPage={topPostPage}
                        setTopPostPage={setTopPostPage}
                        topPostSize={sizes.top}
                        topPostPagination={topPostPagination}
                        handleCategoryChange={handleCategoryChange}
                    />
                ) : hasNoTopPosts ? (
                    <MiniEmptyData message="Tidak ada berita populer untuk ditampilkan." />
                ) : (
                    <TopPost
                        loading={false}
                        topPost={topPosts}
                        topPostPage={topPostPage}
                        setTopPostPage={setTopPostPage}
                        topPostSize={sizes.top}
                        topPostPagination={topPostPagination}
                        handleCategoryChange={handleCategoryChange}
                    />
                )}

                {/* Berita Lainnya */}
                <h3 className="text-[#4b5569] text-xl my-3">
                    {loading ? <Skeleton width="10rem" /> : 'Berita Lainnya'}
                </h3>
                {loading ? (
                    <RegularPost
                        loading={true}
                        post={null}
                        postPage={regularPostPage}
                        setPostPage={setRegularPostPage}
                        postSize={sizes.regular}
                        postPagination={regularPostPagination}
                        handleCategoryChange={handleCategoryChange}
                    />
                ) : hasNoRegularPosts ? (
                    <MiniEmptyData message="Tidak ada berita lainnya untuk ditampilkan." />
                ) : (
                    <RegularPost
                        loading={false}
                        post={posts}
                        postPage={regularPostPage}
                        setPostPage={setRegularPostPage}
                        postSize={sizes.regular}
                        postPagination={regularPostPagination}
                        handleCategoryChange={handleCategoryChange}
                    />
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
                            <img
                                src={String(ChronoNewsLogo)}
                                className="xl:w-8 w-11"
                                alt="ChronoNewsLogo"
                            />
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

            <div className="relative min-h-screen p-4 mx-auto max-w-4xl bg-white xl:pt-[4.6rem] pt-32 rounded-md">
                {error ? (
                    <LoadingRetry
                        visibleConnectionError={true}
                        onRetry={() => window.location.reload()}
                    />
                ) : (
                    renderContent()
                )}
            </div>
            <GuestFooter
                quickLinks={(categories || []).map((cat) => ({
                    ...cat,
                    id: String(cat.id),
                }))}
            />
        </div>
    );
};

export default Post;
