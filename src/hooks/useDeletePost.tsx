import { useState } from "react";
import { PostService } from "../services/PostService";
import { useAuth } from "./useAuth.tsx";

export const useDeletePost = (toast, fetchData, page, setPage, totalItem, size) => {
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

            const remainingItems = totalItem - 1; // Total postingan setelah dihapus
            const remainingPages = Math.ceil(remainingItems / size); // Hitung ulang total halaman

            if (remainingItems > 0 && remainingPages < page) {
                setPage((prev) => Math.max(1, prev - 1)); // Jika halaman kosong dan bukan halaman 1, maka mundur
            }

            fetchData(); // Ambil data terbaru setelah penghapusan
            setVisibleModal(false);
        } catch (error) {
            toast?.current?.show({ severity: "error", detail: error.message });
        } finally {
            setSubmitLoading(false);
        }
    };

    return { handleSubmit, submitLoading, visibleModal, handleVisibleModal, setVisibleModal };
};
