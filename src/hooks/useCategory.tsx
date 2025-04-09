import {useEffect, useState} from "react";
import {z} from "zod";
import {useAuth} from "./useAuth";
import {CategoryService} from "../services/CategoryService";
import {CategorySchema} from "../schemas/CategorySchema";
import {useAbort} from "./useAbort.tsx";

export const useCategory = (toastRef = null) => {
    const {token} = useAuth();


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

    const { abortController, setAbortController } = useAbort();


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
            const categoryData = await CategoryService.getCategory(id, token);
            if (categoryData) {
                setData(categoryData);
            }
            setVisibleModal(true);
        } catch (error) {
            toastRef?.current?.show({
                severity: "error",
                detail: error.message,
                life: 2000,
            });
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
            if (!error.response) {
                setVisibleConnectionError(true);
            } else {
                toastRef?.current?.show({
                    severity: "error",
                    detail: error.message,
                    life: 2000,
                });
            }
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
                await CategoryService.updateCategory(id, validatedData, token);
                toastRef?.current?.show({
                    severity: "success",
                    detail: "Kategori berhasil diperbarui",
                    life: 2000,
                });
            } else {
                await CategoryService.createCategory(validatedData, token);
                toastRef?.current?.show({
                    severity: "success",
                    detail: "Kategori berhasil dibuat",
                    life: 2000,
                });
            }

            fetchData();
            setVisibleModal(false);
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(error.errors.reduce((acc, err) => ({...acc, [err.path[0]]: err.message}), {}));
            } else {
                toastRef?.current?.show({
                    severity: "error",
                    detail: error.message,
                    life: 2000,
                });
            }
        }
        setSubmitLoading(false);
    };

    const handleSubmitDelete = async () => {
        setSubmitLoading(true);
        try {
            await CategoryService.deleteCategory(id, token);
            toastRef?.current?.show({severity: "success", detail: "Kategori berhasil dihapus"});
            if (fetchData) {
                fetchData()
            }
            setVisibleDeleteModal(false)
        } catch (error) {
            toastRef?.current?.show({severity: "error", detail: error.message});
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
