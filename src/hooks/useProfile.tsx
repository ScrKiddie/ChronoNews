import {useState,} from "react";
import {z} from "zod";
import {useAuth} from "./useAuth.tsx";
import {ProfileService} from "../services/ProfileService";
import {ProfileSchema} from "../schemas/ProfileSchema.tsx";
import {useCropper} from "./useCropper";

export const useProfile = (toastRef = null) => {

    const {token} = useAuth();

    const [modalLoading, setModalLoading] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [data, setData] = useState(null);
    const [errors, setErrors] = useState({});
    const [profilePicture, setProfilePicture] = useState(null)
    const {
        fileInputRef,
        selectedImage,
        visibleCropImageModal,
        croppedImage,
        cropperRef,
        imageRef,
        handleImageChange,
        handleCloseCropImageModal,
        handleClickUploadButton,
        handleCrop,
        resetCropper,
        setCroppedImage
    } = useCropper({setVisibleModal: setVisibleModal, setProfilePicture: setProfilePicture, toastRef});

    const handleVisibleModal = async () => {
        resetCropper();
        setErrors({});
        setModalLoading(true);

        try {
            const userData = await ProfileService.getCurrentUser(token);
            setData(userData);
            setVisibleModal(true);
        } catch (error) {
            toastRef.current?.show({
                severity: "error",
                detail: error.message,
                life: 2000,
            });
        }

        setModalLoading(false);
    };

    const handleCloseModal = () => setVisibleModal(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setErrors({});

        try {
            const validatedData = ProfileSchema.parse({
                name: data?.name,
                email: data?.email,
                phoneNumber: data?.phoneNumber,
            });

            const request = {
                ...validatedData,
                ...(data?.deleteProfilePicture === true ? { deleteProfilePicture: true } : {}),
                ...(profilePicture instanceof File ? {profilePicture: profilePicture} : {}),
            };
            await ProfileService.updateCurrentUser(request, token);
            toastRef.current?.show({
                severity: "success",
                detail: "Profil berhasil diperbarui",
                life: 2000,
            });

            setVisibleModal(false);
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(error.errors.reduce((acc, err) => ({...acc, [err.path[0]]: err.message}), {}));
            } else {
                toastRef.current?.show({
                    severity: "error",
                    detail: error.message,
                    life: 2000,
                });
            }
        }

        setSubmitLoading(false);
    };

    return {
        toastRef,
        modalLoading,
        visibleModal,
        submitLoading,
        data,
        errors,
        handleVisibleModal,
        handleCloseModal,
        handleSubmit,
        setData,
        setVisibleModal,
        setProfilePicture,
        // props dari useCropper
        fileInputRef,
        selectedImage,
        visibleCropImageModal,
        croppedImage,
        cropperRef,
        imageRef,
        handleCrop,
        handleImageChange,
        handleCloseCropImageModal,
        handleClickUploadButton,
        setCroppedImage
    };
};
