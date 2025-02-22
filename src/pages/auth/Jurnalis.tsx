import React from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import {useCreateUser} from "../../hooks/useCreateUser.tsx";
import UserModal from "../../components/UserModal.tsx";
import CropImageModal from "../../components/CropImageModal.tsx";
import {useToast} from "../../hooks/useToast.tsx";

const Jurnalis = () => {
    const toastRef = useToast();
    const {
        visibleModal: visibleUserCreateModal,
        submitLoading: submitUserCreateLoading,
        data: dataUserCreate,
        setData: setDataUserCreate,
        errors: profileErrors,
        handleVisibleModal: handleVisibleUserCreateModal,
        handleCloseModal: handleCloseUserCreateModal,
        handleSubmit,
        croppedImage,
        fileInputRef,
        handleClickUploadButton,
        handleImageChange,
        visibleCropImageModal,
        handleCloseCropImageModal,
        selectedImage,
        handleCrop,
        cropperRef,
        imageRef
    } = useCreateUser(toastRef);


    return (
        <div className="m-4 min-h-full  max-h-fit bg-white rounded-xl shadow-md p-4 flex flex-col">
            {/* Pencarian */}
            {/*<div className="flex flex-grow items-center justify-center text-center font-medium text-3xl">*/}
            {/*    <div>*/}
            {/*        Connection Lost*/}
            {/*        <p className="font-normal text-xl mb-3 mt-1">*/}
            {/*            It seems there is an error with your internet connection.*/}
            {/*        </p>*/}
            {/*        <Button severity="secondary">*/}
            {/*            Retry*/}
            {/*        </Button>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/*<div className="flex flex-grow items-center justify-center">*/}
            {/*    <i className="pi pi-spin pi-spinner text-[10vh]"*/}
            {/*       style={{color: '#64748b', animationDuration: '1s'}}></i>*/}
            {/*</div>*/}
            <>
                <div className="flex justify-between mb-4">
                    <div className="p-inputgroup w-full size-11">
                        <InputText placeholder="Search..."/>
                        <Button icon={<i className={`pi pi-search`} style={{fontSize: '1.25rem'}}></i>}
                                className="w-11 h-11"/>
                    </div>
                    <Button
                        icon={<i className={`pi pi-user-plus`} style={{fontSize: '1.25rem'}}></i>}
                        severity="secondary"
                        className="ml-2 w-11 h-11 min-w-[44px] min-h-[44px]"
                        onClick={handleVisibleUserCreateModal}
                    />
                </div>
                {/*<DataTable*/}
                {/*    value={filteredData}*/}
                {/*    paginator*/}
                {/*    rows={10}*/}
                {/*    showGridlines*/}
                {/*    size={"small"}*/}
                {/*>*/}
                {/*    <Column className={`text-center`} field="name"*/}
                {/*            header={<p className="text-center font-medium">Nama</p>}/>*/}
                {/*    <Column className={`text-center`} field="email"*/}
                {/*            header={<p className="text-center font-medium">Email</p>}/>*/}
                {/*    <Column className={`text-center`} field="phone"*/}
                {/*            header={<p className="text-center font-medium">Telepon</p>}/>*/}
                {/*    <Column body={actionTemplate} className={`text-center`} field="nomor"*/}
                {/*            header={<p className="text-center font-medium">Aksi</p>}/>*/}
                {/*</DataTable>*/}
            </>


            {/*modal create user*/}
            <UserModal
                isUserCreateMode={true}
                visible={visibleUserCreateModal}
                onClose={handleCloseUserCreateModal}
                data={dataUserCreate}
                croppedImage={croppedImage}
                fileInputRef={fileInputRef}
                errors={profileErrors}
                submitLoading={submitUserCreateLoading}
                handleSubmit={handleSubmit}
                handleClickUploadButton={handleClickUploadButton}
                handleImageChange={handleImageChange}
                setData={setDataUserCreate}
            />

            {/*modal cropper*/}
            <CropImageModal
                id={"user-cropper"}
                visible={visibleCropImageModal}
                onClose={handleCloseCropImageModal}
                selectedImage={selectedImage}
                onCrop={handleCrop}
                cropperRef={cropperRef}
                imageRef={imageRef}
            />


        </div>
    );
};

export default Jurnalis;
