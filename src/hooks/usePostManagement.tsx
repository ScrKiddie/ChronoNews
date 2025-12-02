import {useState, useCallback, RefObject, useRef} from "react";
import {z} from "zod";
import {useAuth} from "./useAuth.tsx";
import {PostService} from "../services/postService.tsx";
import {CategoryService} from "../services/categoryService.tsx";
import {UserService} from "../services/userService.tsx";
import {PostCreateSchema, PostUpdateSchema} from "../schemas/postSchema.tsx";
import {useCropper} from "./useCropper";
import {showErrorToast, showSuccessToast} from "../utils/toastHandler.tsx";
import {processContentForEditor, reverseProcessContentForServer} from "../utils/contentProcessor.tsx";

type ModalMode = "create" | "edit" | "delete" | null;

interface PostFormData {
    title: string;
    summary: string;
    content: string;
    userID: number;
    categoryID: number;
    thumbnail?: string;
    deleteThumbnail?: boolean;
}

interface Option {
    label: string;
    value: number;
}

interface UsePostManagementProps {
    toastRef: RefObject<any>;
    fetchData: () => void;
    pagination: {
        page: number;
        setPage: (page: number | ((prev: number) => number)) => void;
        totalItem: number;
        size: number;
    };
}

const INITIAL_FORM_DATA: PostFormData = {
    title: "",
    summary: "",
    content: "",
    userID: 0,
    categoryID: 0,
    deleteThumbnail: false,
};

export const usePostManagement = ({toastRef, fetchData, pagination}: UsePostManagementProps) => {
    const {token, role, logout} = useAuth();
    const {page, setPage, totalItem, size} = pagination;

    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [formData, setFormData] = useState<PostFormData>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
    const [userOptions, setUserOptions] = useState<Option[]>([]);
    
    const editorContentRef = useRef("");

    const cropper = useCropper({
        setVisibleModal: setIsModalVisible,
        setProfilePicture: setThumbnail,
        toastRef,
        width: 1200,
        height: 675,
    });

    const openModal = useCallback(async (mode: ModalMode, postId?: number) => {
        cropper.resetCropper();
        setErrors({});
        setFormData(INITIAL_FORM_DATA);
        editorContentRef.current = "";
        setThumbnail(null);
        setModalMode(mode);
        setIsModalLoading(true);
        setIsModalVisible(true);

        if ((mode === "edit" || mode === "delete") && postId) {
            setSelectedPostId(postId);
        }
        
        if (mode === 'delete') {
            setIsModalLoading(false);
            return;
        }

        try {
            const catPromise = CategoryService.listCategories();
            const userPromise = role === "admin"
                ? UserService.searchUser(token, {}, null, toastRef, logout, () => {})
                : Promise.resolve(null);

            const [catResponse, userResponse] = await Promise.all([catPromise, userPromise]);

            if (catResponse && Array.isArray(catResponse.data)) {
                setCategoryOptions(catResponse.data.map(c => ({label: c.name, value: c.id})));
            }

            if (userResponse && Array.isArray(userResponse.data)) {
                setUserOptions([
                    {label: "Posting Sebagai Diri Sendiri", value: 0},
                    ...userResponse.data.map(u => ({
                        label: `${u.name} - ${u.phoneNumber} - ${u.email} - ${u.role}`,
                        value: u.id,
                    })),
                ]);
            }

            if (mode === "edit" && postId) {
                const postData = await PostService.getPost(postId);
                const processedContent = processContentForEditor(postData.content || "");
                editorContentRef.current = processedContent;
                setFormData({
                    ...postData,
                    content: processedContent,
                    userID: postData.user.id || 0,
                    categoryID: postData.category.id || 0,
                    deleteThumbnail: false,
                });
            }
        } catch (error) {
            console.error("Failed to fetch data for modal:", error);
            showErrorToast(toastRef, "Gagal memuat data untuk modal.");
            setIsModalVisible(false);
        } finally {
            setIsModalLoading(false);
        }
    }, [token, role, logout, cropper, toastRef]);

    const closeModal = useCallback(() => {
        setIsModalVisible(false);
        setTimeout(() => {
            setModalMode(null);
            setSelectedPostId(null);
        }, 300);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (modalMode !== 'delete' || !selectedPostId) return;

        setIsSubmitting(true);
        try {
            await PostService.deletePost(selectedPostId, token, toastRef, logout);
            showSuccessToast(toastRef, "Postingan berhasil dihapus");
            
            const remainingItems = totalItem - 1;
            const remainingPages = Math.ceil(remainingItems / size);
            if (remainingItems > 0 && remainingPages < page) {
                setPage((prev) => Math.max(1, prev - 1));
            }
            
            fetchData();
            closeModal();
        } catch (error) {
            console.error("An unhandled error occurred during post deletion:", error);
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedPostId, token, logout, toastRef, totalItem, size, page, setPage, fetchData, closeModal, modalMode]);

    const handleSubmit = useCallback(async (e: React.FormEvent, editorValue: string = "") => {
        e.preventDefault();
        if (modalMode !== 'create' && modalMode !== 'edit') return;

        setIsSubmitting(true);

        const newErrors: Record<string, string> = {};
        const validationSchema = modalMode === 'create' ? PostCreateSchema : PostUpdateSchema;
        
        try {
            validationSchema.parse(formData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                Object.assign(newErrors, error.errors.reduce((acc, err) => ({...acc, [err.path[0]]: err.message}), {}));
            }
        }
        if (editorValue && editorValue.length > 65535) {
            newErrors.content = "Konten terlalu panjang";
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }
        setErrors({});

        if (typeof editorValue === 'string' && new Blob([editorValue]).size > 314572800) {
            showErrorToast(toastRef, "Konten melebihi batas ukuran dari server.");
            setIsSubmitting(false);
            return;
        }

        try {
            if (modalMode === "create") {
                const validatedData = validationSchema.parse(formData);
                const request = {
                    ...validatedData,
                    content: editorValue || "",
                    ...(thumbnail instanceof File ? {thumbnail} : {}),
                };
                await PostService.createPost(request, token, toastRef, logout);
                showSuccessToast(toastRef, "Postingan berhasil dibuat");
            } else if (modalMode === "edit") {
                if (!selectedPostId) throw new Error("No post selected for update");
                const validatedData = validationSchema.parse(formData);
                const cleanedContent = reverseProcessContentForServer(editorValue);
                const request = {
                    ...validatedData,
                    userID: formData.userID,
                    content: cleanedContent || "",
                    ...(formData.deleteThumbnail === true ? {deleteThumbnail: true} : {}),
                    ...(thumbnail instanceof File ? {thumbnail} : {}),
                };
                await PostService.updatePost(selectedPostId, request, token, toastRef, logout);
                showSuccessToast(toastRef, "Postingan berhasil diperbarui");
            }
            
            fetchData();
            closeModal();

        } catch (error) {
            console.error("An unhandled error occurred:", error);
        } finally {
            setIsSubmitting(false);
        }
    }, [
        modalMode, formData, thumbnail, selectedPostId, token, logout,
        fetchData, closeModal, toastRef
    ]);

    return {
        modalState: {
            isVisible: isModalVisible,
            mode: modalMode,
            isLoading: isModalLoading,
            isSubmitting: isSubmitting,
        },
        formData,
        setFormData,
        errors,
        openModal,
        closeModal,
        handleSubmit,
        handleDeleteConfirm,
        editorContentRef,
        cropperProps: {
            ...cropper,
            setThumbnail: cropper.setProfilePicture,
        },
        options: {
            category: categoryOptions,
            user: userOptions,
        },
        role,
    };
};
