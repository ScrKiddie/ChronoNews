import { useState } from "react";
import { z } from "zod";
import { useAuth } from "./useAuth.tsx";
import { UserService } from "../services/UserService";
import { UserUpdateSchema } from "../schemas/UserSchema.tsx";
import { useCropper } from "./useCropper";

export const useUpdateUser = (toastRef = null, fetchData=null) => {
    const { token } = useAuth();

    const [modalLoading, setModalLoading] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [data, setData] = useState({
        name: "",
        role: "",
        email: "",
        phoneNumber: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [profilePicture, setProfilePicture] = useState(null);
    const [id, setId] = useState(0)

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

    // Buka Modal Update Pengguna
    const handleVisibleModal = async (userId) => {
        setId(userId);
        resetCropper();
        setErrors({});
        setModalLoading(true);
        setData({ name: "", role: "", phoneNumber: "", email: "", password: ""});
        setProfilePicture(null)
        try {
            const response = await UserService.getUser(userId, token);
            setData(response);
            console.log(data)
            setVisibleModal(true);
        } catch (error) {
            toastRef?.current?.show({
                severity: "error",
                detail: error.message,
                life: 2000,
            });
        }

        setModalLoading(false);
    };

    // Tutup Modal Update Pengguna
    const handleCloseModal = () => setVisibleModal(false);

    // Handle Submit Update Pengguna
    const handleSubmit = async (e) => {
        console.log("Data sebelum validasi:", data);
        e.preventDefault();
        setSubmitLoading(true);
        setErrors({});

        try {
            const validatedData = UserUpdateSchema.parse(data);
            console.log(validatedData)
            const request = {
                ...validatedData,
                ...(profilePicture instanceof File ? { profilePicture } : {}),
            };

            await UserService.updateUser(id, request, token);
            toastRef?.current?.show({
                severity: "success",
                detail: "Pengguna berhasil diperbarui",
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
                toastRef?.current?.show({
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
