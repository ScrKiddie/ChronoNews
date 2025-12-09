import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { BreadCrumb, BreadCrumbProps } from 'primereact/breadcrumb';
import defaultProfilePicture from '../../assets/profilepicture.svg';
import thumbnail from '../../assets/thumbnail.svg';
import { truncateText } from '../../lib/utils/truncateText.tsx';
import { Post } from '../../types/post.tsx';
import MainPostSkeleton from '../ui/MainPostSkeleton.tsx';

import DOMPurify from 'isomorphic-dompurify';

import 'quill/dist/quill.snow.css';

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;
const BASE_URL = import.meta.env.VITE_BASE_URL;

interface MainPostProps {
    mainPost: Post | null;
    handleCategoryChange: (category: string) => void;
}

const MainPost: React.FC<MainPostProps> = ({ mainPost, handleCategoryChange }) => {
    const [showUpdatedAt, setShowUpdatedAt] = useState(false);

    useEffect(() => {
        if (!mainPost?.id) return;

        if (window.DISQUS) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window.DISQUS as any).reset({
                reload: true,
                config: function () {
                    this.page.identifier = mainPost.id!.toString();
                    this.page.url = window.location.href;
                },
            });
        } else {
            const script = document.createElement('script');
            script.src = `https://${import.meta.env.VITE_DISQUS_SHORTNAME}.disqus.com/embed.js`;
            script.setAttribute('data-timestamp', Date.now().toString());
            script.async = true;
            document.body.appendChild(script);
        }
    }, [mainPost?.id]);

    useEffect(() => {
        if (!mainPost) return;

        const updateClientSideHead = () => {
            document.title = `${mainPost.title} - ${mainPost.category?.name || 'Berita'} | ChronoNews`;

            let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.name = 'description';
                document.head.appendChild(metaDesc);
            }
            metaDesc.content = mainPost.summary;

            let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
            if (!canonicalLink) {
                canonicalLink = document.createElement('link');
                canonicalLink.rel = 'canonical';
                document.head.appendChild(canonicalLink);
            }
            canonicalLink.href = `${BASE_URL}/post/${mainPost.id}`;
        };

        updateClientSideHead();
    }, [mainPost]);

    const toggleUpdatedAt = () => {
        setShowUpdatedAt(!showUpdatedAt);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: mainPost?.title || document.title,
                    text: mainPost?.summary || '',
                    url: window.location.href,
                });
            } catch (error) {
                void error;
                await navigator.clipboard.writeText(window.location.href);
            }
        } else {
            await navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (!mainPost) {
        return <MainPostSkeleton />;
    }

    const breadcrumbItems: BreadCrumbProps['model'] = [
        {
            label: 'Beranda',
            template: () => (
                <span
                    className="text-[#475569]  cursor-pointer font-[600]"
                    onClick={() => {
                        handleCategoryChange('beranda');
                    }}
                >
                    {' '}
                    Beranda
                </span>
            ),
        },
        {
            label: mainPost.category?.name || 'Kategori',
            template: () => (
                <span
                    className="text-[#f59e0b] cursor-pointer font-[600]"
                    onClick={() => {
                        if (mainPost.category?.name) {
                            handleCategoryChange(mainPost.category.name.toLowerCase());
                        }
                    }}
                >
                    {truncateText(mainPost.category?.name || '', 13)}{' '}
                </span>
            ),
        },
    ];

    const sanitizedContent = DOMPurify.sanitize(mainPost?.content || '');

    return (
        <>
            <main className={`break-all`}>
                <BreadCrumb model={breadcrumbItems} />

                <h1 className="text-[#475569] font-semibold text-3xl">{mainPost.title}</h1>
                <small className="text-[#475569] mb-2 mt-2">{mainPost.summary}</small>

                <div className="relative w-full h-0 pb-[56.25%] bg-[#f59e0b] overflow-hidden">
                    <img
                        src={
                            mainPost?.thumbnail
                                ? apiUri + '/post_picture/' + mainPost?.thumbnail
                                : (thumbnail as string)
                        }
                        alt={mainPost.title || 'Post Thumbnail'}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 px-2 rounded-md flex items-center text-xs z-10">
                        <i className="pi pi-eye mr-1"></i>
                        <span>{mainPost.viewCount}</span>
                    </div>
                </div>
                <div className="flex justify-between my-4 flex-row lg:gap-0 ">
                    <div className="flex gap-2 items-center">
                        <img
                            src={
                                mainPost.user?.profilePicture
                                    ? `${apiUri}/profile_picture/${mainPost.user.profilePicture}`
                                    : (defaultProfilePicture as string)
                            }
                            className="size-[2.6rem] lg:size-[3rem] rounded-full"
                            style={{ border: '1px solid #d1d5db' }}
                            alt={mainPost.user?.name || 'Author Profile Picture'}
                        />
                        <div>
                            <p className="text-[#475569] text:sm md:text-md font-medium flex items-center gap-1 w-fit">
                                {mainPost.user?.name}
                            </p>
                            <p className="text-[#475569] text-xs md:text-sm flex items-center">
                                Diterbitkan: {mainPost.createdAt}
                                {mainPost.updatedAt && (
                                    <button
                                        className="bg-transparent border-none outline-none cursor-pointer"
                                        onClick={toggleUpdatedAt}
                                    >
                                        <i
                                            style={{ color: 'var(--primary-color)' }}
                                            className={`pi ${showUpdatedAt ? 'pi-chevron-up' : 'pi-chevron-down'}`}
                                        ></i>
                                    </button>
                                )}
                            </p>
                            <div
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${showUpdatedAt && mainPost.updatedAt ? 'max-h-8 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                {mainPost.updatedAt && (
                                    <p className="text-[#475569] text-xs md:text-sm flex items-center ">
                                        Diperbarui: {mainPost.updatedAt}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex ml-2 lg:gap-2 gap-1 w-fit items-center lg:justify">
                        <Button
                            icon="pi pi-share-alt"
                            className="p-button-rounded md:size-[40px] size-[40px]"
                            onClick={handleShare}
                        />
                    </div>
                </div>

                <div
                    className="w-full my-4 opacity-30"
                    style={{ borderTop: '1px solid #8496af' }}
                ></div>

                <div className="ql-snow">
                    <div
                        className="ql-editor content-view min-h-0 !p-0"
                        contentEditable={false}
                        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                    />
                </div>

                <div
                    className="w-full my-4 opacity-30"
                    style={{ borderTop: '1px solid #8496af' }}
                ></div>
                <div id="disqus_thread" className={`mt-8 mb-4`}></div>
            </main>
        </>
    );
};

export default MainPost;
