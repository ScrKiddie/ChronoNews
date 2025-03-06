import {useEffect, useRef, useState} from "react";
import {z} from "zod";
import {useAuth} from "./useAuth.tsx";
import {PostService} from "../services/PostService";
import {CategoryService} from "../services/CategoryService";
import {PostCreateSchema} from "../schemas/PostSchema.tsx";
import {useCropper} from "./useCropper";
import {UserService} from "../services/UserService.tsx";

export const useCreatePost = (toastRef = null, fetchData = null) => {
    const {token, role} = useAuth();
    const editorContent = useRef("");
    const [visibleModal, setVisibleModal] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [userOptions, setUserOptions] = useState([]);
    const [data, setData] = useState({
        title: "",
        summary: "",
        content: "",
        userID: 0,
        categoryID: 0,
    });
    const [thumbnail, setThumbnail] = useState(null);
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
            const responseCategories = await CategoryService.listCategories(token);
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
            toastRef?.current?.show({
                severity: "error",
                detail: error.message,
                life: 2000,
            });
        }
        setModalLoading(false);
    };

    const handleCloseModal = () => setVisibleModal(false);

    const handleSubmit = async (e, editorValue) => {
        e.preventDefault();
        setSubmitLoading(true);
        setErrors({});
        try {
            data.content = editorValue
            const validatedData = PostCreateSchema.parse(data);
            const request = {
                ...validatedData,
                ...(thumbnail instanceof File ? {thumbnail: thumbnail} : {}),
            };
            await PostService.createPost(request, token);
            toastRef.current?.show({
                severity: "success",
                detail: "Postingan berhasil dibuat",
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
        role
    };
};
