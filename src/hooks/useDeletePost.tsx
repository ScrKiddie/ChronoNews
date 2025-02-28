import { useState } from "react";
import { PostService } from "../services/PostService";
import { useAuth } from "./useAuth.tsx";

export const useDeletePost = (toast, fetchData = null) => {
    const { token } = useAuth();
    const [submitLoading, setSubmitLoading] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);
    const [id, setId] = useState(0);

    const handleVisibleModal = (postId) => {
        setId(postId);
        setVisibleModal(true);
    };

    const handleSubmit = async () => {
        setSubmitLoading(true);
        try {
            await PostService.deletePost(id, token);
            toast?.current?.show({ severity: "success", detail: "Post berhasil dihapus" });
            if (fetchData) {
                fetchData();
            }
            setVisibleModal(false);
        } catch (error) {
            toast?.current?.show({ severity: "error", detail: error.message });
        } finally {
            setSubmitLoading(false);
        }
    };

    return { handleSubmit, submitLoading, visibleModal, handleVisibleModal, setVisibleModal };
};
