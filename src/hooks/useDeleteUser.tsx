import { useState } from "react";
import { UserService } from "../services/UserService";
import {useAuth} from "./useAuth.tsx"; // Sesuaikan path

export const useDeleteUser = (toast, fetchData=null) => {
    const { token } = useAuth();
    const [submitLoading, setSubmitLoading] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false)
    const [id, setId] = useState(0)

    const handleVisibleModal = (id)=>{
        setId(id);
        setVisibleModal(true)
    }
    const handleSubmit = async () => {
        setSubmitLoading(true);
        try {
            await UserService.deleteUser(id, token);
            toast?.current?.show({ severity: "success", detail: "User berhasil dihapus" });
            if (fetchData){
                fetchData()
            }
            setVisibleModal(false)
        } catch (error) {
            toast?.current?.show({ severity: "error", detail: error.message });
        } finally {
            setSubmitLoading(false);
        }
    };

    return { handleSubmit, submitLoading, visibleModal, handleVisibleModal, setVisibleModal };
};
