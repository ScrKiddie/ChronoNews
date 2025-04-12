import {useState} from "react";
import {z} from "zod";
import {useAuth} from "./useAuth.tsx";
import {UserService} from "../services/UserService";
import {UserUpdateSchema} from "../schemas/UserSchema.tsx";
import {useCropper} from "./useCropper";

export const useUpdateUser = (toastRef = null, fetchData = null) => {
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
        setCroppedImage
    } = useCropper({setVisibleModal, setProfilePicture, toastRef});

    const handleVisibleModal = async (userId) => {
        setId(userId);
        resetCropper();
        setErrors({});
        setModalLoading(true);
        setData({deleteProfilePicture: false, name: "", role: "", phoneNumber: "", email: "", password: ""});
        setProfilePicture(null)
        try {
            const response = await UserService.getUser(userId, token);
            setData(response);
            setVisibleModal(true);
        } catch (error) {
            if (error.message === "Unauthorized"){
                toastRef.current.show({severity: "error", detail: "Sesi berakhir, silahkan login kembali"});
                logout()
            } else {
                toastRef?.current?.show({
                    severity: "error",
                    detail: error.message,
                    life: 2000,
                });
            }
        }

        setModalLoading(false);
    };

    const handleCloseModal = () => setVisibleModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setErrors({});

        try {
            const validatedData = UserUpdateSchema.parse(data);
            const request = {
                ...validatedData,
                ...(data?.deleteProfilePicture === true ? { deleteProfilePicture: true } : {}),
                ...(profilePicture instanceof File ? {profilePicture} : {}),
            };

            await UserService.updateUser(id, request, token);
            toastRef?.current?.show({
                severity: "success",
                detail: "Pengguna berhasil diperbarui",
                life: 2000,
            });
            if (fetchData) {
                fetchData();
            }
            setVisibleModal(false);
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(error.errors.reduce((acc, err) => ({...acc, [err.path[0]]: err.message}), {}));
            } else {
                if (error.message === "Unauthorized"){
                    toastRef.current.show({severity: "error", detail: "Sesi berakhir, silahkan login kembali"});
                    logout()
                } else {
                    toastRef?.current?.show({
                        severity: "error",
                        detail: error.message,
                        life: 2000,
                    });
                }
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
