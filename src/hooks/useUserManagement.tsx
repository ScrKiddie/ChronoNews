import {useState, useCallback, useEffect} from "react";
import {z} from "zod";
import {UserService} from "../services/userService.tsx";
import {UserCreateSchema, UserUpdateSchema} from "../schemas/userSchema.tsx";
import {useCropper} from "./useCropper";
import {handleApiError, showSuccessToast} from "../utils/toastHandler.tsx";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {ToastRef} from "../types/toast.tsx";
import {ApiError} from "../types/api.tsx";
import {UserFormData, UserUpdateRequest} from "../types/user.tsx"

type ModalMode = "create" | "edit" | "delete" | null;

interface UseUserManagementProps {
    toastRef: ToastRef;
    pagination: {
        page: number;
        setPage: (page: number | ((prev: number) => number)) => void;
        totalItem: number;
        size: number;
    };
}

const INITIAL_FORM_DATA: UserFormData = {
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    role: "",
    deleteProfilePicture: false,
};

export const useUserManagement = ({toastRef, pagination}: UseUserManagementProps) => {
    const {page, setPage, totalItem, size} = pagination;
    const queryClient = useQueryClient();

    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formData, setFormData] = useState<UserFormData>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    const cropper = useCropper({
        setVisibleModal: setIsModalVisible,
        setProfilePicture,
        toastRef
    });

    const closeModal = useCallback(() => {
        setIsModalVisible(false);
        setTimeout(() => {
            setModalMode(null);
            setSelectedUserId(null);
            setFormData(INITIAL_FORM_DATA);
            setErrors({});
        }, 300);
    }, []);

    const {
        data: userDataForEdit,
        isLoading: isModalLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['user', selectedUserId],
        queryFn: () => UserService.getUser(selectedUserId!),
        enabled: modalMode === 'edit' && !!selectedUserId && isModalVisible,
        retry: false,
    });

    useEffect(() => {
        if (isError && error) {
            const apiError: ApiError = {
                message: (error as Error).message || "An unexpected error occurred.",
            };
            handleApiError(apiError, toastRef);
            closeModal();
        }
    }, [isError, error, toastRef, closeModal]);

    useEffect(() => {
        if (userDataForEdit) {
            setFormData(userDataForEdit);
        }
    }, [userDataForEdit]);

    const openModal = useCallback((mode: ModalMode, userId?: number) => {
        cropper.resetCropper();
        setErrors({});
        setFormData(INITIAL_FORM_DATA);
        setProfilePicture(null);
        setSelectedUserId(userId || null);
        setModalMode(mode);
        setIsModalVisible(true);
    }, [cropper]);

    const handleMutationError = (error: unknown) => {
        if (error instanceof z.ZodError) {
            const formErrors = error.errors.reduce((acc, err) => ({...acc, [err.path[0]]: err.message}), {});
            setErrors(formErrors);
        } else {
            const apiError = error as ApiError;
            if (apiError && typeof apiError.message === 'string') {
                handleApiError(apiError, toastRef);
                if (apiError.status === 409) {
                    if (apiError.message.toLowerCase().includes('email')) {
                        setErrors({ email: apiError.message });
                    } else if (apiError.message.toLowerCase().includes('telepon') || apiError.message.toLowerCase().includes('phone')) {
                        setErrors({ phoneNumber: apiError.message });
                    }
                }
            } else {
                const fallbackError: ApiError = { message: "Terjadi kesalahan yang tidak diketahui." };
                handleApiError(fallbackError, toastRef);
            }
        }
    };

    const createUserMutation = useMutation({
        mutationFn: UserService.createUser,
        onSuccess: () => {
            showSuccessToast(toastRef, "Pengguna berhasil dibuat");
            queryClient.invalidateQueries({queryKey: ['users']});
            closeModal();
        },
        onError: handleMutationError,
    });

    const updateUserMutation = useMutation({
        mutationFn: ({id, request}: {
            id: number,
            request: UserUpdateRequest
        }) => UserService.updateUser(id, request),
        onSuccess: (_, variables) => {
            showSuccessToast(toastRef, "Pengguna berhasil diperbarui");
            queryClient.invalidateQueries({queryKey: ['users']});
            queryClient.invalidateQueries({queryKey: ['user', variables.id]});
            closeModal();
        },
        onError: handleMutationError,
    });

    const deleteUserMutation = useMutation({
        mutationFn: UserService.deleteUser,
        onSuccess: () => {
            showSuccessToast(toastRef, "Pengguna berhasil dihapus");
            const remainingItems = totalItem - 1;
            const remainingPages = Math.ceil(remainingItems / size);
            if (remainingItems > 0 && page > remainingPages) {
                setPage(remainingPages);
            } else {
                queryClient.invalidateQueries({queryKey: ['users']});
            }
            closeModal();
        },
        onError: handleMutationError,
    });

    const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        e?.preventDefault();
        setErrors({});

        try {
            switch (modalMode) {
                case "create": {
                    const validatedData = UserCreateSchema.parse(formData);
                    const request = {
                        ...validatedData,
                        ...(profilePicture instanceof File ? {profilePicture} : {}),
                    };
                    await createUserMutation.mutateAsync(request);
                    break;
                }
                case "edit": {
                    if (!selectedUserId) throw new Error("No user selected for update");
                    const validatedData = UserUpdateSchema.parse(formData);
                    const request: UserUpdateRequest = {
                        ...validatedData,
                        ...(formData.deleteProfilePicture === true ? {deleteProfilePicture: true} : {}),
                        ...(profilePicture instanceof File ? {profilePicture} : {}),
                    };
                    await updateUserMutation.mutateAsync({id: selectedUserId, request});
                    break;
                }
                case "delete": {
                    if (!selectedUserId) throw new Error("No user selected for deletion");
                    await deleteUserMutation.mutateAsync(selectedUserId);
                    break;
                }
                default:
                    throw new Error("Invalid modal mode");
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                handleMutationError(error);
            }
        }
    }, [
        modalMode, formData, profilePicture, selectedUserId,
        createUserMutation, updateUserMutation, deleteUserMutation,
        toastRef, closeModal
    ]);

    const isSubmitting = createUserMutation.isPending || updateUserMutation.isPending || deleteUserMutation.isPending;

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
        cropperProps: cropper,
        setProfilePicture,
    };
};
