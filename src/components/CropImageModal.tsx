import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {JSX} from "react";

const CropImageModal = ({
                            id = "",
                            aspectRatio = 1,
                            visible,
                            onClose,
                            selectedImage,
                            onCrop,
                            imageRef,
                            cropperRef
                        }) => {
    const header: JSX.Element = <h1 className="font-medium m-0 text-xl">Crop Gambar</h1>;
    return (
        <Dialog
            id={id}
            header={header}
            visible={visible}
            className="w-[94%] md:w-[60%]"
            onHide={onClose}
            blockScroll={true}
            onShow={() => {
                if (
                    selectedImage &&
                    imageRef.current &&
                    cropperRef.current === null
                ) {
                    cropperRef.current = new Cropper(imageRef.current, {
                        aspectRatio: aspectRatio,
                        viewMode: 1,
                        autoCropArea: 1,
                        movable: true,
                        zoomable: true,
                        scalable: false,
                        cropBoxMovable: true,
                        cropBoxResizable: true,
                        guides: true,
                        highlight: true,
                        background: true,
                    });
                }
            }}
        >
            <div className="flex flex-col gap-4">
                <div className={`w-full flex justify-center`}>
                    {selectedImage && (
                        <img
                            ref={imageRef}
                            src={selectedImage}
                            alt="Selected"
                            className="max-w-[90%] md:max-w-[50%] rounded"
                        />
                    )}
                </div>
                <div className="flex items-end justify-end">
                    <Button
                        className="w-full flex items-center justify-center font-normal"
                        onClick={onCrop}
                        type="submit"
                    >
                        Crop
                    </Button>
                </div>
            </div>
        </Dialog>
    );
};

export default CropImageModal;
