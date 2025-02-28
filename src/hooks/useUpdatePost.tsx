import { useEffect, useState } from "react";
import { z } from "zod";
import { useAuth } from "./useAuth.tsx";
import { PostService } from "../services/PostService";
import { CategoryService } from "../services/CategoryService";
import { PostUpdateSchema } from "../schemas/PostSchema.tsx";
import { useCropper } from "./useCropper";
import {UserService} from "../services/UserService.tsx";

export const useUpdatePost = (toastRef = null, fetchData = null) => {
    const { token,role } = useAuth();

    const [modalLoading, setModalLoading] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [data, setData] = useState({
        title: "",
        summary: "",
        content: "",
        userID: 0,
        categoryID: 0,
    });
    const [categoryOptions, setCategoryOptions] = useState([]); // Menyimpan daftar kategori
    const [userOptions, setUserOptions] = useState([]); // Store categories
    const [errors, setErrors] = useState({});
    const [thumbnail, setThumbnail] = useState(null);
    const [id, setId] = useState(0);

    const processContent = (htmlContent) => {
        if (!htmlContent) return "";

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");

        doc.querySelectorAll("img").forEach((img) => {
            const src = img.getAttribute("src");
            if (src && !src.startsWith("http")) {
                img.setAttribute("src", `http://localhost:3000/post_picture/${src}`);
            }
        });

        return doc.body.innerHTML;
    };

    const reverseProcessContent = (htmlContent) => {
        if (!htmlContent) return "";

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");

        doc.querySelectorAll("img").forEach((img) => {
            const src = img.getAttribute("src");
            if (src && src.startsWith("http://localhost:3000/post_picture/")) {
                img.setAttribute("src", src.replace("http://localhost:3000/post_picture/", ""));
            }
        });

        return doc.body.innerHTML;
    };


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
    } = useCropper({ setVisibleModal: setVisibleModal, setProfilePicture: setThumbnail, toastRef, width: 1200, height: 675 });

    useEffect(() => {
        console.log("Thumbnail telah diperbarui:", thumbnail);
    }, [thumbnail]);

    // Fungsi untuk membuka modal update post dan fetch data
    const handleVisibleModal = async (postId) => {
        setId(postId);
        resetCropper();
        setErrors({});
        setModalLoading(true);
        setData({ title: "", summary: "", content: "", userID: 0, categoryID: 0 });
        setThumbnail(null);

        try {
            // Ambil daftar kategori
            const categoryResponse = await CategoryService.listCategories(token);
            if (categoryResponse && Array.isArray(categoryResponse.data)) {
                setCategoryOptions(categoryResponse.data.map(category => ({
                    label: category.name,
                    value: category.id,
                })));
            }
            if (role == "admin"){
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
            }

            // Ambil data post berdasarkan ID
            const response = await PostService.getPost(postId, token);
            if (response) {
                setData({
                    title: response.title || "",
                    summary: response.summary || "",
                    content: processContent(response.content || ""),
                    userID: response.user.id || "",
                    categoryID: response.category.id || "",
                    thumbnail: response.thumbnail || "",
                });

            }

            setVisibleModal(true);
        } catch (error) {
            toastRef?.current?.show({
                severity: "error",
                detail: error.message || "Gagal mengambil data post",
                life: 2000,
            });
        }

        setModalLoading(false);
    };

    // Fungsi untuk menutup modal
    const handleCloseModal = () => setVisibleModal(false);

    // Fungsi untuk menangani submit update post
    const handleSubmit = async (e, editorValue) => {
        e.preventDefault();
        setSubmitLoading(true);
        setErrors({});

        try {
            // Validasi data sebelum mengirim ke server
            const validatedData = PostUpdateSchema.parse({
                title: data?.title,
                summary: data?.summary,
                content: editorValue,
                userID: data?.userID,
                categoryID: data?.categoryID,
            });

            const cleanedContent = reverseProcessContent(validatedData.content);

            const request = {
                ...validatedData,
                content: cleanedContent, // Gunakan versi yang sudah dihapus prefix-nya
                ...(thumbnail instanceof File ? { thumbnail } : {}),
            };


            await PostService.updatePost(id, request, token);
            toastRef?.current?.show({
                severity: "success",
                detail: "Postingan berhasil diperbarui",
                life: 2000,
            });

            if (fetchData) {
                fetchData();
            }
            setVisibleModal(false);
        } catch (error) {
            console.log(error)
            if (error instanceof z.ZodError) {
                setErrors(error.errors.reduce((acc, err) => ({ ...acc, [err.path[0]]: err.message }), {}));
            } else {
                toastRef?.current?.show({
                    severity: "error",
                    detail: error.message || "Gagal memperbarui post",
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
        role
    };
};
