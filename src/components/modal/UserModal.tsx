import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import defaultProfilePicture from '../../../public/profilepicture.svg';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import InputGroup from '../ui/InputGroup.tsx';
import SubmitButton from '../ui/SubmitButton.tsx';
import { useSidebar } from '../../hooks/useSidebar.tsx';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { ProfileFormData, UserManagementFormData } from '../../types/user.tsx';

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;

interface UserModalProps<T extends ProfileFormData | UserManagementFormData> {
    visible: boolean;
    onClose: () => void;
    data: Partial<T>;
    setData: Dispatch<SetStateAction<Partial<T>>>;
    croppedImage: string | null;
    fileInputRef: React.RefObject<HTMLInputElement>;
    errors: Record<string, string>;
    submitLoading: boolean;
    handleSubmit: (e?: React.FormEvent) => Promise<void>;
    handleClickUploadButton: () => void;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isUserCreateMode?: boolean;
    isUserEditMode?: boolean;
    setProfilePicture: Dispatch<SetStateAction<File | null>>;
    setCroppedImage: Dispatch<SetStateAction<string | null>>;
}

const UserModal = <T extends ProfileFormData | UserManagementFormData>({
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
    isUserCreateMode = false,
    isUserEditMode = false,
    setProfilePicture,
    setCroppedImage,
}: UserModalProps<T>) => {
    const roleOptions = [
        { label: 'Admin', value: 'admin' },
        { label: 'Journalist', value: 'journalist' },
    ];

    const {
        isMenuVisible,
        setIsMenuVisible,
        toggleMenuVisibility,
        key,
        buttonRef,
        menuContainerRef,
    } = useSidebar();

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    useEffect(() => {
        const items: MenuItem[] = [];
        items.push({
            label: 'Ganti',
            icon: <i className="pi pi-image pr-3" />,
            command() {
                setIsMenuVisible(false);
                handleClickUploadButton();
            },
        });

        if (
            (typeof data?.profilePicture === 'string' && data.profilePicture.trim() !== '') ||
            croppedImage
        ) {
            items.push({
                label: 'Hapus',
                icon: <i className="pi pi-trash pr-3" />,
                command() {
                    setIsMenuVisible(false);
                    setData((prev) => ({
                        ...prev,
                        profilePicture: '',
                        deleteProfilePicture: true,
                    }));
                    setProfilePicture(null);
                    setCroppedImage(null);
                },
            });
        }

        setMenuItems(items);
    }, [
        data?.profilePicture,
        croppedImage,
        handleClickUploadButton,
        setData,
        setProfilePicture,
        setCroppedImage,
        setIsMenuVisible,
        isUserCreateMode,
        isUserEditMode,
    ]);

    return (
        <Dialog
            closable={!submitLoading}
            header={
                <h1 className="font-medium m-0 text-xl">
                    {isUserCreateMode
                        ? 'Buat Pengguna Baru'
                        : isUserEditMode
                          ? 'Edit Pengguna'
                          : 'Ubah Profil'}
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
                                (typeof data?.profilePicture === 'string' &&
                                data.profilePicture.trim() !== ''
                                    ? `${apiUri}/profile_picture/${data?.profilePicture}`
                                    : `${defaultProfilePicture}`)
                            }
                            className="size-[14rem] rounded-full"
                            style={{ border: '1px solid #d1d5db' }}
                            alt="Profile"
                        />
                        <Button
                            onClick={toggleMenuVisibility}
                            ref={buttonRef}
                            type="button"
                            className="absolute inset-0 w-full h-full bg-transparent flex items-center justify-center hover:bg-black/20 transition rounded-full"
                        />
                        <div ref={menuContainerRef}>
                            <Menu
                                key={key}
                                className={`${
                                    isMenuVisible ? 'visible' : 'hidden'
                                } normal text-md w-fit shadow-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 menu-news`}
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
                        <InputGroup
                            label="Nama"
                            data={data.name || ''}
                            error={errors.name}
                            setData={(e: string) =>
                                setData((prev) => ({
                                    ...prev,
                                    name: e,
                                }))
                            }
                            setError={(e: string) => {
                                errors.name = e;
                            }}
                        />
                    </div>

                    {(isUserCreateMode || isUserEditMode) && (
                        <div className="w-full">
                            <InputGroup
                                type="dropdown"
                                options={roleOptions}
                                label="Role"
                                data={(data as Partial<UserManagementFormData>).role || ''}
                                error={errors.role}
                                setData={(e: string) =>
                                    setData((prev) => ({
                                        ...prev,
                                        role: e,
                                    }))
                                }
                                setError={(e: string) => {
                                    errors.role = e;
                                }}
                            />
                        </div>
                    )}

                    <div className="w-full">
                        <InputGroup
                            label="Email"
                            data={data.email || ''}
                            error={errors.email}
                            setData={(e: string) =>
                                setData((prev) => ({
                                    ...prev,
                                    email: e,
                                }))
                            }
                            setError={(e: string) => {
                                errors.email = e;
                            }}
                        />
                    </div>

                    <div className="w-full">
                        <InputGroup
                            label="Telepon"
                            data={data.phoneNumber || ''}
                            error={errors.phoneNumber}
                            setData={(e: string) =>
                                setData((prev) => ({
                                    ...prev,
                                    phoneNumber: e,
                                }))
                            }
                            setError={(e: string) => {
                                errors.phoneNumber = e;
                            }}
                        />
                    </div>

                    {isUserEditMode && (
                        <div className="w-full">
                            <InputGroup
                                type="password"
                                label="Password"
                                data={(data as Partial<UserManagementFormData>).password || ''}
                                error={errors.password}
                                setData={(e: string) =>
                                    setData((prev) => ({
                                        ...prev,
                                        password: e,
                                    }))
                                }
                                setError={(e: string) => {
                                    errors.password = e;
                                }}
                                tip={
                                    !errors.password
                                        ? 'Kosongkan jika tidak ingin mengubah password'
                                        : ''
                                }
                            />
                        </div>
                    )}

                    <SubmitButton loading={submitLoading} />
                </div>
            </form>
        </Dialog>
    );
};

export default UserModal;
