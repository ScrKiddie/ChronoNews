import {useState, useCallback, RefObject, useEffect} from "react";
import {z} from "zod";
import {useAuth} from "./useAuth";
import {CategoryService} from "../services/categoryService.tsx";
import {CategorySchema} from "../schemas/categorySchema.tsx";
import {useAbort} from "./useAbort.tsx";
import {handleApiErrorWithRetry, showSuccessToast} from "../utils/toastHandler.tsx";

type ModalMode = "create" | "edit" | "delete" | null;

interface CategoryFormData {
    name: string;
}

interface UseCategoryProps {
    toastRef: RefObject<any>;
}

const INITIAL_FORM_DATA: CategoryFormData = {
    name: "",
};

export const useCategory = ({toastRef}: UseCategoryProps) => {
    const {token, logout} = useAuth();

    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [formData, setFormData] = useState<CategoryFormData>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const [listData, setListData] = useState([]);
    const [visibleConnectionError, setVisibleConnectionError] = useState(false);
    const [visibleLoadingConnection, setVisibleLoadingConnection] = useState(false);
    const {abortController, setAbortController} = useAbort();

    const fetchData = useCallback(async () => {
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
            handleApiErrorWithRetry(error, toastRef, logout, setVisibleConnectionError);
        } finally {
            setVisibleLoadingConnection(false);
        }
    }, [abortController, setAbortController, toastRef, logout]);

    useEffect(() => {
        fetchData();
    }, []);


    const openModal = useCallback(async (mode: ModalMode, categoryId?: number) => {
        setErrors({});
        setFormData(INITIAL_FORM_DATA);
        setModalMode(mode);

        if ((mode === "edit" || mode === "delete") && categoryId) {
            setSelectedCategoryId(categoryId);
        }

        if (mode === "edit" && categoryId) {
            setIsModalLoading(true);
            setIsModalVisible(true);
            try {
                const categoryData = await CategoryService.getCategory(categoryId, token, toastRef, logout);
                if (categoryData) {
                    setFormData(categoryData);
                }
            } catch (error) {
                console.error("Failed to fetch category data:", error);
                setIsModalVisible(false);
            } finally {
                setIsModalLoading(false);
            }
        } else {
            setIsModalVisible(true);
        }
    }, [token, logout, toastRef]);

    const closeModal = useCallback(() => {
        setIsModalVisible(false);
        setTimeout(() => {
            setModalMode(null);
            setSelectedCategoryId(null);
        }, 300);
    }, []);

    const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        e?.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            switch (modalMode) {
                case "create": {
                    const validatedData = CategorySchema.parse(formData);
                    await CategoryService.createCategory(validatedData, token, toastRef, logout);
                    showSuccessToast(toastRef, "Kategori berhasil dibuat");
                    break;
                }
                case "edit": {
                    if (!selectedCategoryId) throw new Error("No category selected for update");
                    const validatedData = CategorySchema.parse(formData);
                    await CategoryService.updateCategory(selectedCategoryId, validatedData, token, toastRef, logout);
                    showSuccessToast(toastRef, "Kategori berhasil diperbarui");
                    break;
                }
                case "delete": {
                    if (!selectedCategoryId) throw new Error("No category selected for deletion");
                    await CategoryService.deleteCategory(selectedCategoryId, token, toastRef, logout);
                    showSuccessToast(toastRef, "Kategori berhasil dihapus");
                    break;
                }
                default:
                    throw new Error("Invalid modal mode");
            }
            
            fetchData();
            closeModal();

        } catch (error) {
            if (error instanceof z.ZodError) {
                const formErrors = error.errors.reduce((acc, err) => ({...acc, [err.path[0]]: err.message}), {});
                setErrors(formErrors);
            } else {
                console.error("An unhandled error occurred:", error);
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [
        modalMode, formData, selectedCategoryId, token, logout,
        fetchData, closeModal, toastRef
    ]);

    return {
        modalState: {
            isVisible: isModalVisible,
            mode: modalMode,
            isLoading: isModalLoading,
            isSubmitting: isSubmitting,
        },
        formData,
        setFormData,
        errors,
        listData,
        connectionState: {
            isLoading: visibleLoadingConnection,
            isError: visibleConnectionError,
        },
        openModal,
        closeModal,
        handleSubmit,
        fetchData,
    };
};
