import {useState} from "react";
import {z} from "zod";
import {useAuth} from "./useAuth.tsx";
import {UserService} from "../services/userService.tsx";
import {UserCreateSchema} from "../schemas/userSchema.tsx";
import {useCropper} from "./useCropper";
import { handleApiError, showSuccessToast } from "../utils/toastHandler.tsx";

export const useCreateUser = (toastRef, fetchData) => {
    const {token,logout} = useAuth();

    const [visibleModal, setVisibleModal] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [data, setData] = useState({
        name: "",
        phoneNumber: "",
        email: "",
        password: "",
        role: ""
    });

    const [profilePicture, setProfilePicture] = useState<File | null>(null);
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
        setCroppedImage
    } = useCropper({setVisibleModal, setProfilePicture, toastRef});

    const handleVisibleModal = () => {
        resetCropper();
        setErrors({});
        setData({name: "", phoneNumber: "", email: "", password: "", role: ""});
        setProfilePicture(null)
        setVisibleModal(true);
    };

    const handleCloseModal = () => setVisibleModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setErrors({});

        try {
            const validatedData = UserCreateSchema.parse(data);
            const request = {
                ...validatedData,
                ...(profilePicture instanceof File ? {profilePicture: profilePicture} : {}),
            };

            await UserService.createUser(request, token);
            showSuccessToast(toastRef, "Pengguna berhasil dibuat")

            if (fetchData) {
                fetchData();
            }

            setVisibleModal(false);
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(error.errors.reduce((acc, err) => ({...acc, [err.path[0]]: err.message}), {}));
            } else {
                handleApiError(error, toastRef, logout);
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
