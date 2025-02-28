import {useEffect, useState} from "react";
import { z } from "zod";
import { useAuth } from "./useAuth.tsx";
import { PostService } from "../services/PostService";
import { CategoryService } from "../services/CategoryService";
import { PostCreateSchema } from "../schemas/PostSchema.tsx";
import { useCropper } from "./useCropper";
import {UserService} from "../services/UserService.tsx";

export const useCreatePost = (toastRef = null, fetchData = null) => {
    const { token } = useAuth();

    const [visibleModal, setVisibleModal] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false); // Loading state for modal
    const [categoryOptions, setCategoryOptions] = useState([]); // Store categories
    const [userOptions, setUserOptions] = useState([]); // Store categories
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
    } = useCropper({ setVisibleModal: setVisibleModal, setProfilePicture: setThumbnail, toastRef, width:1200, height:675});

    useEffect(() => {
        console.log("Thumbnail telah diperbarui:", thumbnail);
    }, [thumbnail]);
    // Open Create Post Modal and fetch categories
    const handleVisibleModal = async () => {
        resetCropper();
        setErrors({});
        setData({ title: "", summary: "", content: "", userID: 0, categoryID: 0 });
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
            const responseUsers = await UserService.searchUser(token);
            if (responseUsers && Array.isArray(responseUsers.data)) {
                setUserOptions([
                    { label: "Posting Sebagai Diri Sendiri", value: 0 },
                    ...responseUsers.data.map(user => ({
                        label: `${user.name} - ${user.phoneNumber} - ${user.email} - ${user.role}`,
                        value: user.id,
                    })),
                ]);
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

    // Close Modal
    const handleCloseModal = () => setVisibleModal(false);

    // Handle Submit Create Post
    const handleSubmit = async (e, editorValue) => {
        e.preventDefault();
        setSubmitLoading(true);
        setErrors({});
        try {
            data.content = editorValue
            const validatedData = PostCreateSchema.parse(data);
            const request = {
                ...validatedData,
                ...(thumbnail instanceof File ? { thumbnail: thumbnail } : {}),
            };
            console.log(validatedData)
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
        modalLoading,
        data,
        errors,
        categoryOptions, // Include category options
        userOptions,
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
