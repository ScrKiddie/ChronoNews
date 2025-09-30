import {useState} from "react";
import {UserService} from "../services/userService.tsx";
import {useAuth} from "./useAuth.tsx";
import {showSuccessToast} from "../utils/toastHandler.tsx";

export const useDeleteUser = (toastRef, fetchData, page, setPage, totalItem, size) => {
    const {token, logout} = useAuth();
    const [submitLoading, setSubmitLoading] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);
    const [id, setId] = useState(0);

    const handleVisibleModal = (id) => {
        setId(id);
        setVisibleModal(true);
    };

    const handleSubmit = async () => {
        setSubmitLoading(true);
        try {
            await UserService.deleteUser(id, token, toastRef, logout);
            showSuccessToast(toastRef, "User berhasil dihapus")

            const remainingItems = totalItem - 1;
            const remainingPages = Math.ceil(remainingItems / size);

            if (remainingItems > 0 && remainingPages < page) {
                setPage((prev) => Math.max(1, prev - 1));
            }

            fetchData();
            setVisibleModal(false);
        } catch (error) {
            console.error("An unhandled error occurred during user deletion:", error);
        } finally {
            setSubmitLoading(false);
        }
    };

    return {handleSubmit, submitLoading, visibleModal, handleVisibleModal, setVisibleModal};
};
