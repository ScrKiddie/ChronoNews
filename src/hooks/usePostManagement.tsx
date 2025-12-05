import {useState, useCallback, useEffect, useRef} from "react";
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
import {ToastRef} from "../types/toast.tsx";
import {ApiPostRequest, Category, DropdownOption, User} from "../types/post.tsx";
import {ApiError} from "../types/api.tsx";
import {PostFormData} from "../types/post.tsx";

type ModalMode = "create" | "edit" | "delete" | null;

interface UsePostManagementProps {
    toastRef: ToastRef;
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

    const editorContentRef = useRef("");

    const [isDataSynced, setIsDataSynced] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [thumbnail, setThumbnail] = useState<File | null>(null);

    const cropper = useCropper({
        setVisibleModal: setIsModalVisible,
        setProfilePicture: setThumbnail,
        toastRef,
        width: 1200,
        height: 675,
    });

    const {
        data: postDataForEdit,
        isLoading: isModalLoading,
        isFetching: isModalFetching,
        isSuccess: isPostSuccess,
        isError: isPostError,
        error: postError
    } = useQuery({
        queryKey: ['post', selectedPostId],
        queryFn: async () => {
            if (!selectedPostId) return null;
            const postData = await PostService.getPost(selectedPostId);
            return {
                ...postData,
                content: processContentForEditor(postData.content || ""),
                userID: postData.user.id || 0,
                categoryID: postData.category.id || 0,
                deleteThumbnail: false,
            };
        },
        enabled: modalMode === 'edit' && !!selectedPostId && isModalVisible,
        gcTime: 0,
        staleTime: 0,
    });

    const closeModal = useCallback(() => {
        setIsModalVisible(false);
        setTimeout(() => {
            if (selectedPostId) {
                queryClient.removeQueries({ queryKey: ['post', selectedPostId] });
            }

            setModalMode(null);
            setSelectedPostId(null);
            setFormData(INITIAL_FORM_DATA);

            editorContentRef.current = "";

            setIsDataSynced(false);
        }, 300);
    }, [selectedPostId, queryClient]);

    const {data: categoryOptions = []} = useQuery({
        queryKey: ['categories'],
        queryFn: () => CategoryService.listCategories().then(res =>
            res.data.map((c: Category) => ({ label: c.name, value: c.id }))
        ),
        enabled: isModalVisible,
    });

    const {data: userOptions = []} = useQuery<DropdownOption[]>({
        queryKey: ['users', 'all'],
        queryFn: () => UserService.searchUser().then(res => [
            {label: "Posting Sebagai Diri Sendiri", value: 0},
            ...res.data.map((u: User) => ({
                label: `${u.name} - ${u.phoneNumber} - ${u.email} - ${u.role}`,
                value: u.id
            }))
        ]),
        enabled: isModalVisible && role === 'admin',
    });

    useEffect(() => {
        if (isPostError) {
            handleApiError(postError as ApiError, toastRef);
            closeModal();
        }
    }, [isPostError, postError, toastRef, closeModal]);

    useEffect(() => {
        if (
            modalMode === 'edit' &&
            isModalVisible &&
            postDataForEdit &&
            isPostSuccess &&
            !isModalFetching &&
            !isDataSynced
        ) {
            setFormData({
                title: postDataForEdit.title,
                summary: postDataForEdit.summary,
                userID: postDataForEdit.userID,
                categoryID: postDataForEdit.categoryID,
                content: "",
                deleteThumbnail: false,
                thumbnail: postDataForEdit.thumbnail
            });

            editorContentRef.current = postDataForEdit.content;

            setIsDataSynced(true);
        }
    }, [postDataForEdit, isPostSuccess, modalMode, isModalVisible, isModalFetching, isDataSynced]);

    const openModal = useCallback((mode: ModalMode, postId?: number) => {
        cropper.resetCropper();
        setErrors({});
        setFormData(INITIAL_FORM_DATA);

        editorContentRef.current = "";

        setThumbnail(null);
        setSelectedPostId(postId || null);
        setIsDataSynced(false);
        setModalMode(mode);
        setIsModalVisible(true);
    }, [cropper]);

