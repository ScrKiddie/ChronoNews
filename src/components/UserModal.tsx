import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import defaultProfilePicture from "../../public/profilepicture.svg";
import React from "react";
import InputGroup from "./InputGroup.tsx";
import SubmitButton from "./SubmitButton.tsx";

const apiUri = import.meta.env.VITE_CHRONOVERSE_API_URI;
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
                   }) => {
    const roleOptions = [
        {label: "Admin", value: "admin"},
        {label: "Journalist", value: "journalist"},
    ];
    return (
        <Dialog
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
                            onClick={handleClickUploadButton}
                            type="button"
                            className="absolute inset-0 w-full h-full bg-transparent flex items-center justify-center hover:bg-black/20 transition rounded-full"
                        />
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
