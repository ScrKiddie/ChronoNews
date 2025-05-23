import {useRef, useState} from "react";
import {z} from "zod";
import {useAuth} from "./useAuth.tsx";
import {PostService} from "../services/postService.tsx";
import {CategoryService} from "../services/categoryService.tsx";
import {PostUpdateSchema} from "../schemas/postSchema.tsx";
import {useCropper} from "./useCropper";
import {UserService} from "../services/userService.tsx";
import {handleApiError, showErrorToast, showSuccessToast} from "../utils/toastHandler.tsx";

const apiUri = import.meta.env.VITE_CHRONONEWSAPI_URI;
export const useUpdatePost = (toastRef:any = null, fetchData:any=null) => {
    const {token, role, logout} = useAuth();
    const editorContent = useRef("");
    const [modalLoading, setModalLoading] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [data, setData] = useState({
        title: "",
        thumbnail:"",
        summary: "",
        content: "",
        userID: 0,
        categoryID: 0,
        deleteThumbnail: false,
    });
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [userOptions, setUserOptions] = useState<{ label: string; value: number }[]>([]);
    const [errors, setErrors] = useState({});
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [id, setId] = useState(0);

    const processContent = (htmlContent) => {
        if (!htmlContent) return "";

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");

        doc.querySelectorAll("img").forEach((img) => {
            const src = img.getAttribute("src");
            if (src && !src.startsWith("http")) {
                img.setAttribute("src", `${apiUri}/post_picture/${src}`);
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
            if (src && src.startsWith(`${apiUri}/post_picture/`)) {
                img.setAttribute("src", src.replace(`${apiUri}/post_picture/`, ""));
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
        setCroppedImage
    } = useCropper({
        setVisibleModal: setVisibleModal,
        setProfilePicture: setThumbnail,
        toastRef,
        width: 1200,
        height: 675
    });

    const handleVisibleModal = async (postId) => {
        setId(postId);
        resetCropper();
        setErrors({});
        setModalLoading(true);
        editorContent.current = "";
        setData({thumbnail: "", deleteThumbnail: false, title: "", summary: "", content: "", userID: 0, categoryID: 0});
        setThumbnail(null);
        try {
            const categoryResponse = await CategoryService.listCategories();
            if (categoryResponse && Array.isArray(categoryResponse.data)) {
                setCategoryOptions(categoryResponse.data.map(category => ({
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

            const response = await PostService.getPost(postId);
            if (response) {
                setData({
                    thumbnail:response.thumbnail,
                    deleteThumbnail: false,
                    title: response.title || "",
                    summary: response.summary || "",
                    content: processContent(response.content || ""),
                    userID: response.user.id || 0,
                    categoryID: response.category.id || 0

                });
            }

            setVisibleModal(true);
        } catch (error) {
            handleApiError(error,toastRef,logout)
        }

        setModalLoading(false);
    };

    const handleCloseModal = () => setVisibleModal(false);

    const handleSubmit = async (e, editorValue) => {
        e.preventDefault();
        setSubmitLoading(true);
        setErrors({});

        try {
            const validatedData = PostUpdateSchema.parse({
                title: data?.title,
                summary: data?.summary,
                categoryID: data?.categoryID,
            });

            const cleanedContent = reverseProcessContent(editorValue);
            const request = {
                ...validatedData,
                userID: data?.userID,
                content: cleanedContent,
                ...(data?.deleteThumbnail === true ? { deleteThumbnail: true } : {}),
                ...(thumbnail instanceof File ? {thumbnail} : {}),
            };

            if (typeof editorValue === 'string' && new Blob([editorValue]).size > 314572800 ) {
                showErrorToast(toastRef,"Konten melebihi batas dari server")
                setSubmitLoading(false);
                return;
            }

            await PostService.updatePost(id, request, token);
            showSuccessToast(toastRef, "Postingan berhasil diperbarui")

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
        processContent,
        setCroppedImage
    };
};
