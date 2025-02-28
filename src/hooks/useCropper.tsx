import { useState, useRef } from "react";

export const useCropper = ({ setVisibleModal = () => {}, setProfilePicture = null, toastRef = null, width = 320, height=320 } = {}) => {
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [visibleCropImageModal, setVisibleCropImageModal] = useState(false);
    const [croppedImage, setCroppedImage] = useState(null);
    const imageRef = useRef(null);
    const cropperRef = useRef(null);
    const [imageFormat, setImageFormat] = useState("image/jpeg");
    // Handle Upload Gambar
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validFormats = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

        if (!validFormats.includes(file.type)) {
            if(toastRef){
                toastRef.current?.show({
                    severity: "error",
                    detail: "Format gambar tidak valid",
                    life: 2000,
                });
            }
            setSelectedImage(null);
            e.target.value = "";
            return;
        }

        if (file.size > 500 * 1024) {
            if(toastRef){
                toastRef.current?.show({
                    severity: "error",
                    detail: "Ukuran gambar melebihi 500KB",
                    life: 2000,
                });
            }
            setSelectedImage(null);
            e.target.value = "";
            return;
        }

        setImageFormat(file.type);

        const reader = new FileReader();
        reader.onload = () => {
            if (setVisibleModal){
                setVisibleModal(false)
            }
            setVisibleCropImageModal(true);
            setSelectedImage(reader.result);
            destroyCropper();
        };
        reader.readAsDataURL(file);
    };

    // Tutup Modal Crop Image
    const handleCloseCropImageModal = () => {
        if (setVisibleModal){
            setVisibleModal(true)
        }
        setVisibleCropImageModal(false);
        setSelectedImage(null);
        destroyCropper(); // Hancurkan instance cropper
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    // Handle Button Upload
    const handleClickUploadButton = () => fileInputRef.current?.click();

    // Handle Crop Gambar
    const handleCrop = () => {
        if (cropperRef.current) {
            const canvas = cropperRef.current.getCroppedCanvas({ width: width, height: height });

            canvas.toBlob((blob) => {
                if (blob) {

                    setCroppedImage(URL.createObjectURL(blob));
                    console.log(setProfilePicture)
                    if (setProfilePicture) {
                        const fileExtension = imageFormat.split("/")[1]; // Ambil ekstensi dari format
                        const file = new File([blob], `profile.${fileExtension}`, {
                            type: imageFormat, // Gunakan format asli
                        });
                        setProfilePicture(file);
                    }

                }
            }, imageFormat);

        }

        setVisibleCropImageModal(false);
        if (setVisibleModal){
            setVisibleModal(true)
        }
    };

    // Hancurkan Cropper Jika Ada
    const destroyCropper = () => {
        if (cropperRef.current) {
            cropperRef.current.destroy();
            cropperRef.current = null;
        }
    };

    // Reset Cropper Data
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
    };
};
