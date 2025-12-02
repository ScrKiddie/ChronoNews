import {useState, useCallback, RefObject} from "react";
import {z} from "zod";
import {useAuth} from "./useAuth.tsx";
import {ProfileService} from "../services/profileService.tsx";
import {ProfileSchema} from "../schemas/profileSchema.tsx";
import {useCropper} from "./useCropper";
import {showSuccessToast} from "../utils/toastHandler.tsx";

interface ProfileFormData {
    name: string;
    email: string;
    phoneNumber: string;
    deleteProfilePicture?: boolean;
}

const INITIAL_FORM_DATA: ProfileFormData = {
    name: "",
    email: "",
    phoneNumber: "",
    deleteProfilePicture: false,
};

export const useProfile = (toastRef: RefObject<any>) => {
    const {token, logout} = useAuth();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [formData, setFormData] = useState<ProfileFormData>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    const cropper = useCropper({
        setVisibleModal: setIsModalVisible,
        setProfilePicture,
        toastRef,
    });

    const openModal = useCallback(async () => {
        cropper.resetCropper();
        setErrors({});
        setFormData(INITIAL_FORM_DATA);
        setProfilePicture(null);
        setIsModalLoading(true);
        setIsModalVisible(true);
        try {
            const userData = await ProfileService.getCurrentUser(token, toastRef, logout);
            setFormData(userData);
        } catch (error) {
            console.error("Failed to fetch profile data:", error);
            setIsModalVisible(false);
        } finally {
            setIsModalLoading(false);
        }
    }, [token, logout, cropper, toastRef]);

    const closeModal = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        e?.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            const validatedData = ProfileSchema.parse(formData);
            const request = {
                ...validatedData,
                ...(formData.deleteProfilePicture === true ? {deleteProfilePicture: true} : {}),
                ...(profilePicture instanceof File ? {profilePicture} : {}),
            };

            await ProfileService.updateCurrentUser(request, token, toastRef, logout);
            showSuccessToast(toastRef, "Profil berhasil diperbarui");
            closeModal();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formErrors = error.errors.reduce((acc, err) => ({...acc, [err.path[0]]: err.message}), {});
                setErrors(formErrors);
            } else {
                console.error("An unhandled error occurred during profile update:", error);
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, profilePicture, token, logout, closeModal, toastRef]);

    return {
        modalState: {
            isVisible: isModalVisible,
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
