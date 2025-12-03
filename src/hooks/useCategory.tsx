import {useState, useCallback, RefObject, useEffect} from "react";
import {z} from "zod";
import {CategoryService} from "../services/categoryService.tsx";
import {CategorySchema} from "../schemas/categorySchema.tsx";
import {handleApiError, handleApiErrorWithRetry, showSuccessToast} from "../utils/toastHandler.tsx";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";

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
    const queryClient = useQueryClient();

    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formData, setFormData] = useState<CategoryFormData>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [visibleConnectionError, setVisibleConnectionError] = useState(false);

    const {data: listData = [], isLoading: isListLoading, isError, error, refetch} = useQuery({
        queryKey: ['categories'],
        queryFn: ({signal}) => CategoryService.listCategories(signal).then(res => res.data || []),
        retry: false,
    });

    useEffect(() => {
        if (isError) {
            handleApiErrorWithRetry(error, setVisibleConnectionError);
        } else {
            setVisibleConnectionError(false);
        }
    }, [isError, error]);

    const closeModal = useCallback(() => {
        setIsModalVisible(false);
        setTimeout(() => {
            setModalMode(null);
            setSelectedCategoryId(null);
        }, 300);
    }, []);

    const {
        data: categoryDataForEdit,
        isLoading: isModalLoading,
        isError: isGetCategoryError,
        error: getCategoryError
    } = useQuery({
        queryKey: ['category', selectedCategoryId],
        queryFn: () => CategoryService.getCategory(selectedCategoryId!),
        enabled: modalMode === 'edit' && !!selectedCategoryId && isModalVisible,
        retry: false,
    });

    useEffect(() => {
        if (isGetCategoryError) {
            handleApiError(getCategoryError, toastRef);
            closeModal();
        }
    }, [isGetCategoryError, getCategoryError, toastRef, closeModal]);


    useEffect(() => {
        if (categoryDataForEdit) {
            setFormData(categoryDataForEdit);
        }
    }, [categoryDataForEdit]);

    const openModal = useCallback((mode: ModalMode, categoryId?: number) => {
        setErrors({});
        setFormData(INITIAL_FORM_DATA);
        setSelectedCategoryId(categoryId || null);
        setModalMode(mode);
        setIsModalVisible(true);
    }, []);

    const handleMutationSuccess = (message: string) => {
        showSuccessToast(toastRef, message);
        queryClient.invalidateQueries({queryKey: ['categories']});
        closeModal();
    };

    const handleMutationError = (error: unknown) => {
        if (error instanceof z.ZodError) {
            const formErrors = error.errors.reduce((acc, err) => ({...acc, [err.path[0]]: err.message}), {});
            setErrors(formErrors);
        } else {
            handleApiError(error, toastRef);
        }
    };

    const createMutation = useMutation({
        mutationFn: CategoryService.createCategory,
        onSuccess: () => handleMutationSuccess("Kategori berhasil dibuat"),
        onError: handleMutationError,
    });

    const updateMutation = useMutation({
        mutationFn: (data: CategoryFormData) => CategoryService.updateCategory(selectedCategoryId!, data),
        onSuccess: () => handleMutationSuccess("Kategori berhasil diperbarui"),
        onError: handleMutationError,
    });

    const deleteMutation = useMutation({
        mutationFn: () => CategoryService.deleteCategory(selectedCategoryId!),
        onSuccess: () => handleMutationSuccess("Kategori berhasil dihapus"),
        onError: handleMutationError,
    });

    const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        e?.preventDefault();
        setErrors({});

        try {
            const validatedData = CategorySchema.parse(formData);
            switch (modalMode) {
                case "create":
                    await createMutation.mutateAsync(validatedData);
                    break;
                case "edit":
                    if (!selectedCategoryId) return;
                    await updateMutation.mutateAsync(validatedData);
                    break;
                case "delete":
                    if (!selectedCategoryId) return;
                    await deleteMutation.mutateAsync();
                    break;
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                handleMutationError(error);
            }
        }
    }, [modalMode, formData, selectedCategoryId, createMutation, updateMutation, deleteMutation]);
    
    const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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
            isLoading: isListLoading,
            isError: visibleConnectionError,
        },
        openModal,
        closeModal,
        handleSubmit,
        refetch,
    };
};
