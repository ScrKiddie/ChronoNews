import {useEffect, useState} from "react";
import {useAuth} from "./useAuth";
import {CategoryService} from "../services/categoryService.tsx";
import {CategorySchema} from "../schemas/categorySchema.tsx";
import {useAbort} from "./useAbort.tsx";
import {handleApiErrorWithRetry, showSuccessToast } from "../utils/toastHandler.tsx";
import {z} from "zod";

export const useCategory = (toastRef: any) => {
    const {token, logout} = useAuth();

    const [modalLoading, setModalLoading] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const [id, setId] = useState(null);
    const [data, setData] = useState({name: ""});

    const [errors, setErrors] = useState({});
    const [visibleDeleteModal, setVisibleDeleteModal] = useState(false)

    const [listData, setListData] = useState([]);
    const [visibleConnectionError, setVisibleConnectionError] = useState(false);
    const [visibleLoadingConnection, setVisibleLoadingConnection] = useState(false);

    const {abortController, setAbortController} = useAbort();

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenCreateModal = () => {
        setIsEditMode(false);
        setErrors({});
        setData({name: ""});
        setId(null);
        setVisibleModal(true);
    };

    const handleOpenEditModal = async (id) => {
        setIsEditMode(true);
        setId(id);
        setErrors({});
        setModalLoading(true);
        setData({name: ""});

        try {
            const categoryData = await CategoryService.getCategory(id, token, toastRef, logout);
            if (categoryData) {
                setData(categoryData);
            }
            setVisibleModal(true);
        } catch (error: unknown) {
            console.error("Failed to open edit modal:", error);
        }
        setModalLoading(false);
    };

    const handleVisibleDeleteModal = (id) => {
        setId(id);
        setVisibleDeleteModal(true)
    }

    const handleCloseModal = () => {
        setVisibleModal(false);
        setData({name: ""});
    };

    const fetchData = async () => {
        if (abortController) {
            abortController.abort();
        }

        const newAbortController = new AbortController();
        setAbortController(newAbortController);

        setVisibleConnectionError(false);
        setVisibleLoadingConnection(true);
        try {
            const response = await CategoryService.listCategories(newAbortController.signal);
            if (response && Array.isArray(response.data)) {
                setListData(response.data);
            }
        } catch (error) {
            handleApiErrorWithRetry(error,toastRef,logout,setVisibleConnectionError)
        }
        setVisibleLoadingConnection(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setErrors({});

        try {
            const validatedData = CategorySchema.parse(data);

            if (isEditMode) {
                await CategoryService.updateCategory(id, validatedData, token, toastRef, logout);
                showSuccessToast(toastRef,"Kategori berhasil diperbarui")
            } else {
                await CategoryService.createCategory(validatedData, token, toastRef, logout);
                showSuccessToast(toastRef,"Kategori berhasil dibuat")
            }
            fetchData();
            setVisibleModal(false);
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                setErrors(error.errors.reduce((acc, err) => ({...acc, [err.path[0]]: err.message}), {}));
            }else {
                console.error("An unhandled error occurred during submit:", error);
            }
        }
        setSubmitLoading(false);
    };

    const handleSubmitDelete = async () => {
        setSubmitLoading(true);
        try {
            await CategoryService.deleteCategory(id, token, toastRef, logout);
            showSuccessToast(toastRef,"Kategori berhasil dihapus")
            if (fetchData) {
                fetchData()
            }
            setVisibleDeleteModal(false)
        } catch (error: unknown) {
            console.error("An unhandled error occurred during delete:", error);
        } finally {
            setSubmitLoading(false);
        }
    };

    return {
        toastRef,
        modalLoading,
        visibleModal,
        submitLoading,
        data,
        listData,
        errors,
        isEditMode,
        handleOpenCreateModal,
        handleOpenEditModal,
        handleCloseModal,
        handleSubmit,
        setData,
        visibleLoadingConnection,
        visibleConnectionError,
        fetchData,
        handleVisibleDeleteModal,
        setVisibleDeleteModal,
        visibleDeleteModal,
        handleSubmitDelete
    };
};
