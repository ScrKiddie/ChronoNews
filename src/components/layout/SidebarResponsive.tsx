import { Sidebar, Menu } from 'react-pro-sidebar';
import ChronoNewsLogo from '../../../public/chrononews.svg';
import { useEffect, useRef, ReactNode } from 'react';
import MenuItemResponsive from '../ui/MenuItemResponsive.tsx';
import { Button } from 'primereact/button';
import { Menu as PrimeMenu } from 'primereact/menu';
import 'cropperjs/dist/cropper.css';
import CropImageModal from '../modal/CropImageModal.tsx';
import UserModal from '../modal/UserModal.tsx';
import LoadingModal from '../modal/LoadingModal.tsx';
import { useSidebar } from '../../hooks/useSidebar.tsx';
import LogoutModal from '../modal/LogoutModal.tsx';
import { usePassword } from '../../hooks/usePassword.tsx';
import PasswordModal from '../modal/PasswordModal.tsx';
import { useToast } from '../../hooks/useToast.tsx';
import { useAuth } from '../../hooks/useAuth.tsx';
import { useLocation } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile.tsx';

interface SidebarResponsiveProps {
    children: ReactNode;
}

const SidebarResponsive = ({ children }: SidebarResponsiveProps) => {
    const { role } = useAuth();
    const toastRef = useToast();
    const {
        collapsed,
        toggled,
        isMenuVisible,
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
        lastPath,
    } = useSidebar();

    const {
        modalState: profileModalState,
        formData: profileFormData,
        setFormData: setProfileFormData,
        errors: profileErrors,
        openModal: openProfileModal,
        closeModal: closeProfileModal,
        handleSubmit: handleProfileSubmit,
        cropperProps: profileCropperProps,
    } = useProfile(toastRef);

    const {
        submitLoading: submitPasswordLoading,
        errors: passwordErrors,
        data: passwordData,
        handleVisibleModal: handleVisiblePasswordModal,
        handleCloseModal: handleClosePasswordModal,
        handleSubmit: handlePasswordSubmit,
        setData: setPasswordData,
        visibleModal: visiblePasswordModal,
    } = usePassword(toastRef);

    const scrollRef = useRef<HTMLDivElement>(null);

    const { pathname } = useLocation();
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [pathname]);

    return (
        <div className="flex h-screen w-full">
            <Sidebar
                className="md:w-1/4 md:block text-white border-r-white"
                backgroundColor={`#475569`}
                breakPoint={'md'}
                toggled={toggled}
                onBackdropClick={handleSidebarToggle}
                collapsed={collapsed}
            >
                <Menu
                    menuItemStyles={{
                        button: {
                            ['&:hover']: {
                                backgroundColor: '#d97706',
                            },
                        },
                    }}
                    className={` ${collapsed ? '' : 'px-3'}`}
                >
                    <Menu>
                        <div className="flex flex-col font-semibold text-lg items-center mt-0.5 justify-center">
                            <img
                                src={ChronoNewsLogo as string}
                                alt="ChronoNewsLogo"
                                className={`w-auto px-2 ${collapsed ? 'max-h-14 mt-1 mb-3' : 'max-h-[70px] mt-3 '}`}
                            />
                            <h1
                                className={`mt-2 mb-4 font-extrabold text-xl ${collapsed ? 'hidden' : 'block'}`}
                                style={{ color: 'var(--surface-0)' }}
                            >
                                CHRONO
                                <span style={{ color: 'var(--primary-500)' }}>NEWS</span>
                            </h1>
                        </div>
                    </Menu>

                    <MenuItemResponsive
                        collapsed={collapsed}
                        icon={`pi pi-th-large`}
                        label={'Beranda'}
                        link={'/admin/beranda'}
                    />
                    {role == 'admin' ? (
                        <>
                            <MenuItemResponsive
                                collapsed={collapsed}
                                icon={`pi pi-users`}
                                label={'Jurnalis'}
                                link={'/admin/jurnalis'}
                            />
                            <MenuItemResponsive
                                collapsed={collapsed}
                                icon={`pi pi-paperclip`}
                                label={'Kategori'}
                                link={'/admin/kategori'}
                            />
                        </>
                    ) : (
                        ''
                    )}
                    <MenuItemResponsive
                        collapsed={collapsed}
                        icon={`pi pi-file`}
                        label={'Berita'}
                        link={'/admin/berita'}
                    />
                </Menu>
            </Sidebar>

            <nav className="flex flex-col w-full overflow-hidden">
                <div className="flex items-center px-4 w-full z-40 shadow-md bg-white text-black">
                    <div className="flex py-[17px] w-full items-center gap-4 justify-between">
                        <div className={`flex items-center`}>
                            <Button
                                severity="secondary"
                                onClick={() => setCollapsed(!collapsed)}
                                text
                                rounded
                                className={`size-8 hidden md:flex`}
                                icon={
                                    <i
                                        className={`pi ${collapsed ? 'pi-arrow-right' : 'pi-arrow-left'} text-xl`}
                                    />
                                }
                            />
                            <Button
                                severity="secondary"
                                onClick={() => setToggled(!toggled)}
                                text
                                rounded
                                className={`size-8 flex md:hidden`}
                                icon={<i className={`pi pi-arrow-right text-md`} />}
                            />
                            <p className={`ml-4 text-xl text-[#4b5563] md:hidden block`}>
                                {lastPath}
                            </p>
                        </div>

                        <Button
                            severity="secondary"
                            onClick={toggleMenuVisibility}
                            text
                            rounded
                            className={`size-8`}
                            icon={<i className={`pi pi-bars text-xl`} />}
                        />
                        <div ref={menuContainerRef} className={`absolute top-0 right-0`}>
                            <PrimeMenu
                                key={key}
                                className={`${isMenuVisible ? 'visible' : 'hidden'} normal text-md shadow-md absolute top-[70px] right-1 menu-news`}
                                model={[
                                    {
                                        label: 'Profile',
                                        icon: <i className="pi pi-user pr-3" />,
                                        command() {
                                            setIsMenuVisible(false);
                                            openProfileModal();
                                        },
                                    },
                                    {
                                        label: 'Password',
                                        icon: <i className="pi pi-key pr-3" />,
                                        command() {
                                            setIsMenuVisible(false);
                                            handleVisiblePasswordModal();
                                        },
                                    },
                                    {
                                        label: 'Keluar',
                                        icon: <i className="pi pi-sign-out pr-3" />,
                                        command() {
                                            setIsMenuVisible(false);
                                            setIsModalLogoutVisible(true);
                                        },
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>
                <div
                    ref={scrollRef}
                    className="flex-grow bg-[#f2f2f2] overflow-y-auto w-full overflow-x-hidden "
                >
                    {children}
                    <footer className=" border-t-[1px] flex flex-col gap-4 bg-white border-[#aeb0b5] py-2 md:pr-2 md:text-end text-sm pr-0 text-center">
                        <h1 className="font-normal text-xs">
                            &copy; {new Date().getFullYear()} ChronoNews. All rights reserved.
                        </h1>
                    </footer>
                </div>
            </nav>

            {/*modal update profile*/}
            <UserModal
                visible={profileModalState.isVisible}
                onClose={closeProfileModal}
                data={profileFormData}
                croppedImage={profileCropperProps.croppedImage}
                fileInputRef={profileCropperProps.fileInputRef}
                errors={profileErrors}
                submitLoading={profileModalState.isSubmitting}
                handleSubmit={handleProfileSubmit}
                handleClickUploadButton={profileCropperProps.handleClickUploadButton}
                handleImageChange={profileCropperProps.handleImageChange}
                setData={setProfileFormData}
                setProfilePicture={profileCropperProps.setProfilePicture}
                setCroppedImage={profileCropperProps.setCroppedImage}
            />

            {/*modal loading*/}
            <LoadingModal modalLoading={profileModalState.isLoading} />

            {/*modal cropper*/}
            <CropImageModal
                id="user-cropper"
                visible={profileCropperProps.visibleCropImageModal}
                onClose={profileCropperProps.handleCloseCropImageModal}
                selectedImage={profileCropperProps.selectedImage as string | null}
                onCrop={profileCropperProps.handleCrop}
                cropperRef={profileCropperProps.cropperRef}
                imageRef={profileCropperProps.imageRef}
            />

            {/*modal update password */}
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
            <LogoutModal
                visible={isModalLogoutVisible}
                setVisible={setIsModalLogoutVisible}
                onLogout={onLogout}
            />
        </div>
    );
};
export default SidebarResponsive;
