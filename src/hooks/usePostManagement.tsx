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
import {ApiPostRequest, DropdownOption, PostFormData} from "../types/post.tsx";
import { User } from "../types/user.tsx";
import {ApiError} from "../types/api.tsx";
import {Category} from "../types/category.tsx";

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
    const errorHandledRef = useRef(false);

    const cropper = useCropper({
        setVisibleModal: setIsModalVisible,
        setProfilePicture: setThumbnail,
        toastRef,
        width: 1200,
        height: 675,
    });

    const {
        data: postDataForEdit,
        isLoading: isPostDataLoading,
        isFetching: isPostDataFetching,
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
        enabled: modalMode === 'edit' && !!selectedPostId,
        gcTime: 0,
        staleTime: 0,
    });

    const closeModal = useCallback(() => {
        setIsModalVisible(false);
        setModalMode(null);
        setIsDataSynced(false);
        setTimeout(() => {
            if (selectedPostId) {
                queryClient.removeQueries({ queryKey: ['post', selectedPostId] });
            }

            setSelectedPostId(null);
            setFormData(INITIAL_FORM_DATA);
            editorContentRef.current = "";
            setThumbnail(null);
            setErrors({});
            errorHandledRef.current = false;
        }, 300);
    }, [selectedPostId, queryClient]);

    const {
        data: categoryOptions = [],
        isLoading: areCategoriesLoading,
        isFetching: areCategoriesFetching,
        isError: areCategoriesError,
        error: categoriesError
    } = useQuery({
        queryKey: ['categories'],
        queryFn: () => CategoryService.listCategories().then(res =>
            res.data.map((c: Category) => ({ label: c.name, value: c.id }))
        ),
        enabled: modalMode === 'create' || modalMode === 'edit',
    });

    const {
        data: userOptions = [],
        isLoading: areUsersLoading,
        isFetching: areUsersFetching,
        isError: areUsersError,
        error: usersError
    } = useQuery<DropdownOption[]>({
        queryKey: ['users', 'all'],
        queryFn: () => UserService.searchUser().then(res => [
            {label: "Posting Sebagai Diri Sendiri", value: 0},
            ...res.data.map((u: User) => ({
                label: `${u.name} - ${u.phoneNumber} - ${u.email} - ${u.role}`,
                value: u.id
            }))
        ]),
        enabled: (modalMode === 'create' || modalMode === 'edit') && role === 'admin',
    });

    useEffect(() => {
        if (modalMode === 'edit') {
            if (isPostError) {
                handleApiError(postError as ApiError, toastRef);
                closeModal();
            } else if (postDataForEdit && isPostSuccess && !isPostDataFetching && !isDataSynced) {
                setFormData({
                    title: postDataForEdit.title,
                    summary: postDataForEdit.summary,
                    content: postDataForEdit.content,
                    userID: postDataForEdit.userID,
                    categoryID: postDataForEdit.categoryID,
                    deleteThumbnail: false,
                    thumbnail: postDataForEdit.thumbnail
                });
                editorContentRef.current = postDataForEdit.content;
                setIsDataSynced(true);
                setIsModalVisible(true);
            } else if (isPostDataLoading || isPostDataFetching) {
                setIsModalVisible(false);
            }
        } else if (modalMode === 'create') {
            const categoriesReady = !areCategoriesLoading && !areCategoriesFetching && !areCategoriesError;
            const usersReady = role !== 'admin' || (!areUsersLoading && !areUsersFetching && !areUsersError);

            if (areCategoriesError || (role === 'admin' && areUsersError)) {
                if (!errorHandledRef.current) {
                    const errorsToShow: ApiError[] = [];
                    if (areCategoriesError) errorsToShow.push(categoriesError as ApiError);
                    if (role === 'admin' && areUsersError) errorsToShow.push(usersError as ApiError);
                    if (errorsToShow.length > 0) {
                        handleApiError(errorsToShow[0], toastRef);
                        errorHandledRef.current = true;
                    }
                }
                closeModal();
            } else if (categoriesReady && usersReady) {
                setIsModalVisible(true);
            } else if (areCategoriesLoading || areCategoriesFetching || areUsersLoading || areUsersFetching) {
                setIsModalVisible(false);
            }
        } else if (modalMode === null) {
            setIsModalVisible(false);
        }
    }, [
        modalMode,
        postDataForEdit, isPostSuccess, isPostError, isPostDataLoading, isPostDataFetching, isDataSynced, postError,
        areCategoriesLoading, areCategoriesFetching, areCategoriesError, categoriesError,
        areUsersLoading, areUsersFetching, areUsersError, usersError,
        role, toastRef, closeModal
    ]);


    const openModal = useCallback((mode: ModalMode, postId?: number) => {
        cropper.resetCropper();
        setErrors({});
        setFormData(INITIAL_FORM_DATA);
        editorContentRef.current = "";
        setThumbnail(null);
        setSelectedPostId(postId || null);
        setIsDataSynced(false);
        errorHandledRef.current = false;
        setModalMode(mode);
        if (mode === 'delete') {
            setIsModalVisible(true);
        }
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
                    userID: validatedData.userID ?? 0,
                    ...(thumbnail && { thumbnail }),
                };
                await createPostMutation.mutateAsync(request);
            }
            else if (modalMode === "edit" && selectedPostId) {
                const cleanedContent = reverseProcessContentForServer(contentToSubmit);
                const request: PostFormData = {
                    ...validatedData,
                    content: cleanedContent || "",
                    userID: validatedData.userID ?? formData.userID ?? 0,
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

    const isModalLoadingCombined = isPostDataLoading || isPostDataFetching ||
        (modalMode === 'create' && (areCategoriesLoading || areCategoriesFetching || (role === 'admin' && (areUsersLoading || areUsersFetching))));

    return {
        modalState: {
            isVisible: isModalVisible,
            mode: modalMode,
            isLoading: isModalLoadingCombined,
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