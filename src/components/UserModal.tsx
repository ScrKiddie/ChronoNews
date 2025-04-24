import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import defaultProfilePicture from "../assets/profilepicture.svg";
import React, {useEffect, useState} from "react";
import InputGroup from "./InputGroup.tsx";
import SubmitButton from "./SubmitButton.tsx";
import {useSidebar} from "../hooks/useSidebar.tsx";
import {Menu} from "primereact/menu";

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;
const UserModal = ({
                       visible,
                       onClose,
                       data,
                       setData,
                       croppedImage,
                       fileInputRef,
                       errors,
                       submitLoading,
                       handleSubmit,
                       handleClickUploadButton,
                       handleImageChange,
                       isUserCreateMode,
                       isUserEditMode,
                       setProfilePicture,
                       setCroppedImage
                   }) => {
    const roleOptions = [
        {label: "Admin", value: "admin"},
        {label: "Journalist", value: "journalist"},
    ];

    const {
        isMenuVisible,
        setIsMenuVisible,
        toggleMenuVisibility,
        key,
        buttonRef,
        menuContainerRef,
    } = useSidebar();

    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        const items = [];
        items.push({
            label: "Ganti",
            icon: <i className="pi pi-image pr-3" />,
            command() {
                setIsMenuVisible(false);
                handleClickUploadButton();
            },
        });

        if (data?.profilePicture || croppedImage) {
            items.push({
                label: "Hapus",
                icon: <i className="pi pi-trash pr-3" />,
                command() {
                    setIsMenuVisible(false);
                    if(setData){
                        setData(prev => ({...prev, profilePicture: ""}))
                        setData(prev => ({...prev, deleteProfilePicture: true}))
                    }
                    if(setProfilePicture){
                        setProfilePicture("")
                    }
                    if(setCroppedImage){
                        setCroppedImage("")
                    }
                },
            });
        }

        setMenuItems(items);
    }, [data?.profilePicture, croppedImage, handleClickUploadButton]);

    return (
        <Dialog
            closable={!submitLoading}
            header={
                <h1 className="font-medium m-0 text-xl">
                    {isUserCreateMode
                        ? "Buat Pengguna Baru"
                        : isUserEditMode
                            ? "Edit Pengguna"
                            : "Ubah Profil"}
                </h1>
            }
            visible={visible}
            maximizable
            className="w-[94%] md:w-[60%]"
            onHide={onClose}
        >
            <form onSubmit={handleSubmit} className="w-full">
                <div className="flex flex-col p-4 gap-4">
                    <div className="relative w-fit mx-auto flex justify-center items-center">
                        <img
                            src={
                                croppedImage ||
                                (data?.profilePicture
                                    ? `${apiUri}/profile_picture/${data?.profilePicture}`
                                    : `${defaultProfilePicture}`)
                            }
                            className="size-[14rem] rounded-full "
                            style={{border: "1px solid #d1d5db"}}
                        />
                        <Button
                            onClick={
                                toggleMenuVisibility
                            }
                            ref={buttonRef}
                            type="button"
                            className="absolute inset-0 w-full h-full bg-transparent flex items-center justify-center hover:bg-black/20 transition rounded-full"
                        />
                        <div ref={menuContainerRef}>
                            <Menu
                                key={key}
                                className={`${isMenuVisible ? "visible" : "hidden"} normal text-md w-fit shadow-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 menu-news`}
                                model={menuItems}
                            />
                        </div>
                    </div>

                    <input
                        ref={fileInputRef}
                        id="file-upload"
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleImageChange}
                        className="hidden"
                    />

                    <div className="w-full">
                        <div className="w-full">
                            <InputGroup
                                label="Nama"
                                data={data?.name}
                                error={errors.name}
                                setData={(e) => {setData(prev => ({...prev, name: e}))}}
                                setError={(e) => {errors.name = e}}
                            />
                        </div>
                    </div>

                    {(isUserCreateMode || isUserEditMode) && (
                        <div className="w-full">
                            <InputGroup
                                type={"dropdown"}
                                options={roleOptions}
                                label="Role"
                                data={data?.role}
                                error={errors.role}
                                setData={(e)=>{ setData(prev => ({ ...prev, role: e }));}}
                                setError={(e)=>{ errors.role=e;}}
                            />
                        </div>
                    )}
                    <div className="w-full">
                        <InputGroup
                            label="Email"
                            data={data?.email}
                            error={errors.email}
                            setData={(e)=>{ setData(prev => ({ ...prev, email: e }));}}
                            setError={(e)=>{ errors.email = e}}
                        />
                    </div>

                    <div className="w-full">
                        <InputGroup
                            label="Telepon"
                            data={data?.phoneNumber}
                            error={errors.phoneNumber}
                            setData={(e)=>{ setData(prev => ({ ...prev, phoneNumber: e }));}}
                            setError={(e)=>{ errors.phoneNumber = e }}
                        />
                    </div>

                    {(isUserEditMode) && (
                        <div className="w-full">
                            <InputGroup
                                type="password"
                                label="Password"
                                data={data?.password}
                                error={errors.password}
                                setData={(e)=>{ setData(prev => ({ ...prev, password: e }));}}
                                setError={(e)=>{ errors.password = e }}
                                tip={(isUserEditMode) && !errors.password && "Kosongkan jika tidak ingin mengubah password"}
                            />
                        </div>
                    )}
                   <SubmitButton loading={submitLoading}/>
                </div>
            </form>
        </Dialog>
    );
};

export default UserModal;
