import {Button} from "primereact/button";
import {useCreateUser} from "../../hooks/useCreateUser.tsx";
import {useUpdateUser} from "../../hooks/useUpdateUser.tsx";
import UserModal from "../../components/UserModal.tsx";
import CropImageModal from "../../components/CropImageModal.tsx";
import useSearchUser from "../../hooks/useSearchUser.tsx";
import ReusableLazyTable from "../../components/ReusableLazyTable.tsx";
import LoadingRetry from "../../components/LoadingRetry.tsx";
import {useToast} from "../../hooks/useToast.tsx";
import {Column} from "primereact/column";
import LoadingModal from "../../components/LoadingModal.tsx";
import {useDeleteUser} from "../../hooks/useDeleteUser.tsx";
import DeleteModal from "../../components/DeleteModal.tsx";

const Journalist = () => {
    const toastRef = useToast();

    const {
        data,
        searchParams,
        setSearchParams,
        page,
        setPage,
        size,
        setSize,
        totalItem,
        fetchData,
        visibleConnectionError,
        visibleLoadingConnection,
    } = useSearchUser();

    const {
        visibleModal: visibleUserCreateModal,
        submitLoading: submitUserCreateLoading,
        data: dataUserCreate,
        setData: setDataUserCreate,
        errors: createUserErrors,
        handleVisibleModal: handleVisibleUserCreateModal,
        handleCloseModal: handleCloseUserCreateModal,
        handleSubmit: handleSubmitCreateUser,
        croppedImage: croppedImageCreate,
        fileInputRef: fileInputRefCreate,
        handleClickUploadButton: handleClickUploadButtonCreate,
        handleImageChange: handleImageChangeCreate,
        visibleCropImageModal: visibleCropImageModalCreate,
        handleCloseCropImageModal: handleCloseCropImageModalCreate,
        selectedImage: selectedImageCreate,
        handleCrop: handleCropCreate,
        cropperRef: cropperRefCreate,
        imageRef: imageRefCreate,
        setCroppedImage:setCroppedImageCreate,
        setProfilePicture: setProfilePictureCreate
    } = useCreateUser(toastRef, fetchData);

    const {
        visibleModal: visibleUserUpdateModal,
        submitLoading: submitUserUpdateLoading,
        data: dataUserUpdate,
        setData: setDataUserUpdate,
        errors: updateUserErrors,
        handleVisibleModal: handleVisibleUserUpdateModal,
        handleCloseModal: handleCloseUserUpdateModal,
        handleSubmit: handleSubmitUpdateUser,
        croppedImage: croppedImageUpdate,
        fileInputRef: fileInputRefUpdate,
        handleClickUploadButton: handleClickUploadButtonUpdate,
        handleImageChange: handleImageChangeUpdate,
        visibleCropImageModal: visibleCropImageModalUpdate,
        handleCloseCropImageModal: handleCloseCropImageModalUpdate,
        selectedImage: selectedImageUpdate,
        handleCrop: handleCropUpdate,
        cropperRef: cropperRefUpdate,
        imageRef: imageRefUpdate,
        modalLoading,
        setCroppedImage:setCroppedImageUpdate,
        setProfilePicture: setProfilePictureUpdate
    } = useUpdateUser(toastRef, fetchData);

    const {
        handleSubmit: handleSubmitDeleteUser,
        submitLoading: submitUserDeleteLoading,
        visibleModal: visibleUserDeleteModal,
        handleVisibleModal: handleVisibleUserDeleteModal,
        setVisibleModal: setVisibleUserDeleteModal
    } = useDeleteUser(toastRef, fetchData, page, setPage, totalItem, size);

    const actionTemplate = (rowData) => {
        return (
            <div className="flex items-center justify-center gap-2">
                <Button
                    icon={<i className="pi pi-pen-to-square" style={{fontSize: '1.4rem'}}></i>}
                    className="size-11"
                    onClick={() => handleVisibleUserUpdateModal(rowData.id)}
                />
                <Button
                    icon={<i className="pi pi-trash" style={{fontSize: '1.25rem'}}></i>}
                    severity="secondary"
                    className="size-11"
                    onClick={() => {
                        handleVisibleUserDeleteModal(rowData.id)
                    }}
                />
            </div>
        );
    };

    return (
        <div className="m-4 min-h-full max-h-fit bg-white rounded-xl shadow-md p-4 flex flex-col">
            <div className={`${(visibleLoadingConnection || visibleConnectionError) ? "hidden" : "block"}`}>
                <ReusableLazyTable
                    data={data}
                    totalItem={totalItem}
                    page={page}
                    size={size}
                    onPageChange={(newPage, newSize) => {
                        setPage(newPage);
                        setSize(newSize);
                    }}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                    handleVisibleCreateModal={handleVisibleUserCreateModal}
                >
                    <Column className="text-center" field="name"
                            header={<p className="text-center font-medium">Nama</p>}/>
                    <Column className="text-center" field="email"
                            header={<p className="text-center font-medium">Email</p>}/>
                    <Column className="text-center" field="phoneNumber"
                            header={<p className="text-center font-medium">Telepon</p>}/>
                    <Column className="text-center" field="role"
                            header={<p className="text-center font-medium">Role</p>}/>
                    <Column body={actionTemplate} className="text-center"
                            header={<p className="text-center font-medium">Aksi</p>}/>
                </ReusableLazyTable>
            </div>

            {/* error koneksi */}
            <LoadingRetry
                visibleConnectionError={visibleConnectionError}
                onRetry={fetchData}
                visibleLoadingConnection={visibleLoadingConnection}
            />

            {/* modal create user */}
            <UserModal
                isUserCreateMode={true}
                visible={visibleUserCreateModal}
                onClose={handleCloseUserCreateModal}
                data={dataUserCreate}
                croppedImage={croppedImageCreate}
                fileInputRef={fileInputRefCreate}
                errors={createUserErrors}
                submitLoading={submitUserCreateLoading}
                handleSubmit={handleSubmitCreateUser}
                handleClickUploadButton={handleClickUploadButtonCreate}
                handleImageChange={handleImageChangeCreate}
                setData={setDataUserCreate}
                setCroppedImage={setCroppedImageCreate}
                setProfilePicture={setProfilePictureCreate}
            />

            {/*modal loading*/}
            <LoadingModal
                modalLoading={modalLoading}
            />
            {/* modal update user */}
            <UserModal
                isUserEditMode={true}
                visible={visibleUserUpdateModal}
                onClose={handleCloseUserUpdateModal}
                data={dataUserUpdate}
                croppedImage={croppedImageUpdate}
                fileInputRef={fileInputRefUpdate}
                errors={updateUserErrors}
                submitLoading={submitUserUpdateLoading}
                handleSubmit={handleSubmitUpdateUser}
                handleClickUploadButton={handleClickUploadButtonUpdate}
                handleImageChange={handleImageChangeUpdate}
                setData={setDataUserUpdate}
                setCroppedImage={setCroppedImageUpdate}
                setProfilePicture={setProfilePictureUpdate}
            />

            {/* modal cropper untuk create */}
            <CropImageModal
                id="user-cropper"
                visible={visibleCropImageModalCreate}
                onClose={handleCloseCropImageModalCreate}
                selectedImage={selectedImageCreate}
                onCrop={handleCropCreate}
                cropperRef={cropperRefCreate}
                imageRef={imageRefCreate}
            />

            {/* modal cropper untuk update */}
            <CropImageModal
                id="user-cropper"
                visible={visibleCropImageModalUpdate}
                onClose={handleCloseCropImageModalUpdate}
                selectedImage={selectedImageUpdate}
                onCrop={handleCropUpdate}
                cropperRef={cropperRefUpdate}
                imageRef={imageRefUpdate}
            />

            {/* modal delete user */}
            <DeleteModal
                submitLoading={submitUserDeleteLoading}
                visibleModal={visibleUserDeleteModal}
                setVisibleModal={setVisibleUserDeleteModal}
                onSubmit={handleSubmitDeleteUser}
            />
        </div>
    );
};

export default Journalist;
