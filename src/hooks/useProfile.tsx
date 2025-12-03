import {useState, useCallback, RefObject, useEffect} from "react";
import {z} from "zod";
import {ProfileService} from "../services/profileService.tsx";
import {ProfileSchema} from "../schemas/profileSchema.tsx";
import {useCropper} from "./useCropper";
import {handleApiError, showSuccessToast} from "../utils/toastHandler.tsx";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";

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
    const queryClient = useQueryClient();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formData, setFormData] = useState<ProfileFormData>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    const cropper = useCropper({
        setVisibleModal: setIsModalVisible,
        setProfilePicture,
        toastRef,
    });

    const closeModal = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    const {
        data: profileData,
        isLoading: isModalLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['profile', 'me'],
        queryFn: ProfileService.getCurrentUser,
        enabled: isModalVisible,
        retry: false,
    });

    useEffect(() => {
        if (isModalVisible && profileData) {
            setFormData(profileData);
        }
    }, [profileData, isModalVisible]);

    useEffect(() => {
        if (isError) {
            handleApiError(error, toastRef);
            closeModal();
        }
    }, [isError, error, toastRef, closeModal]);


    const openModal = useCallback(() => {
        cropper.resetCropper();
        setErrors({});
        setFormData(INITIAL_FORM_DATA);
        setProfilePicture(null);
        setIsModalVisible(true);
    }, [cropper]);

    const handleMutationError = (error: any) => {
        if (error instanceof z.ZodError) {
            const formErrors = error.errors.reduce((acc, err) => ({...acc, [err.path[0]]: err.message}), {});
            setErrors(formErrors);
        } else {
            handleApiError(error, toastRef);

            if (error?.status === 409 && error.message) {
                if (error.message.toLowerCase().includes('email')) {
                    setErrors(prev => ({ ...prev, email: error.message }));
                } else if (error.message.toLowerCase().includes('telepon') || error.message.toLowerCase().includes('phone')) {
                    setErrors(prev => ({ ...prev, phoneNumber: error.message }));
                }
            }
        }
    };

    const updateProfileMutation = useMutation({
        mutationFn: ProfileService.updateCurrentUser,
        onSuccess: () => {
            showSuccessToast(toastRef, "Profil berhasil diperbarui");
            queryClient.invalidateQueries({queryKey: ['profile', 'me']});
            queryClient.invalidateQueries({queryKey: ['users']});
            closeModal();
        },
        onError: handleMutationError,
    });

    const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        e?.preventDefault();
        setErrors({});

        try {
            const validatedData = ProfileSchema.parse(formData);
            const request = {
                ...validatedData,
                ...(formData.deleteProfilePicture === true ? {deleteProfilePicture: true} : {}),
                ...(profilePicture instanceof File ? {profilePicture} : {}),
            };
            await updateProfileMutation.mutateAsync(request);
        } catch (error) {
            if (error instanceof z.ZodError) {
                handleMutationError(error);
            }
        }
    }, [formData, profilePicture, updateProfileMutation]);

    return {
        modalState: {
            isVisible: isModalVisible,
            isLoading: isModalLoading,
            isSubmitting: updateProfileMutation.isPending,
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
