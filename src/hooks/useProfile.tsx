import { useState, useCallback, useEffect } from 'react';
import { z } from 'zod';
import { ProfileService } from '../lib/api/profileService.tsx';
import { ProfileSchema } from '../schemas/profileSchema.tsx';
import { useCropper } from './useCropper';
import { handleApiError, showSuccessToast } from '../lib/utils/toastHandler.tsx';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ToastRef } from '../types/toast.tsx';
import { ApiError } from '../types/api.tsx';
import { ProfileFormData } from '../types/user.tsx';

const INITIAL_FORM_DATA: ProfileFormData = {
    name: '',
    email: '',
    phoneNumber: '',
    deleteProfilePicture: false,
    profilePicture: '',
};

export const useProfile = (toastRef: ToastRef) => {
    const queryClient = useQueryClient();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formData, setFormData] = useState<Partial<ProfileFormData>>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    const cropper = useCropper({
        setVisibleModal: setIsModalVisible,
        setProfilePicture,
        toastRef,
    });

    const closeModal = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    const {
        data: profileData,
        isLoading: isProfileLoading,
        isError,
        error,
        isSuccess,
    } = useQuery({
        queryKey: ['profile', 'me'],
        queryFn: ProfileService.getCurrentUser,
        enabled: isModalVisible,
        retry: false,
    });

    useEffect(() => {
        if (isModalVisible && isSuccess && profileData) {
            setFormData(profileData);
        }
    }, [profileData, isModalVisible, isSuccess]);

    useEffect(() => {
        if (isError && error) {
            handleApiError(error as ApiError, toastRef);
            closeModal();
        }
    }, [isError, error, toastRef, closeModal]);

    const openModal = useCallback(() => {
        cropper.resetCropper();
        setErrors({});
        setFormData(INITIAL_FORM_DATA);
        setProfilePicture(null);
        queryClient.removeQueries({ queryKey: ['profile', 'me'] });
        setIsModalVisible(true);
    }, [cropper, queryClient]);

    const handleMutationError = useCallback(
        (error: ApiError | z.ZodError) => {
            if (error instanceof z.ZodError) {
                const formErrors = error.errors.reduce(
                    (acc, err) => ({ ...acc, [err.path[0]]: err.message }),
                    {}
                );
                setErrors(formErrors);
            } else {
                handleApiError(error, toastRef);

                if ('status' in error && error.status === 409 && error.message) {
                    if (error.message.toLowerCase().includes('email')) {
                        setErrors((prev) => ({ ...prev, email: error.message }));
                    } else if (
                        error.message.toLowerCase().includes('telepon') ||
                        error.message.toLowerCase().includes('phone')
                    ) {
                        setErrors((prev) => ({ ...prev, phoneNumber: error.message }));
                    }
                }
            }
        },
        [toastRef]
    );

    const updateProfileMutation = useMutation({
        mutationFn: ProfileService.updateCurrentUser,
        onSuccess: () => {
            showSuccessToast(toastRef, 'Profil berhasil diperbarui');
            queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            closeModal();
        },
        onError: handleMutationError,
    });

    const handleSubmit = useCallback(
        async (e?: React.FormEvent) => {
            e?.preventDefault();
            setErrors({});

            try {
                const validatedData = ProfileSchema.parse(formData);
                const request = {
                    ...validatedData,
                    ...(formData.deleteProfilePicture === true
                        ? { deleteProfilePicture: true }
                        : {}),
                    ...(profilePicture instanceof File ? { profilePicture } : {}),
                };
                await updateProfileMutation.mutateAsync(request);
            } catch (error) {
                if (error instanceof z.ZodError) {
                    handleMutationError(error);
                }
            }
        },
        [formData, profilePicture, updateProfileMutation, handleMutationError]
    );

    return {
        modalState: {
            isVisible: isModalVisible && isSuccess,
            isLoading: isModalVisible && isProfileLoading,
            isSubmitting: updateProfileMutation.isPending,
        },
        formData,
        setFormData,
        errors,
        openModal,
        closeModal,
        handleSubmit,
        cropperProps: {
            ...cropper,
            setProfilePicture,
        },
    };
};
