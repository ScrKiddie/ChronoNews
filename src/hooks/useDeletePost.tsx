import {useState} from "react";
import {PostService} from "../services/postService.tsx";
import {useAuth} from "./useAuth.tsx";
import {showSuccessToast} from "../utils/toastHandler.tsx";

export const useDeletePost = (toastRef, fetchData, page, setPage, totalItem, size) => {
    const {token,logout} = useAuth();
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
            await PostService.deletePost(id, token, toastRef, logout);
            showSuccessToast(toastRef, "Post berhasil dihapus");

            const remainingItems = totalItem - 1;
            const remainingPages = Math.ceil(remainingItems / size);

            if (remainingItems > 0 && remainingPages < page) {
                setPage((prev) => Math.max(1, prev - 1));
            }

            fetchData();
            setVisibleModal(false);
        } catch (error) {
            console.error("An unexpected error occurred during post deletion:", error);
        } finally {
            setSubmitLoading(false);
        }
    };

    return {handleSubmit, submitLoading, visibleModal, handleVisibleModal, setVisibleModal};
};
