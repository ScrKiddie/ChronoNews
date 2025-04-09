import {useState} from "react";
import {UserService} from "../services/UserService";
import {useAuth} from "./useAuth.tsx";

export const useDeleteUser = (toastRef, fetchData, page, setPage, totalItem, size) => {
    const {token,logout} = useAuth();
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
            await UserService.deleteUser(id, token);
            toastRef?.current?.show({severity: "success", detail: "User berhasil dihapus"});

            const remainingItems = totalItem - 1;
            const remainingPages = Math.ceil(remainingItems / size);

            if (remainingItems > 0 && remainingPages < page) {
                setPage((prev) => Math.max(1, prev - 1));
            }

            fetchData();
            setVisibleModal(false);
        } catch (error) {
            if (error.message === "Unauthorized"){
                toastRef.current.show({severity: "error", detail: "Sesi berakhir, silahkan login kembali"});
                logout()
            } else {
                toastRef?.current?.show({
                    severity: "error",
                    detail: error.message,
                    life: 2000,
                });
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    return {handleSubmit, submitLoading, visibleModal, handleVisibleModal, setVisibleModal};
};
