import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { useUserManagement } from '../../hooks/useUserManagement.tsx';
import UserModal from '../../components/modal/UserModal.tsx';
import CropImageModal from '../../components/modal/CropImageModal.tsx';
import useSearchUser from '../../hooks/useSearchUser.tsx';
import ReusableLazyTable from '../../components/table/ReusableLazyTable.tsx';
import LoadingRetry from '../../components/ui/LoadingRetry.tsx';
import { useToast } from '../../hooks/useToast.tsx';
import LoadingModal from '../../components/modal/LoadingModal.tsx';
import DeleteModal from '../../components/modal/DeleteModal.tsx';
import { Dispatch, SetStateAction } from 'react';

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
        refetch,
        visibleConnectionError,
        visibleLoadingConnection,
    } = useSearchUser();

    const {
        modalState,
        formData,
        setFormData,
        errors,
        openModal,
        closeModal,
        handleSubmit,
        cropperProps,
        setProfilePicture,
    } = useUserManagement({
        toastRef,
        pagination: {
            page: page || 1,
            setPage: setPage as Dispatch<SetStateAction<number>>,
            totalItem: totalItem || 0,
            size: size || 10,
        },
    });

    const actionTemplate = (rowData: { id: number }) => {
        return (
            <div className="flex items-center justify-center gap-2">
                <Button
                    icon={<i className="pi pi-pen-to-square" style={{ fontSize: '1.4rem' }}></i>}
                    className="size-11"
                    onClick={() => openModal('edit', rowData.id)}
                />
                <Button
                    icon={<i className="pi pi-trash" style={{ fontSize: '1.25rem' }}></i>}
                    severity="secondary"
                    className="size-11"
                    onClick={() => openModal('delete', rowData.id)}
                />
            </div>
        );
    };

    return (
        <div className="m-4 min-h-full max-h-fit bg-white rounded-xl shadow-md p-4 flex flex-col">
            <div
                className={`${visibleLoadingConnection || visibleConnectionError ? 'hidden' : 'block'}`}
            >
                <ReusableLazyTable
                    data={data}
                    totalItem={totalItem || 0}
                    page={page || 1}
                    size={size || 10}
                    onPageChange={(newPage: number, newSize: number) => {
                        setPage(newPage);
                        setSize(newSize);
                    }}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                    handleVisibleCreateModal={() => openModal('create')}
                >
                    <Column
                        className="text-center"
                        field="name"
                        header={<p className="text-center font-medium">Nama</p>}
                    />
                    <Column
                        className="text-center"
                        field="email"
                        header={<p className="text-center font-medium">Email</p>}
                    />
                    <Column
                        className="text-center"
                        field="phoneNumber"
                        header={<p className="text-center font-medium">Telepon</p>}
                    />
                    <Column
                        className="text-center"
                        field="role"
                        header={<p className="text-center font-medium">Role</p>}
                    />
                    <Column
                        body={actionTemplate}
                        className="text-center"
                        header={<p className="text-center font-medium">Aksi</p>}
                    />
                </ReusableLazyTable>
            </div>

            {/* Connection Error/Loading */}
            <LoadingRetry
                visibleConnectionError={visibleConnectionError}
                onRetry={refetch}
                visibleLoadingConnection={visibleLoadingConnection}
            />

            {/* Create/Update User Modal */}
            <UserModal
                isUserCreateMode={modalState.mode === 'create'}
                isUserEditMode={modalState.mode === 'edit'}
                visible={
                    modalState.isVisible &&
                    (modalState.mode === 'create' || modalState.mode === 'edit')
                }
                onClose={closeModal}
                data={formData}
                croppedImage={cropperProps.croppedImage}
                fileInputRef={cropperProps.fileInputRef}
                errors={errors}
                submitLoading={modalState.isSubmitting}
                handleSubmit={handleSubmit}
                handleClickUploadButton={cropperProps.handleClickUploadButton}
                handleImageChange={cropperProps.handleImageChange}
                setData={setFormData}
                setCroppedImage={cropperProps.setCroppedImage}
                setProfilePicture={setProfilePicture}
            />

            {/* Loading Modal for Edit */}
            <LoadingModal modalLoading={modalState.isLoading} />

            {/* Crop Image Modal */}
            <CropImageModal
                id="user-cropper"
                visible={cropperProps.visibleCropImageModal}
                onClose={cropperProps.handleCloseCropImageModal}
                selectedImage={cropperProps.selectedImage as string | null}
                onCrop={cropperProps.handleCrop}
                cropperRef={cropperProps.cropperRef}
                imageRef={cropperProps.imageRef}
            />

            {/* Delete User Modal */}
            <DeleteModal
                submitLoading={modalState.isSubmitting}
                visibleModal={modalState.isVisible && modalState.mode === 'delete'}
                setVisibleModal={closeModal}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default Journalist;