    const handleMutationSuccess = (message: string) => {
        showSuccessToast(toastRef, message);
        queryClient.invalidateQueries({queryKey: ['posts', 'search']});
        queryClient.invalidateQueries({queryKey: ['post']});
        closeModal();
    };

    const handleMutationError = (error: unknown) => {
        if (error instanceof z.ZodError) {
            const formErrors = error.errors.reduce((acc, err) => ({...acc, [err.path[0]]: err.message}), {});
            setErrors(formErrors);
        } else {
            handleApiError(error as ApiError, toastRef);
        }
    };

    const createPostMutation = useMutation({
        mutationFn: (data: ApiPostRequest) => PostService.createPost(data),
        onSuccess: () => handleMutationSuccess("Postingan berhasil dibuat"),
        onError: handleMutationError,
    });

    const updatePostMutation = useMutation({
        mutationFn: ({id, request}: { id: number, request: PostFormData }) => PostService.updatePost(id, request),
        onSuccess: () => handleMutationSuccess("Postingan berhasil diperbarui"),
        onError: handleMutationError,
    });

    const deletePostMutation = useMutation({
        mutationFn: PostService.deletePost,
        onSuccess: () => {
            showSuccessToast(toastRef, "Postingan berhasil dihapus");
            const remainingItems = totalItem - 1;
            const totalPages = Math.ceil(remainingItems / size);
            if (page > totalPages && totalPages > 0) setPage(totalPages);
            else queryClient.invalidateQueries({queryKey: ['posts', 'search']});
            closeModal();
        },
        onError: handleMutationError,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const contentToSubmit = editorContentRef.current || "";

        try {
            const dataToValidate = { ...formData, content: contentToSubmit };

            const validationSchema = modalMode === 'create' ? PostCreateSchema : PostUpdateSchema;
            const validatedData = validationSchema.parse(dataToValidate);

            if (contentToSubmit.length > 65535) {
                setErrors({ content: "Konten terlalu panjang" });
                return;
            }
            if (new Blob([contentToSubmit]).size > 314572800) {
                return;
            }

            if (modalMode === "create") {
                const request: ApiPostRequest = {
                    ...validatedData,
                    content: contentToSubmit,
                    userID: validatedData.userID ?? 0,
                    ...(thumbnail && { thumbnail }),
                };
                await createPostMutation.mutateAsync(request);
            }
            else if (modalMode === "edit" && selectedPostId) {
                const cleanedContent = reverseProcessContentForServer(contentToSubmit);
                const request: PostFormData = {
                    title: validatedData.title,
                    summary: validatedData.summary,
                    content: cleanedContent || "",
                    userID: validatedData.userID ?? formData.userID ?? 0,
                    categoryID: validatedData.categoryID,
                    ...(formData.deleteThumbnail && { deleteThumbnail: true }),
                    ...(thumbnail && { thumbnail: thumbnail }),
                };
                await updatePostMutation.mutateAsync({id: selectedPostId, request});
            }
        } catch (error) {
            handleMutationError(error);
        }
    };

    const handleDeleteConfirm = async () => {
        if (selectedPostId) await deletePostMutation.mutateAsync(selectedPostId);
    };

    const isSubmitting = createPostMutation.isPending || updatePostMutation.isPending || deletePostMutation.isPending;
    const isLoadingCombined = isModalLoading || isModalFetching;

    return {
        modalState: {
            isVisible: isModalVisible,
            mode: modalMode,
            isLoading: isLoadingCombined,
            isSubmitting,
        },
        formData,
        setFormData,
        errors,
        openModal,
        closeModal,
        handleSubmit,
        handleDeleteConfirm,
        cropperProps: { ...cropper, setThumbnail },
        options: { category: categoryOptions, user: userOptions },
        role,
        editorContentRef,
    };
};