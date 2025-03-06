import {useState} from "react";
import {z} from "zod";
import {PasswordSchema} from "../schemas/PasswordSchema";
import {PasswordService} from "../services/PasswordService";
import {useAuth} from "./useAuth.tsx";

export const usePassword = (toastRef = null) => {
    const {token} = useAuth();

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

            toastRef.current?.show({
                severity: "success",
                detail: "Password berhasil diperbarui",
                life: 2000,
            });

            setVisibleModal(false);
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(error.errors.reduce((acc, err) => ({...acc, [err.path[0]]: err.message}), {}));
            } else {
                toastRef.current?.show({
                    severity: "error",
                    detail: error.message,
                    life: 2000,
                });
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
