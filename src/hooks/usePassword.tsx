import {useState, useCallback} from "react";
import {z} from "zod";
import {PasswordSchema} from "../schemas/passwordSchema.tsx";
import {PasswordService} from "../services/passwordService.tsx";
import {handleApiError, showSuccessToast} from "../utils/toastHandler.tsx";
import {useMutation} from "@tanstack/react-query";
import {ToastRef} from "../types/toast.tsx";
import { ApiError } from "../types/api.tsx";

export const usePassword = (toastRef: ToastRef) => {
    const [visibleModal, setVisibleModal] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [data, setData] = useState({
        oldPassword: "",
        password: "",
        confirmPassword: "",
    });

    const updatePasswordMutation = useMutation({
        mutationFn: PasswordService.updatePassword,
        onSuccess: () => {
            showSuccessToast(toastRef, "Password berhasil diperbarui");
            handleCloseModal();
        },
        onError: (error: ApiError) => {
            handleApiError(error, toastRef);

            if (error?.status === 401 && error.message) {
                setErrors({oldPassword: error.message});
            }
        }
    });

    const handleVisibleModal = useCallback(() => {
        setErrors({});
        setData({oldPassword: "", password: "", confirmPassword: ""});
        setVisibleModal(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setVisibleModal(false);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            const validatedData = PasswordSchema.parse(data);
            await updatePasswordMutation.mutateAsync(validatedData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(error.errors.reduce((acc, err) => ({...acc, [err.path[0]]: err.message}), {}));
            } else {
                console.error("Caught unexpected error in handleSubmit:", error);
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
