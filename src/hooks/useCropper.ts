import { useState, useRef, RefObject, ChangeEvent, SetStateAction, Dispatch } from 'react';
import Cropper from 'cropperjs';
import { showErrorToast } from '../utils/toastUtils.ts';
import { ToastRef } from '../types/toast.ts';

export interface UseCropperParams {
    setVisibleModal?: (visible: boolean) => void;
    setProfilePicture?: (file: File | null) => void;
    toastRef?: ToastRef;
    width?: number;
    height?: number;
}

interface UseCropperReturn {
    fileInputRef: RefObject<HTMLInputElement>;
    imageRef: RefObject<HTMLImageElement>;
    cropperRef: RefObject<Cropper | null>;
    selectedImage: string | null;
    visibleCropImageModal: boolean;
    croppedImage: string | null;
    handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleCloseCropImageModal: () => void;
    handleClickUploadButton: () => void;
    handleCrop: () => void;
    resetCropper: () => void;
    destroyCropper: () => void;
    setCroppedImage: Dispatch<SetStateAction<string | null>>;
}

export type { UseCropperReturn };

export const useCropper = ({
    setVisibleModal,
    setProfilePicture,
    toastRef,
    width = 800,
    height = 800,
}: UseCropperParams): UseCropperReturn => {
    const fileInputRef = useRef<HTMLInputElement>(null!);
    const imageRef = useRef<HTMLImageElement>(null!);
    const cropperRef = useRef<Cropper | null>(null);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [visibleCropImageModal, setVisibleCropImageModal] = useState(false);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [imageFormat, setImageFormat] = useState('image/jpeg');

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validFormats = ['image/png', 'image/jpeg', 'image/jpg'];

        if (!validFormats.includes(file.type)) {
            if (toastRef) {
                showErrorToast(toastRef, 'Format gambar tidak valid');
            }
            setSelectedImage(null);
            e.target.value = '';
            return;
        }

        setImageFormat(file.type);

        const reader = new FileReader();
        reader.onload = () => {
            if (setVisibleModal) {
                setVisibleModal(false);
            }
            setVisibleCropImageModal(true);
            setSelectedImage(reader.result as string);
            destroyCropper();
        };
        reader.readAsDataURL(file);
    };

    const handleCloseCropImageModal = () => {
        if (setVisibleModal) {
            setVisibleModal(true);
        }
        setVisibleCropImageModal(false);
        setSelectedImage(null);
        destroyCropper();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClickUploadButton = () => {
        fileInputRef.current?.click();
    };

    const handleCrop = () => {
        if (cropperRef.current) {
            const canvas = cropperRef.current.getCroppedCanvas({
                width,
                height,
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high',
            });

            canvas.toBlob((blob) => {
                if (blob) {
                    const fileSize = blob.size;
                    if (fileSize > 2 * 1024 * 1024) {
                        if (toastRef) {
                            showErrorToast(toastRef, 'Hasil crop gambar melebihi 2MB');
                        }
                        setVisibleCropImageModal(false);
                        if (setVisibleModal) {
                            setVisibleModal(true);
                        }
                        return;
                    }

                    setCroppedImage(URL.createObjectURL(blob));
                    if (setProfilePicture) {
                        const fileExtension = imageFormat.split('/')[1];
                        const file = new File([blob], `profile.${fileExtension}`, {
                            type: imageFormat,
                        });
                        setProfilePicture(file);
                    }
                }
            }, imageFormat);
        }

        setVisibleCropImageModal(false);
        if (setVisibleModal) {
            setVisibleModal(true);
        }
    };

    const destroyCropper = () => {
        if (cropperRef.current) {
            cropperRef.current.destroy();
            cropperRef.current = null;
        }
    };

    const resetCropper = () => {
        setCroppedImage(null);
        setSelectedImage(null);
        destroyCropper();
    };

    return {
        fileInputRef,
        imageRef,
        cropperRef,
        selectedImage,
        visibleCropImageModal,
        croppedImage,
        handleImageChange,
        handleCloseCropImageModal,
        handleClickUploadButton,
        handleCrop,
        resetCropper,
        destroyCropper,
        setCroppedImage,
    };
};
