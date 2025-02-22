import {Sidebar, Menu} from "react-pro-sidebar";
import chronoverseLogo from "../../public/chronoverse.svg";
import React from "react";
import MenuItemResponsive from "./MenuItemResponsive.tsx";
import {Button} from "primereact/button";
import {Menu as PrimeMenu} from "primereact/menu";
import {Toast} from "primereact/toast";
import "cropperjs/dist/cropper.css";
import CropImageModal from "./CropImageModal.tsx";
import UserModal from "./UserModal.tsx";
import LoadingModal from "./LoadingModal.tsx";
import {useSidebar} from "../hooks/useSidebar.tsx";
import {useProfile} from "../hooks/useProfile.tsx";
import LogoutModal from "./LogoutModal.tsx";
import {usePassword} from "../hooks/usePassword.tsx";
import PasswordModal from "./PasswordModal.tsx";
import {useToast} from "../hooks/useToast.tsx";

const SidebarResponsive = ({children}) => {

    const toastRef = useToast();
    const {
        collapsed,
        toggled,
        isMenuVisible,
        buttonRef,
        menuContainerRef,
        handleSidebarToggle,
        toggleMenuVisibility,
        setIsMenuVisible,
        key,
        setCollapsed,
        setToggled,
        onLogout,
        setIsModalLogoutVisible,
        isModalLogoutVisible,
    } = useSidebar();

    const {
        modalLoading,
        visibleModal: visibleProfileModal,
        submitLoading: submitProfileLoading,
        data: dataProfile,
        setData: setDataProfile,
        errors: profileErrors,
        handleVisibleModal: handleVisibleProfileModal,
        handleCloseModal: handleCloseProfileModal,
        handleSubmit,
        croppedImage,
        fileInputRef,
        handleClickUploadButton,
        handleImageChange,
        visibleCropImageModal,
        handleCloseCropImageModal,
        selectedImage,
        handleCrop,
        cropperRef,
        imageRef
    } = useProfile(toastRef);

    const {
            submitLoading: submitPasswordLoading,
            errors: passwordErrors,
            data: passwordData,
            handleVisibleModal: handleVisiblePasswordModal,
            handleCloseModal: handleClosePasswordModal,
            handleSubmit: handlePasswordSubmit,
            setData: setPasswordData,
        visibleModal: visiblePasswordModal
    } = usePassword(toastRef);

    return (
        <div className="flex h-screen w-full">
            <Sidebar
                className="md:w-1/4 md:block text-white border-r-white"
                backgroundColor={`#475569`}
                breakPoint={"md"}
                toggled={toggled}
                onBackdropClick={handleSidebarToggle}
                collapsed={collapsed}
            >
                <Menu
                    menuItemStyles={{
                        button: {
                            ["&:hover"]: {
                                backgroundColor: "#d97706",

                            },

                        },
                    }}
                    className={` ${collapsed ? "" : "px-3"}`}
                >
                    <Menu>
                        <div className="flex flex-col font-semibold text-lg items-center mt-0.5 justify-center">
                            <img
                                src={chronoverseLogo}
                                alt="LOGO ChronoVerse"
                                className={`${collapsed ? "hidden" : "block"} w-auto px-2 max-h-[80px] mt-3 mb-3`}
                            />
                            <img
                                src={chronoverseLogo}
                                alt="LOGO ChronoVerse"
                                className={`${collapsed ? "block my-1" : "hidden"} w-auto px-1 max-h-14`}
                            />
                            <div
                                className={`border-t-2 h-[2px] ${collapsed ? "mb-2" : "mb-3"} border-[#40916c] ${collapsed ? "w-[80%]" : "w-full"}`}></div>
                        </div>
                    </Menu>

                    <MenuItemResponsive collapsed={collapsed} icon={`pi pi-qrcode`} label={"Beranda"}
                                        link={"/admin/beranda"}/>
                    <MenuItemResponsive collapsed={collapsed} icon={`pi pi-users
                    `} label={"Jurnalis"} link={"/admin/jurnalis"}/>
                    <MenuItemResponsive collapsed={collapsed} icon={`pi pi-list
                    `} label={"Kategori"} link={"/admin/kategori"}/>

                </Menu>
            </Sidebar>

            <nav className="flex flex-col w-full overflow-hidden">
                <div className="flex items-center px-4 w-full z-40 shadow-md bg-white text-black">
                    <div className="flex py-[17px] w-full items-center gap-4 justify-between">
                        <Button severity="secondary" onClick={() => setCollapsed(!collapsed)} text rounded
                                className={`size-8 hidden md:flex`}
                                icon={<i className={`pi ${collapsed ? "pi-arrow-right" : "pi-arrow-left"} text-md`}/>}/>
                        <Button severity="secondary" onClick={() => setToggled(!toggled)} text rounded
                                className={`size-8 flex md:hidden`}
                                icon={<i className={`pi pi-arrow-right text-md`}/>}/>
                        <Button ref={buttonRef} severity="secondary" onClick={toggleMenuVisibility} text rounded
                                className={`size-8`} icon={<i className={`pi pi-bars text-md`}/>}/>
                        <div ref={menuContainerRef} className={`absolute top-0 right-0`}>
                            <PrimeMenu
                                key={key}
                                className={`${isMenuVisible ? "visible" : "hidden"} text-md shadow-md absolute top-[70px] right-1`}
                                model={[
                                    {
                                        label: "Profile",
                                        icon: <i className="pi pi-user pr-3"/>,
                                        command() {
                                            setIsMenuVisible(false);
                                            handleVisibleProfileModal();
                                        }
                                    },
                                    {
                                        label: "Password",
                                        icon: <i className="pi pi-key pr-3"/>,
                                        command() {
                                            setIsMenuVisible(false);
                                            handleVisiblePasswordModal();
                                        }

                                    },
                                    {label: "Keluar", icon: <i className="pi pi-sign-out pr-3"/>,
                                    command() {
                                        setIsMenuVisible(false);
                                        setIsModalLogoutVisible(true);
                                    }
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex-grow bg-[#f2f2f2] overflow-y-scroll w-full overflow-x-auto ">
                    {children}
                    <footer
                        className=" border-t-[1px] flex flex-col gap-4 bg-white border-[#aeb0b5] py-2 md:pr-2 md:text-end text-sm pr-0 text-center">
                        <h1 className="font-normal text-xs">
                            &copy; {new Date().getFullYear()} ChronoVerse. All rights reserved.
                        </h1>
                    </footer>
                </div>

            </nav>

            {/*toast ini*/}
            <Toast ref={toastRef} position="top-center"/>

            {/*modal update profile*/}
            <UserModal
                isProfileMode={true}
                visible={visibleProfileModal}
                onClose={handleCloseProfileModal}
                data={dataProfile}
                croppedImage={croppedImage}
                fileInputRef={fileInputRef}
                errors={profileErrors}
                submitLoading={submitProfileLoading}
                handleSubmit={handleSubmit}
                handleClickUploadButton={handleClickUploadButton}
                handleImageChange={handleImageChange}
                setData={setDataProfile}
            />

            {/*modal loading*/}
            <LoadingModal
                modalLoading={modalLoading}
            />

            {/*modal cropper*/}
            <CropImageModal
                id={"user-cropper"}
                visible={visibleCropImageModal}
                onClose={handleCloseCropImageModal}
                selectedImage={selectedImage}
                onCrop={handleCrop}
                cropperRef={cropperRef}
                imageRef={imageRef}
            />

            {/* Modal Update Password */}
            <PasswordModal
                visible={visiblePasswordModal}
                onClose={handleClosePasswordModal}
                data={passwordData}
                errors={passwordErrors}
                submitLoading={submitPasswordLoading}
                handleSubmit={handlePasswordSubmit}
                setData={setPasswordData}
            />

            {/*modal logout*/}
            <LogoutModal visible={isModalLogoutVisible} setVisible={setIsModalLogoutVisible} onLogout={onLogout}/>
        </div>
    );
}
export default SidebarResponsive;