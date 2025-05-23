import {useState} from "react";
import {z} from "zod";
import {useAuth} from "./useAuth.tsx";
import {UserService} from "../services/userService.tsx";
import {UserUpdateSchema} from "../schemas/userSchema.tsx";
import {useCropper} from "./useCropper";
import { handleApiError, showSuccessToast } from "../utils/toastHandler.tsx";
import {ProfileSchema} from "../schemas/profileSchema.tsx";
import {ProfileService} from "../services/profileService.tsx";

export const useUpdateUser = (toastRef, fetchData, mode = "default") => {
    const {token, logout} = useAuth();

    const [modalLoading, setModalLoading] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [data, setData] = useState({
        name: "",
        role: "",
        email: "",
        phoneNumber: "",
        password: "",
        deleteProfilePicture: false
    });
    const [errors, setErrors] = useState({});
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
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
        setCroppedImage
    } = useCropper({setVisibleModal, setProfilePicture, toastRef});

    const handleVisibleModal = async (userId:number = 0) => {
        resetCropper();
        setErrors({});
        setModalLoading(true);
        setData({deleteProfilePicture: false, name: "", role: "", phoneNumber: "", email: "", password: ""});
        setProfilePicture(null)
        try {
            if (mode === "default") {
                const response = await UserService.getUser(userId, token);
                setId(userId);
                setData(response);
            } else if (mode === "current") {
                const response = await ProfileService.getCurrentUser(token);
                setData(response);
            }
            setVisibleModal(true);
        } catch (error) {
            handleApiError(error,toastRef,logout)
        }
        setModalLoading(false);
    };

    const handleCloseModal = () => setVisibleModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setErrors({});

        try {
            const schema = mode === "default" ? UserUpdateSchema : ProfileSchema;
            const validatedData = schema.parse(data);
            const request = {
                ...validatedData,
                ...(data?.deleteProfilePicture === true ? { deleteProfilePicture: true } : {}),
                ...(profilePicture instanceof File ? {profilePicture} : {}),
            };

            if (mode === "default") {
                await UserService.updateUser(id, request, token);
                showSuccessToast(toastRef, "Pengguna berhasil diperbarui");
            } else if (mode === "current") {
                await ProfileService.updateCurrentUser(request, token);
                showSuccessToast(toastRef, "Profil berhasil diperbarui");
            }
            if (mode === "default") {
                if (fetchData) {
                    fetchData();
                }
            }
            setVisibleModal(false);
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(error.errors.reduce((acc, err) => ({...acc, [err.path[0]]: err.message}), {}));
            } else {
                handleApiError(error,toastRef,logout)
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
