import {useState} from "react";
import {z} from "zod";
import {PasswordSchema} from "../schemas/passwordSchema.tsx";
import {PasswordService} from "../services/passwordService.tsx";
import {useAuth} from "./useAuth.tsx";
import { handleApiError, showSuccessToast } from "../utils/toastHandler.tsx";

export const usePassword = (toastRef) => {
    const {token, logout} = useAuth();

    const [visibleModal, setVisibleModal] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [data, setData] = useState({
        oldPassword: "",
        password: "",
        confirmPassword: "",
    });

    const handleVisibleModal = () => {
        setErrors({});
        setData({oldPassword: "", password: "", confirmPassword: ""});
        setVisibleModal(true);
    };

    const handleCloseModal = () => setVisibleModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setErrors({});

        try {
            const validatedData = PasswordSchema.parse(data);

            await PasswordService.updatePassword(validatedData, token);
            showSuccessToast(toastRef,"Password berhasil diperbarui" )

            setVisibleModal(false);
        } catch (error) {
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
        visibleModal,
        submitLoading,
        errors,
        data,
        handleVisibleModal,
        handleCloseModal,
        handleSubmit,
        setData,
    };
};
