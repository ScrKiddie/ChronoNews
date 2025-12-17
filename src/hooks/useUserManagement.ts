import { useState, useCallback, useEffect, FormEvent } from 'react';
import { z } from 'zod';
import { UserService } from '../services/userService.ts';
import { UserCreateSchema, UserUpdateSchema } from '../schemas/userSchema.ts';
import { useCropper } from './useCropper';
import { handleApiError, showSuccessToast } from '../utils/toastUtils.ts';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ToastRef } from '../types/toast.ts';
import { ApiError } from '../types/api.ts';
import { User, UserUpdateRequest, UserManagementFormData } from '../types/user.ts';

type ModalMode = 'create' | 'edit' | 'delete' | null;

interface UseUserManagementProps {
    toastRef: ToastRef;
    pagination: {
        page: number;
        setPage: (page: number | ((prev: number) => number)) => void;
        totalItem: number;
        size: number;
    };
}

const INITIAL_FORM_DATA: UserManagementFormData = {
    name: '',
    phoneNumber: '',
    email: '',
    role: '',
    deleteProfilePicture: false,
    profilePicture: '',
};

export const useUserManagement = ({ toastRef, pagination }: UseUserManagementProps) => {
    const { page, setPage, totalItem, size } = pagination;
    const queryClient = useQueryClient();

    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formData, setFormData] = useState<Partial<UserManagementFormData>>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    const cropper = useCropper({
        setVisibleModal: setIsModalVisible,
        setProfilePicture,
        toastRef,
    });

    const closeModal = useCallback(() => {
        setIsModalVisible(false);
        setModalMode(null);
        setSelectedUserId(null);
        setFormData(INITIAL_FORM_DATA);
        setErrors({});
    }, []);

    const {
        data: userDataForEdit,
        isLoading: isModalLoading,
        isError,
        error,
    } = useQuery<User>({
        queryKey: ['user', selectedUserId],
        queryFn: () => UserService.getUser(selectedUserId!),
        enabled: modalMode === 'edit' && !!selectedUserId,
        retry: false,
    });

    useEffect(() => {
        if (modalMode === 'edit') {
            if (isError && error) {
                const apiError: ApiError = {
                    message: (error as Error).message || 'An unexpected error occurred.',
                };
                handleApiError(apiError, toastRef);
                closeModal();
            } else if (userDataForEdit && !isModalLoading) {
                setFormData({
                    name: userDataForEdit.name,
                    phoneNumber: userDataForEdit.phoneNumber,
                    email: userDataForEdit.email,
                    role: userDataForEdit.role,
                    profilePicture: userDataForEdit.profilePicture,
                    deleteProfilePicture: false,
                });
                setIsModalVisible(true);
            }
        }
    }, [userDataForEdit, modalMode, isModalLoading, isError, error, toastRef, closeModal]);

    const openModal = useCallback(
        (mode: ModalMode, userId?: number) => {
            cropper.resetCropper();
            setErrors({});
            setFormData(INITIAL_FORM_DATA);
            setProfilePicture(null);
            setSelectedUserId(userId || null);
            setModalMode(mode);
            if (mode !== 'edit') {
                setIsModalVisible(true);
            }
        },
        [cropper]
    );

    const handleMutationError = useCallback(
        (error: unknown) => {
            if (error instanceof z.ZodError) {
                const formErrors = error.errors.reduce(
                    (acc, err) => ({ ...acc, [err.path[0]]: err.message }),
                    {}
                );
                setErrors(formErrors);
            } else {
                const apiError = error as ApiError;
                if (apiError?.status !== 409) {
                    handleApiError(apiError, toastRef);
                }

                if (apiError?.status === 409 && apiError.message) {
                    if (apiError.message.toLowerCase().includes('email')) {
                        setErrors((prev) => ({ ...prev, email: apiError.message }));
                    } else if (
                        apiError.message.toLowerCase().includes('telepon') ||
                        apiError.message.toLowerCase().includes('phone')
                    ) {
                        setErrors((prev) => ({ ...prev, phoneNumber: apiError.message }));
                    }
                }
            }
        },
        [toastRef]
    );

    const createUserMutation = useMutation({
        mutationFn: UserService.createUser,
        onSuccess: () => {
            showSuccessToast(toastRef, 'Pengguna berhasil dibuat');
            queryClient.invalidateQueries({ queryKey: ['users'] });
            closeModal();
        },
        onError: handleMutationError,
    });

    const updateUserMutation = useMutation({
        mutationFn: ({ id, request }: { id: number; request: UserUpdateRequest }) =>
            UserService.updateUser(id, request),
        onSuccess: () => {
            showSuccessToast(toastRef, 'Pengguna berhasil diperbarui');
            closeModal();
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: handleMutationError,
    });

    const deleteUserMutation = useMutation({
        mutationFn: UserService.deleteUser,
        onSuccess: () => {
            showSuccessToast(toastRef, 'Pengguna berhasil dihapus');
            const remainingItems = totalItem - 1;
            const remainingPages = Math.ceil(remainingItems / size);
            if (remainingItems > 0 && page > remainingPages) {
                setPage(remainingPages);
            } else {
                queryClient.invalidateQueries({ queryKey: ['users'] });
            }
            closeModal();
        },
        onError: handleMutationError,
    });

    const handleSubmit = useCallback(
        async (e?: FormEvent) => {
            e?.preventDefault();

            try {
                switch (modalMode) {
                    case 'create': {
                        const validatedData = UserCreateSchema.parse(formData);
                        const request = {
                            ...validatedData,
                            ...(profilePicture instanceof File ? { profilePicture } : {}),
                        };
                        await createUserMutation.mutateAsync(request);
                        break;
                    }
                    case 'edit': {
                        if (!selectedUserId) throw new Error('No user selected for update');
                        const validatedData = UserUpdateSchema.parse(formData);
                        const request: UserUpdateRequest = {
                            ...validatedData,
                            ...(formData.deleteProfilePicture === true
                                ? { deleteProfilePicture: true }
                                : {}),
                            ...(profilePicture instanceof File ? { profilePicture } : {}),
                        };
                        await updateUserMutation.mutateAsync({
                            id: selectedUserId,
                            request,
                        });
                        break;
                    }
                    case 'delete': {
                        if (!selectedUserId) throw new Error('No user selected for deletion');
                        await deleteUserMutation.mutateAsync(selectedUserId);
                        break;
                    }
                    default:
                        throw new Error('Invalid modal mode');
                }
            } catch (error) {
                if (error instanceof z.ZodError) {
                    handleMutationError(error);
                }
            }
        },
        [
            modalMode,
            formData,
            profilePicture,
            selectedUserId,
            createUserMutation,
            updateUserMutation,
            deleteUserMutation,
            handleMutationError,
        ]
    );

    const isSubmitting =
        createUserMutation.isPending ||
        updateUserMutation.isPending ||
        deleteUserMutation.isPending;

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
