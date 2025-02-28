import { useState } from "react";
import { z } from "zod";
import { useAuth } from "./useAuth.tsx";
import { UserService } from "../services/UserService";
import { UserCreateSchema } from "../schemas/UserSchema.tsx";
import { useCropper } from "./useCropper";

export const useCreateUser = (toastRef = null, fetchData = null) => {
    const { token } = useAuth();

    const [visibleModal, setVisibleModal] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [data, setData] = useState({
        name: "",
        phoneNumber: "",
        email: "",
        password: "",
        role: ""
    });
    const [profilePicture,setProfilePicture] = useState(null)
    const [errors, setErrors] = useState({});

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
    } = useCropper({ setVisibleModal, setProfilePicture, toastRef });

    // Buka Modal Create User
    const handleVisibleModal = () => {
        resetCropper();
        setErrors({});
        setData({ name: "", phoneNumber: "", email: "", password: "", role: ""});
        setProfilePicture(null)
        setVisibleModal(true);
    };

    // Tutup Modal Create User
    const handleCloseModal = () => setVisibleModal(false);

    // Handle Submit Create User
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setErrors({});

        try {
            const validatedData = UserCreateSchema.parse(data);
            const request = {
                ...validatedData,
                ...(profilePicture instanceof File ? { profilePicture: profilePicture } : {}),
            };

            await UserService.createUser(request, token);
            toastRef.current?.show({
                severity: "success",
                detail: "Pengguna berhasil dibuat",
                life: 2000,
            });

            if (fetchData){
                fetchData();
            }
            setVisibleModal(false);
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(error.errors.reduce((acc, err) => ({ ...acc, [err.path[0]]: err.message }), {}));
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
        visibleModal,
        submitLoading,
        data,
        errors,
        handleVisibleModal,
        handleCloseModal,
        handleSubmit,
        setData,
        setVisibleModal,

        // Props dari useCropper
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
    };
};
