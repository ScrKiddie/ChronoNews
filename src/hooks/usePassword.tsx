import { useState, useCallback, FormEvent } from 'react';
import { z } from 'zod';
import { PasswordSchema } from '../schemas/passwordSchema.tsx';
import { PasswordService } from '../lib/api/passwordService.tsx';
import { handleApiError, showSuccessToast } from '../lib/utils/toastHandler.tsx';
import { useMutation } from '@tanstack/react-query';
import { ToastRef } from '../types/toast.tsx';
import { ApiError } from '../types/api.tsx';

type PasswordData = z.infer<typeof PasswordSchema>;

const INITIAL_DATA: PasswordData = {
    oldPassword: '',
    password: '',
    confirmPassword: '',
};

export const usePassword = (toastRef: ToastRef) => {
    const [visibleModal, setVisibleModal] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [data, setData] = useState<PasswordData>(INITIAL_DATA);

    const updatePasswordMutation = useMutation({
        mutationFn: PasswordService.updatePassword,
        onSuccess: () => {
            showSuccessToast(toastRef, 'Password berhasil diperbarui');
            handleCloseModal();
        },
        onError: (error: ApiError) => {
            handleApiError(error, toastRef);

            if (error?.status === 401 && error.message) {
                setErrors({ oldPassword: error.message });
            }
        },
    });

    const handleVisibleModal = useCallback(() => {
        setErrors({});
        setData(INITIAL_DATA);
        setVisibleModal(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setVisibleModal(false);
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            const validatedData = PasswordSchema.parse(data);
            await updatePasswordMutation.mutateAsync(validatedData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(
                    error.errors.reduce((acc, err) => ({ ...acc, [err.path[0]]: err.message }), {})
                );
            } else {
                void error;
            }
        }
    };

    return {
        toastRef,
        visibleModal,
        submitLoading: updatePasswordMutation.isPending,
        errors,
        data,
        handleVisibleModal,
        handleCloseModal,
        handleSubmit,
        setData,
    };
};
