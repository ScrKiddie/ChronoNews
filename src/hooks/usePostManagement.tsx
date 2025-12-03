import {useState, useCallback, RefObject, useEffect} from "react";
import {z} from "zod";
import {useAuth} from "./useAuth.tsx";
import {PostService} from "../services/postService.tsx";
import {CategoryService} from "../services/categoryService.tsx";
import {UserService} from "../services/userService.tsx";
import {PostCreateSchema, PostUpdateSchema} from "../schemas/postSchema.tsx";
import {useCropper} from "./useCropper";
import {handleApiError, showSuccessToast} from "../utils/toastHandler.tsx";
import {processContentForEditor, reverseProcessContentForServer} from "../utils/contentProcessor.tsx";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";

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

interface UsePostManagementProps {
    toastRef: RefObject<any>;
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

export const usePostManagement = ({toastRef, pagination}: UsePostManagementProps) => {
    const {role} = useAuth();
    const {page, setPage, totalItem, size} = pagination;
    const queryClient = useQueryClient();

    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formData, setFormData] = useState<PostFormData>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [editorContent, setEditorContent] = useState("");

    const cropper = useCropper({
        setVisibleModal: setIsModalVisible,
        setProfilePicture: setThumbnail,
        toastRef,
        width: 1200,
        height: 675,
    });

    const closeModal = useCallback(() => {
        setIsModalVisible(false);
        setTimeout(() => {
            setModalMode(null);
            setSelectedPostId(null);
        }, 300);
    }, []);

    const {data: categoryOptions = [], isError: isCatError, error: catError} = useQuery({
        queryKey: ['categories'],
        queryFn: () => CategoryService.listCategories().then(res => res.data.map((c: any) => ({label: c.name, value: c.id}))),
        enabled: isModalVisible && (modalMode === 'create' || modalMode === 'edit'),
    });

    const {data: userOptions = [], isError: isUserError, error: userError} = useQuery({
        queryKey: ['users', 'all'],
        queryFn: () => UserService.searchUser({size: 1000}).then(res => [
            {label: "Posting Sebagai Diri Sendiri", value: 0},
            ...res.data.map((u: any) => ({label: `${u.name} - ${u.phoneNumber} - ${u.email} - ${u.role}`, value: u.id})),
        ]),
        enabled: isModalVisible && role === 'admin' && (modalMode === 'create' || modalMode === 'edit'),
    });

    const {data: postDataForEdit, isLoading: isModalLoading, isError: isPostError, error: postError} = useQuery({
        queryKey: ['post', selectedPostId],
        queryFn: async () => {
            const postData = await PostService.getPost(selectedPostId!);
            return {
                ...postData,
                content: processContentForEditor(postData.content || ""),
                userID: postData.user.id || 0,
                categoryID: postData.category.id || 0,
                deleteThumbnail: false,
            };
        },
        enabled: modalMode === 'edit' && !!selectedPostId && isModalVisible,
    });
    
    useEffect(() => {
        if (isCatError || isUserError || isPostError) {
            handleApiError(catError || userError || postError, toastRef);
            closeModal();
        }
    }, [isCatError, isUserError, isPostError, catError, userError, postError, toastRef, closeModal]);

    useEffect(() => {
        if (postDataForEdit) {
            setFormData(postDataForEdit);
            setEditorContent(postDataForEdit.content);
        }
    }, [postDataForEdit]);

    const openModal = useCallback((mode: ModalMode, postId?: number) => {
        cropper.resetCropper();
        setErrors({});
        setFormData(INITIAL_FORM_DATA);
        setEditorContent("");
        setThumbnail(null);
        setSelectedPostId(postId || null);
        setModalMode(mode);
        setIsModalVisible(true);
    }, [cropper]);

    const handleMutationSuccess = (message: string) => {
        showSuccessToast(toastRef, message);
        queryClient.invalidateQueries({queryKey: ['posts', 'search']});
        closeModal();
    };

    const handleMutationError = (error: unknown) => {
        if (error instanceof z.ZodError) {
            const formErrors = error.errors.reduce((acc, err) => ({...acc, [err.path[0]]: err.message}), {});
            setErrors(formErrors);
        } else {
            handleApiError(error, toastRef);
        }
    };

    const createPostMutation = useMutation({
        mutationFn: PostService.createPost,
        onSuccess: () => handleMutationSuccess("Postingan berhasil dibuat"),
        onError: handleMutationError,
    });

    const updatePostMutation = useMutation({
        mutationFn: ({id, request}: { id: number, request: any }) => PostService.updatePost(id, request),
        onSuccess: () => handleMutationSuccess("Postingan berhasil diperbarui"),
        onError: handleMutationError,
    });

    const deletePostMutation = useMutation({
        mutationFn: PostService.deletePost,
        onSuccess: () => {
            showSuccessToast(toastRef, "Postingan berhasil dihapus");
            const remainingItems = totalItem - 1;
            const totalPages = Math.ceil(remainingItems / size);
            if (page > totalPages && totalPages > 0) {
                setPage(totalPages);
            } else {
                queryClient.invalidateQueries({queryKey: ['posts', 'search']});
            }
            closeModal();
        },
        onError: handleMutationError,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const validationSchema = modalMode === 'create' ? PostCreateSchema : PostUpdateSchema;
        try {
            const validatedData = validationSchema.parse(formData);
            
            if (editorContent.length > 65535) {
                setErrors({ content: "Konten terlalu panjang" });
                return;
            }

            if (modalMode === "create") {
                const request = {...validatedData, content: editorContent || "", ...(thumbnail && {thumbnail})};
                await createPostMutation.mutateAsync(request);
            } else if (modalMode === "edit" && selectedPostId) {
                const cleanedContent = reverseProcessContentForServer(editorContent);
                const request = {
                    ...validatedData,
                    content: cleanedContent || "",
                    ...(formData.deleteThumbnail && {deleteThumbnail: true}),
                    ...(thumbnail && {thumbnail}),
                };
                await updatePostMutation.mutateAsync({id: selectedPostId, request});
            }
        } catch (error) {
            handleMutationError(error);
        }
    };

    const handleDeleteConfirm = async () => {
        if (selectedPostId) {
            await deletePostMutation.mutateAsync(selectedPostId);
        }
    };
    
    const isSubmitting = createPostMutation.isPending || updatePostMutation.isPending || deletePostMutation.isPending;

    return {
        modalState: {
            isVisible: isModalVisible,
            mode: modalMode,
            isLoading: isModalLoading,
            isSubmitting,
        },
        formData,
        setFormData,
        errors,
        openModal,
        closeModal,
        handleSubmit,
        handleDeleteConfirm,
        editorContent,
        setEditorContent,
        cropperProps: {
            ...cropper,
            setThumbnail: setThumbnail,
        },
        options: {
            category: categoryOptions,
            user: userOptions,
        },
        role,
    };
};
