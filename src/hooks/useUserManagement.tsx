import {useState, useCallback, RefObject} from "react";
import {z} from "zod";
import {useAuth} from "./useAuth.tsx";
import {UserService} from "../services/userService.tsx";
import {UserCreateSchema, UserUpdateSchema} from "../schemas/userSchema.tsx";
import {useCropper} from "./useCropper";
import {showSuccessToast} from "../utils/toastHandler.tsx";

type ModalMode = "create" | "edit" | "delete" | null;

interface UserFormData {
    name: string;
    phoneNumber: string;
    email: string;
    password?: string;
    role: string;
    deleteProfilePicture?: boolean;
}

interface UseUserManagementProps {
    toastRef: RefObject<any>;
    fetchData: () => void;
    pagination: {
        page: number;
        setPage: (page: number | ((prev: number) => number)) => void;
        totalItem: number;
        size: number;
    };
}

const INITIAL_FORM_DATA: UserFormData = {
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    role: "",
    deleteProfilePicture: false,
};

export const useUserManagement = ({toastRef, fetchData, pagination}: UseUserManagementProps) => {
    const {token, logout} = useAuth();
    const {page, setPage, totalItem, size} = pagination;

    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [formData, setFormData] = useState<UserFormData>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    const cropper = useCropper({
        setVisibleModal: setIsModalVisible,
        setProfilePicture,
        toastRef
    });

    const openModal = useCallback(async (mode: ModalMode, userId?: number) => {
        cropper.resetCropper();
        setErrors({});
        setFormData(INITIAL_FORM_DATA);
        setProfilePicture(null);
        setModalMode(mode);

        if ((mode === "edit" || mode === "delete") && userId) {
            setSelectedUserId(userId);
        }

        if (mode === "edit" && userId) {
            setIsModalLoading(true);
            setIsModalVisible(true);
            try {
                const userData = await UserService.getUser(userId, token, toastRef, logout);
                setFormData(userData);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                setIsModalVisible(false);
            } finally {
                setIsModalLoading(false);
            }
        } else {
            setIsModalVisible(true);
        }
    }, [token, logout, cropper, toastRef]);

    const closeModal = useCallback(() => {
        setIsModalVisible(false);
        setTimeout(() => {
            setModalMode(null);
            setSelectedUserId(null);
            setFormData(INITIAL_FORM_DATA);
            setErrors({});
        }, 300);
    }, []);


    const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        e?.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            switch (modalMode) {
                case "create": {
                    const validatedData = UserCreateSchema.parse(formData);
                    const request = {
                        ...validatedData,
                        ...(profilePicture instanceof File ? {profilePicture} : {}),
                    };
                    await UserService.createUser(request, token, toastRef, logout);
                    showSuccessToast(toastRef, "Pengguna berhasil dibuat");
                    break;
                }
                case "edit": {
                    if (!selectedUserId) throw new Error("No user selected for update");
                    const validatedData = UserUpdateSchema.parse(formData);
                    const request = {
                        ...validatedData,
                        ...(formData.deleteProfilePicture === true ? {deleteProfilePicture: true} : {}),
                        ...(profilePicture instanceof File ? {profilePicture} : {}),
                    };
                    await UserService.updateUser(selectedUserId, request, token, toastRef, logout);
                    showSuccessToast(toastRef, "Pengguna berhasil diperbarui");
                    break;
                }
                case "delete": {
                    if (!selectedUserId) throw new Error("No user selected for deletion");
                    await UserService.deleteUser(selectedUserId, token, toastRef, logout);
                    showSuccessToast(toastRef, "Pengguna berhasil dihapus");

                    const remainingItems = totalItem - 1;
                    const remainingPages = Math.ceil(remainingItems / size);
                    if (remainingItems > 0 && remainingPages < page) {
                        setPage((prev) => Math.max(1, prev - 1));
                    }
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
        modalMode, formData, profilePicture, selectedUserId, token, logout,
        fetchData, closeModal, toastRef, totalItem, size, page, setPage
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
        openModal,
        closeModal,
        handleSubmit,
        cropperProps: {
            ...cropper,
            setProfilePicture,
        },
    };
};
