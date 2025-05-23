import {useState, useRef} from "react";
import {showErrorToast} from "../utils/toastHandler.tsx";

type UseCropperParams = {
    setVisibleModal?: (visible: boolean) => void;
    setProfilePicture?: (file: File | null) => void;
    toastRef?: any;
    width?: number;
    height?: number;
};

export const useCropper = ({
                               setVisibleModal,
                               setProfilePicture,
                               toastRef,
                               width = 800,
                               height = 800
                           }: UseCropperParams = {}) => {
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState<null | string | ArrayBuffer>(null);
    const [visibleCropImageModal, setVisibleCropImageModal] = useState(false);
    const [croppedImage, setCroppedImage] = useState<string|null>(null);
    const imageRef = useRef(null);
    const cropperRef = useRef(null);
    const [imageFormat, setImageFormat] = useState("image/jpeg");
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validFormats = ["image/png", "image/jpeg", "image/jpg"];

        if (!validFormats.includes(file.type)) {
            if (toastRef) {
                showErrorToast(toastRef, "Format gambar tidak valid");
            }
            setSelectedImage(null);
            e.target.value = "";
            return;
        }

        setImageFormat(file.type);

        const reader = new FileReader();
        reader.onload = () => {
            if (setVisibleModal) {
                setVisibleModal(false)
            }
            setVisibleCropImageModal(true);
            setSelectedImage(reader.result);
            destroyCropper();
        };
        reader.readAsDataURL(file);
    };

    const handleCloseCropImageModal = () => {
        if (setVisibleModal) {
            setVisibleModal(true)
        }
        setVisibleCropImageModal(false);
        setSelectedImage(null);
        destroyCropper();
        if (fileInputRef.current) {
            (fileInputRef.current as any).value = null;
        }
    };

    const handleClickUploadButton = () => (fileInputRef.current as any).click();

    const handleCrop = () => {
        if (cropperRef.current) {
            const canvas = (cropperRef.current as any).getCroppedCanvas({
                width: width, height: height, imageSmoothingEnabled: true,
                imageSmoothingQuality: "high"
            });

            canvas.toBlob((blob) => {
                if (blob) {
                    const fileSize = blob.size;
                    if (fileSize > 2 * 1024 * 1024) {
                        if (toastRef) {
                            showErrorToast(toastRef, "Hasil crop gambar melebihi 2MB");
                        }
                        setVisibleCropImageModal(false);
                        if (setVisibleModal) {
                            setVisibleModal(true);
                        }
                        return;
                    }

                    setCroppedImage(URL.createObjectURL(blob));
                    if (setProfilePicture) {
                        const fileExtension = imageFormat.split("/")[1];
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
            setVisibleModal(true)
        }
    };

    const destroyCropper = () => {
        if (cropperRef.current) {
            (cropperRef.current as any).destroy();
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
        selectedImage,
        visibleCropImageModal,
        croppedImage,
        cropperRef,
        imageRef,
        handleImageChange,
        handleCloseCropImageModal,
        handleClickUploadButton,
        handleCrop,
        resetCropper,
        destroyCropper,
        setCroppedImage
    };
};
