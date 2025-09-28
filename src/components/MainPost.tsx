import {useEffect, useState} from "react";
import {Editor} from "primereact/editor";
import {Button} from "primereact/button";
import {BreadCrumb} from "primereact/breadcrumb";
import defaultProfilePicture from "../assets/profilepicture.svg";
import thumbnail from "../assets/thumbnail.svg";
import {Dialog} from "primereact/dialog";
import {truncateText} from "../utils/truncateText.tsx";

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

const MainPost = ({mainPost, handleCategoryChange, isModalVisible, setIsModalVisible}) => {
    const [showUpdatedAt, setShowUpdatedAt] = useState(false);
    useEffect(() => {
        if ((window as any).DISQUS) {
            (window as any).DISQUS.reset({ reload: true,
                config: function () {
                    this.page.identifier = mainPost.id;
                    this.page.url = window.location.href;
                }});
        } else {
            const script = document.createElement("script");
            script.src = `https://${import.meta.env.VITE_DISQUS_SHORTNAME}.disqus.com/embed.js`;
            script.setAttribute("data-timestamp", Date.now().toString());
            script.async = true;
            document.body.appendChild(script);
        }
    }, [mainPost.id]);

    const toggleUpdatedAt = () => {
        setShowUpdatedAt(!showUpdatedAt);
    };
    useEffect(() => {
        if (isModalVisible) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isModalVisible]);
    const toggleModal = () => {

        setIsModalVisible(!isModalVisible);
    };


    return (
        <>
            <main className={`break-all`}>
                <BreadCrumb model={[
                    {
                        label: "Home", template: () => <span
                            className="text-[#475569]  cursor-pointer font-[600]" onClick={() => {
                            handleCategoryChange("")
                        }}
                        > Home</span>
                    },
                    {
                        label: mainPost.category?.name || "Kategori", template: () => <span
                            className="text-[#f59e0b] cursor-pointer font-[600]" onClick={() => {
                            handleCategoryChange(mainPost.category?.name.toLowerCase())
                        }}
                        >{truncateText(mainPost.category?.name || "", 13)} </span>
                    }
                ]}/>

                <h1 className="text-[#475569] font-semibold text-3xl">{mainPost.title}</h1>
                <small className="text-[#475569] mb-2 mt-2">{mainPost.summary}</small>

                <div className="relative">
                    <img
                        src={mainPost?.thumbnail ? apiUri+"/post_picture/"+mainPost?.thumbnail : thumbnail as string}
                        alt={mainPost.title}
                        className="w-full object-cover bg-[#f59e0b]"
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 px-2 rounded-md flex items-center text-xs">
                        <i className="pi pi-eye mr-1"></i>
                        <span>{mainPost.viewCount}</span>
                    </div>
                </div>
                <div className="flex justify-between my-4 flex-row lg:gap-0 ">
                    <div className="flex gap-2 items-center">
                        <img
                            src={mainPost.user?.profilePicture
                                ? `${apiUri}/profile_picture/${mainPost.user.profilePicture}`
                                : defaultProfilePicture as string
                            }
                            className="size-[2.6rem] lg:size-[3rem] rounded-full cursor-pointer"
                            style={{border: "1px solid #d1d5db"}}
                            onClick={toggleModal}
                        />
                        <div>
                            <p className="text-[#475569] text:sm md:text-md font-medium flex items-center gap-1 cursor-pointer w-fit"
                               onClick={toggleModal}>{mainPost.user?.name} {mainPost.user?.role === "admin" && (
                                <i style={{color: 'var(--primary-color)'}} className={`pi pi-verified`}></i>)}</p>
                            <p className="text-[#475569] text-xs md:text-sm flex items-center">Diterbitkan: {mainPost.createdAt}
                                {mainPost.updatedAt && (
                                    <button
                                        className="bg-transparent border-none outline-none cursor-pointer"
                                        onClick={toggleUpdatedAt}
                                    >
                                        <i style={{color: 'var(--primary-color)'}}
                                           className={`pi ${showUpdatedAt ? 'pi-chevron-up' : 'pi-chevron-down'}`}></i>
                                    </button>
                                )}
                            </p>
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showUpdatedAt && mainPost.updatedAt ? 'max-h-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                                {mainPost.updatedAt && (
                                    <p className="text-[#475569] text-xs md:text-sm flex items-center ">
                                        Diperbarui: {mainPost.updatedAt}
                                    </p>
                                )}
                            </div>


                        </div>
                    </div>

                    <div className="flex lg:gap-2 gap-1 w-fit items-center lg:justify">
                        <Button
                            icon="pi pi-twitter"
                            className="p-button-rounded md:size-[40px] size-[30px] p-button-secondary sm:flex hidden"
                            onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, "_blank")}
                        />
                        <Button
                            icon="pi pi-facebook"
                            className="p-button-rounded md:size-[40px] size-[30px] p-button-info sm:flex hidden"
                            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank")}
                        />
                        <Button
                            icon="pi pi-whatsapp"
                            className="p-button-rounded md:size-[40px] size-[30px] p-button-success sm:flex hidden"
                            onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.href)}`, "_blank")}
                        />
                        <Button
                            icon="pi pi-clipboard"
                            className="p-button-rounded md:size-[40px] size-[40px]"
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                            }}
                        />
                    </div>

                </div>

                <div className="w-full my-4 opacity-30" style={{borderTop: "1px solid #8496af"}}></div>

                <Editor key={mainPost.id} className="content-view min-h-0" headerTemplate={<></>} value={mainPost?.content} readOnly/>
                <div className="w-full my-4 opacity-30" style={{borderTop: "1px solid #8496af"}}></div>
                <div id="disqus_thread" className={`mt-8 mb-4`}></div>
            </main>
            <Dialog
                header={
                    <h1 className="font-medium m-0 text-xl">
                        Detail Penulis
                    </h1>
                }
                key={`author-modal-${mainPost.user?.id}`}
                visible={isModalVisible}
                onHide={toggleModal}
                className="w-[80%] md:w-[25%]"
                appendTo={null}
                blockScroll={true}
            >
                <div className="flex flex-col items-center mb-[24px]">
                    <div className="relative w-fit mx-auto flex justify-center items-center">
                        <img
                            src={mainPost.user?.profilePicture
                                ? `${apiUri}/profile_picture/${mainPost.user.profilePicture}`
                                : defaultProfilePicture as string}
                            className="size-[9rem] rounded-full"
                            style={{border: "1px solid #d1d5db"}}
                        />
                    </div>

                    <div className="text-center mt-4">
                        <h3 className="text-lg font-normal">{mainPost.user?.name} {mainPost.user?.role === "admin" && (
                            <i style={{color: 'var(--primary-color)'}} className={`pi pi-verified`}></i>)}</h3>
                        <p className="text-sm text-gray-500">{mainPost.user?.email}</p>
                        <p className="text-sm text-gray-500">{mainPost.user?.phoneNumber}</p>
                    </div>
                </div>
            </Dialog>
        </>

    );
};

export default MainPost;
