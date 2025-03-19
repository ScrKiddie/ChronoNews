import React, {useState} from "react";
import {Editor} from "primereact/editor";
import {Button} from "primereact/button";
import {BreadCrumb} from "primereact/breadcrumb";
import defaultProfilePicture from "../../public/profilepicture.svg";
import thumbnail from "../../public/thumbnail.svg";
import {Dialog} from "primereact/dialog";

const apiUri = import.meta.env.VITE_CHRONOVERSE_API_URI;

const MainPost = ({post, handleCategoryChange}) => {
    const [showLastUpdated, setShowLastUpdated] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const toggleLastUpdated = () => {
        setShowLastUpdated(!showLastUpdated);
    };
    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    return (
        <>
            <main>
                {/* Breadcrumb */}
                <BreadCrumb model={[
                    {
                        label: "Home", template: () => <span
                            className="text-[#475569] cursor-pointer font-medium" onClick={() => {
                            handleCategoryChange("")
                        }}
                        > Home</span>
                    },
                    {
                        label: post.category?.name || "Kategori", template: () => <span
                            className="text-[#f59e0b] cursor-pointer font-medium" onClick={() => {
                            handleCategoryChange(post.category?.name)
                        }}
                        > {post.category?.name}</span>
                    }
                ]}/>

                <h1 className="text-[#475569] font-semibold text-3xl">{post.title}</h1>
                <small className="text-[#475569] mb-2 mt-2">{post.summary}</small>

                <img
                    src={post.thumbnail ? `${apiUri}/post_picture/${post.thumbnail}` : thumbnail}
                    alt={post.title}
                    className="w-full object-cover bg-[#f59e0b]"
                />

                <div className="flex justify-between mb-4 mt-2 flex-row lg:gap-0 ">
                    <div className="flex gap-2 items-center">
                        <img
                            src={post.user?.profilePicture
                                ? `${apiUri}/profile_picture/${post.user.profilePicture}`
                                : defaultProfilePicture
                            }
                            className="size-[2.6rem] lg:size-[3rem] rounded-full cursor-pointer"
                            style={{border: "1px solid #d1d5db"}}
                            onClick={toggleModal}
                        />
                        <div>
                            <p className="text-[#475569] text:sm md:text-md font-medium flex items-center gap-1 cursor-pointer w-fit"
                               onClick={toggleModal}>{post.user?.name} {post.user?.role === "admin" && (
                                <i style={{color: 'var(--primary-color)'}} className={`pi pi-verified`}></i>)}</p>
                            <p className="text-[#475569] text-xs md:text-sm flex items-center">Diterbitkan: {post.publishedDate}
                                {post.lastUpdated && (
                                    <button
                                        className="bg-transparent border-none outline-none cursor-pointer"
                                        onClick={toggleLastUpdated}
                                    >
                                        <i style={{color: 'var(--primary-color)'}}
                                           className={`pi ${showLastUpdated ? 'pi-chevron-up' : 'pi-chevron-down'}`}></i>
                                    </button>
                                )}
                            </p>
                            {showLastUpdated && post.lastUpdated && (
                                <p className="text-[#475569] text-xs md:text-sm flex items-center ">Diperbarui: {post.lastUpdated}</p>
                            )}

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

                <Editor key={post.id} className="content-view" headerTemplate={<></>} value={post.content} readOnly/>

                <div className="w-full my-4 opacity-30" style={{borderTop: "1px solid #8496af"}}></div>

            </main>
            <Dialog
                header={
                    <h1 className="font-medium m-0 text-xl">
                        Detail Penulis
                    </h1>
                }
                key={`author-modal-${post.user?.id}`}
                visible={isModalVisible}
                onHide={toggleModal}
                className="w-[80%] md:w-[25%]"
                appendTo={null}
                blockScroll={true}
            >
                <div className="flex flex-col items-center mb-[24px]">
                    <div className="relative w-fit mx-auto flex justify-center items-center">
                        <img
                            src={post.user?.profilePicture
                                ? `${apiUri}/profile_picture/${post.user.profilePicture}`
                                : defaultProfilePicture}
                            className="size-[9rem] rounded-full"
                            style={{border: "1px solid #d1d5db"}}
                        />
                    </div>

                    <div className="text-center mt-4">
                        <h3 className="text-lg font-normal">{post.user?.name} {post.user?.role === "admin" && (
                            <i style={{color: 'var(--primary-color)'}} className={`pi pi-verified`}></i>)}</h3>
                        <p className="text-sm text-gray-500">{post.user?.email}</p>
                        <p className="text-sm text-gray-500">{post.user?.phoneNumber}</p>
                    </div>
                </div>
            </Dialog>
        </>

    );
};

export default MainPost;
