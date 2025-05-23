import {useRef, useState} from "react";
import {z} from "zod";
import {useAuth} from "./useAuth.tsx";
import {PostService} from "../services/postService.tsx";
import {CategoryService} from "../services/categoryService.tsx";
import {PostCreateSchema} from "../schemas/postSchema.tsx";
import {useCropper} from "./useCropper";
import {UserService} from "../services/userService.tsx";
import {handleApiError, showErrorToast, showSuccessToast} from "../utils/toastHandler.tsx";

export const useCreatePost = (toastRef, fetchData) => {
    const {token, role, logout} = useAuth();
    const editorContent = useRef("");
    const [visibleModal, setVisibleModal] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [userOptions, setUserOptions] = useState<{ label: string; value: number }[]>([]);
    const [data, setData] = useState({
        title: "",
        summary: "",
        content: "",
        userID: 0,
        categoryID: 0,
    });
    const [thumbnail, setThumbnail] = useState<File | null>(null);
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
    } = useCropper({
        setVisibleModal: setVisibleModal,
        setProfilePicture: setThumbnail,
        toastRef,
        width: 1200,
        height: 675
    });

    const handleVisibleModal = async () => {
        resetCropper();
        setErrors({});
        editorContent.current = "";
        setData({title: "", summary: "", content: "", userID: 0, categoryID: 0});
        setThumbnail(null);
        setModalLoading(true);
        try {
            const responseCategories = await CategoryService.listCategories();
            if (responseCategories && Array.isArray(responseCategories.data)) {
                setCategoryOptions(responseCategories.data.map(category => ({
                    label: category.name,
                    value: category.id,
                })));
            }
            if (role == "admin") {
                const responseUsers = await UserService.searchUser(token);
                if (responseUsers && Array.isArray(responseUsers.data)) {
                    setUserOptions([
                        {label: "Posting Sebagai Diri Sendiri", value: 0},
                        ...responseUsers.data.map(user => ({
                            label: `${user.name} - ${user.phoneNumber} - ${user.email} - ${user.role}`,
                            value: user.id,
                        })),
                    ]);
                }
            }
            setVisibleModal(true);
        } catch (error) {
            handleApiError(error,toastRef, logout)
        }
        setModalLoading(false);
    };

    const handleCloseModal = () => setVisibleModal(false);

    const handleSubmit = async (e, editorValue) => {
        e.preventDefault();
        setSubmitLoading(true);
        setErrors({});
        try {
            const validatedData = PostCreateSchema.parse(data);
            const request = {
                ...validatedData,
                content: editorValue,
                ...(thumbnail instanceof File ? {thumbnail: thumbnail} : {}),
            };
            if (typeof editorValue === 'string' && new Blob([editorValue]).size > 314572800) {
                showErrorToast(toastRef, "Konten melebihi batas dari server")
                setSubmitLoading(false);
                return;
            }
            await PostService.createPost(request, token);
            showSuccessToast(toastRef,"Postingan berhasil dibuat")
            if (fetchData) {
                fetchData();
            }
            setVisibleModal(false);

        } catch (error) {
            if (typeof editorValue === 'string' && new Blob([editorValue]).size > 314572800 ) {
                showErrorToast(toastRef, "Konten melebihi batas dari server");
            }
            if (error instanceof z.ZodError) {
                setErrors(error.errors.reduce((acc, err) => ({...acc, [err.path[0]]: err.message}), {}));
            } else {
                handleApiError(error,toastRef, logout)
            }
        }
        setSubmitLoading(false);
    };

    return {
        toastRef,
        visibleModal,
        submitLoading,
        modalLoading,
        data,
        errors,
        categoryOptions,
        userOptions,
        handleVisibleModal,
        handleCloseModal,
        handleSubmit,
        setData,
        setVisibleModal,
        editorContent,
        setThumbnail,
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
        role,
        setCroppedImage
    };
};
