import { useState, useCallback, useEffect, FormEvent } from 'react';
import { z } from 'zod';
import { CategoryService } from '../services/categoryService.ts';
import { CategorySchema } from '../schemas/categorySchema.ts';
import { handleApiError, showSuccessToast } from '../utils/toastUtils.ts';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '../types/api.ts';
import { ToastRef } from '../types/toast.ts';
import { Category } from '../types/category.ts';

type ModalMode = 'create' | 'edit' | 'delete' | null;

interface UseCategoryProps {
    toastRef: ToastRef;
}

const INITIAL_FORM_DATA: Category = {
    name: '',
};

export const useCategory = ({ toastRef }: UseCategoryProps) => {
    const queryClient = useQueryClient();

    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formData, setFormData] = useState<Category>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [visibleConnectionError, setVisibleConnectionError] = useState(false);

    const {
        data: listData = [],
        isLoading: isListLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ['categories'],
        queryFn: ({ signal }) =>
            CategoryService.listCategories(signal).then((res) => res.data || []),
        retry: false,
    });

    useEffect(() => {
        if (isListLoading || isFetching) {
            setVisibleConnectionError(false);
        } else if (isError && (error as ApiError)?.isNetworkError) {
            setVisibleConnectionError(true);
        } else {
            setVisibleConnectionError(false);
        }
    }, [isError, error, isListLoading, isFetching]);

    const closeModal = useCallback(() => {
        setIsModalVisible(false);
        setTimeout(() => {
            setModalMode(null);
            setSelectedCategoryId(null);
            setFormData(INITIAL_FORM_DATA);
            setErrors({});
        }, 300);
    }, []);

    const {
        data: categoryDataForEdit,
        isLoading: isModalLoading,
        isError: isGetCategoryError,
        error: getCategoryError,
    } = useQuery({
        queryKey: ['category', selectedCategoryId],
        queryFn: () => CategoryService.getCategory(selectedCategoryId!),
        enabled: modalMode === 'edit' && !!selectedCategoryId,
        retry: false,
    });

    useEffect(() => {
        if (modalMode === 'edit') {
            if (isGetCategoryError) {
                handleApiError(getCategoryError as ApiError, toastRef);
                closeModal();
            } else if (categoryDataForEdit && !isModalLoading) {
                setFormData(categoryDataForEdit);
                setIsModalVisible(true);
            }
        }
    }, [
        categoryDataForEdit,
        modalMode,
        isModalLoading,
        isGetCategoryError,
        getCategoryError,
        toastRef,
        closeModal,
    ]);

    const openModal = useCallback((mode: ModalMode, categoryId?: number) => {
        setErrors({});
        setFormData(INITIAL_FORM_DATA);
        setSelectedCategoryId(categoryId || null);
        setModalMode(mode);
        if (mode !== 'edit') {
            setIsModalVisible(true);
        }
    }, []);

    const handleMutationSuccess = (message: string) => {
        showSuccessToast(toastRef, message);
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        closeModal();
    };

    const handleMutationError = useCallback(
        (error: unknown) => {
            if (error instanceof z.ZodError) {
                const formErrors = error.errors.reduce(
                    (acc, err) => ({ ...acc, [err.path[0]]: err.message }),
                    {}
                );
                setErrors(formErrors);
            } else {
                handleApiError(error as ApiError, toastRef);
            }
        },
        [toastRef]
    );

    const createMutation = useMutation({
        mutationFn: CategoryService.createCategory,
        onSuccess: () => handleMutationSuccess('Kategori berhasil dibuat'),
        onError: handleMutationError,
    });

    const updateMutation = useMutation({
        mutationFn: (data: Category) => CategoryService.updateCategory(selectedCategoryId!, data),
        onSuccess: () => handleMutationSuccess('Kategori berhasil diperbarui'),
        onError: handleMutationError,
    });

    const deleteMutation = useMutation({
        mutationFn: () => CategoryService.deleteCategory(selectedCategoryId!),
        onSuccess: () => handleMutationSuccess('Kategori berhasil dihapus'),
        onError: (error) => handleApiError(error as ApiError, toastRef),
    });

    const handleSubmit = useCallback(
        async (e?: FormEvent) => {
            e?.preventDefault();
            setErrors({});

            switch (modalMode) {
                case 'create':
                case 'edit':
                    try {
                        const validatedData = CategorySchema.parse(formData);
                        if (modalMode === 'create') {
                            await createMutation.mutateAsync(validatedData);
                        } else {
                            if (!selectedCategoryId) return;
                            await updateMutation.mutateAsync(validatedData);
                        }
                    } catch (error) {
                        if (error instanceof z.ZodError) {
                            handleMutationError(error);
                        }
                    }
                    break;
                case 'delete':
                    if (!selectedCategoryId) return;
                    await deleteMutation.mutateAsync();
                    break;
            }
        },
        [
            modalMode,
            formData,
            selectedCategoryId,
            createMutation,
            updateMutation,
            deleteMutation,
            handleMutationError,
        ]
    );

    const isSubmitting =
        createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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
            isLoading: isListLoading || isFetching,
            isError: visibleConnectionError,
        },
        openModal,
        closeModal,
        handleSubmit,
        refetch,
    };
};
