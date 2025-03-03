import React from "react";
import { Editor } from "primereact/editor";
import { Button } from "primereact/button";
import { BreadCrumb } from "primereact/breadcrumb";
import defaultProfilePicture from "../../public/profilepicture.svg";
import thumbnail from "../../public/thumbnail.svg";

interface MainPostProps {
    post: any;
}

const MainPost: React.FC<MainPostProps> = ({ post }) => {
    return (
        <main>
            {/* Breadcrumb */}
            <BreadCrumb model={[
                { label: 'Post', url: '/' },
                { label: post.category?.name || "Kategori", template: () => <span className="text-[#f59e0b]">{post.category?.name}</span> }
            ]} />

            <h1 className="text-[#475569] font-semibold text-3xl">{post.title}</h1>
            <small className="text-[#475569] mb-2 mt-2">{post.summary}</small>

            {/* Gambar utama */}
            <img
                src={post.thumbnail ? `http://localhost:3000/post_picture/${post.thumbnail}` : thumbnail}
                alt={post.title}
                className="w-full object-cover bg-[#f59e0b]"
            />

            {/* Informasi Penulis */}
            <div className="flex justify-between mb-4 mt-2 flex-row lg:gap-0 ">
                <div className="flex gap-2 items-center">
                    <img
                        src={post.user?.profilePicture
                            ? `http://localhost:3000/profile_picture/${post.user.profilePicture}`
                            : defaultProfilePicture
                        }
                        className="size-[2.5rem] lg:size-[3rem] rounded-full"
                        style={{border: "1px solid #d1d5db"}}
                    />
                    <div>
                        <p className="text-[#475569] text:sm md:text-md font-medium">{post.user?.name}</p>
                        <p className="text-[#475569] text-xs md:text-sm">Diterbitkan: {post.publishedDate}</p>
                    </div>
                </div>

                {/* Tombol share */}
                <div className="flex lg:gap-2 gap-1 w-fit items-center lg:justify ">
                    <Button
                        icon="pi pi-twitter"
                        className="p-button-rounded md:size-[40px] size-[30px]  p-button-secondary sm:flex hidden"
                        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`, "_blank")}
                    />
                    <Button
                        icon="pi pi-facebook"
                        className="p-button-rounded md:size-[40px] size-[30px] p-button-info sm:flex hidden"
                        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(post.title)}`, "_blank")}
                    />
                    <Button
                        icon="pi pi-whatsapp"
                        className="p-button-rounded md:size-[40px] size-[30px] p-button-success sm:flex hidden "
                        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(post.title)}`, "_blank")}
                    />
                    <Button
                        icon="pi pi-instagram"
                        className="p-button-rounded md:size-[40px] size-[30px] p-button-danger sm:flex hidden"
                        onClick={() => window.open(`https://www.instagram.com/`, "_blank")}
                    />
                    <Button
                        icon="pi pi-clipboard"
                        className="p-button-rounded md:size-[40px] size-[40px] "
                        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`, "_blank")}
                    />
                </div>
            </div>

            <div className="w-full my-4 opacity-30" style={{borderTop: "1px solid #8496af"}}></div>

            {/* Konten Post */}
            <Editor className="content-view" headerTemplate={<></>} value={post.content} readOnly/>

            <div className="w-full my-4 opacity-30" style={{borderTop: "1px solid #8496af"}}></div>
        </main>
    );
};

export default MainPost;
