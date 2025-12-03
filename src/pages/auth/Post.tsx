import {Button} from "primereact/button";
import {Column} from "primereact/column";
import {useToast} from "../../hooks/useToast.tsx";
import useSearchPost from "../../hooks/useSearchPost.tsx";
import {usePostManagement} from "../../hooks/usePostManagement.tsx";
import ReusableLazyTable from "../../components/ReusableLazyTable.tsx";
import LoadingRetry from "../../components/LoadingRetry.tsx";
import PostModal from "../../components/PostModal.tsx";
import CropImageModal from "../../components/CropImageModal.tsx";
import LoadingModal from "../../components/LoadingModal.tsx";
import DeleteModal from "../../components/DeleteModal.tsx";

const Post = () => {
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
    } = useSearchPost();

    const {
        modalState,
        formData,
        setFormData,
        errors,
        openModal,
        closeModal,
        handleSubmit,
        handleDeleteConfirm,
        editorContent,
        setEditorContent,
        cropperProps,
        options,
        role,
    } = usePostManagement({
        toastRef,
        pagination: {page, setPage, totalItem, size},
    });

    const actionTemplate = (rowData: { id: number }) => (
        <div className="flex items-center justify-center gap-2">
            <Button
                icon={<i className="pi pi-pen-to-square" style={{fontSize: '1.4rem'}}></i>}
                className="size-11"
                onClick={() => openModal("edit", rowData.id)}
            />
            <Button
                icon={<i className="pi pi-trash" style={{fontSize: '1.25rem'}}></i>}
                severity="secondary"
                className="size-11"
                onClick={() => openModal("delete", rowData.id)}
            />
        </div>
    );

    return (
        <div className="m-4 min-h-full max-h-fit bg-white rounded-xl shadow-md p-4 flex flex-col">
            <div className={`${(visibleConnectionError || visibleLoadingConnection) ? "hidden" : "block"}`}>
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
                    handleVisibleCreateModal={() => openModal("create")}
                >
                    <Column
                        header={<p className="text-center font-medium">Judul</p>}
                        className="text-center max-w-md"
                        body={(rowData) => (
                            <div className=" max-h-16 mx-auto overflow-y-auto break-words whitespace-pre-wrap p-2">
                                {rowData.title}
                            </div>
                        )}
                    />
                    {role === "admin" && <Column className="text-center" field="user" header={<p className="text-center font-medium">Penulis</p>}/>}
                    <Column
                        header={<p className="text-center font-medium ">Ringkasan</p>}
                        className="text-center max-w-md"
                        body={(rowData) => (
                            <div className="max-h-24 mx-auto overflow-y-auto break-words whitespace-pre-wrap p-2">
                                {rowData.summary}
                            </div>
                        )}
                    />
                    <Column className="text-center" field="category" header={<p className="text-center font-medium">Kategori</p>}/>
                    <Column className="text-center " field="createdAt" header={<p className="text-center font-medium">Publikasi</p>}/>
                    <Column className="text-center" field="updatedAt" header={<p className="text-center font-medium">Revisi</p>}/>
                    <Column className="text-center" field="viewCount" header={<p className="text-center font-medium">Viewer</p>}/>
                    <Column body={actionTemplate} className="text-center" header={<p className="text-center font-medium">Aksi</p>}/>
                </ReusableLazyTable>
            </div>

            {/* Connection Error/Loading */}
            <LoadingRetry
                visibleConnectionError={visibleConnectionError}
                onRetry={refetch}
                visibleLoadingConnection={visibleLoadingConnection}
            />

            {/* Create/Update Post Modal */}
            <PostModal
                isEditMode={modalState.mode === "edit"}
                visible={modalState.isVisible && (modalState.mode === "create" || modalState.mode === "edit")}
                onClose={closeModal}
                data={formData}
                setData={setFormData}
                errors={errors}
                submitLoading={modalState.isSubmitting}
                handleSubmit={handleSubmit}
                // options
                role={role}
                userOptions={options.user}
                categoryOptions={options.category}
                // cropper & thumbnail
                croppedImage={cropperProps.croppedImage}
                fileInputRef={cropperProps.fileInputRef}
                handleClickUploadButton={cropperProps.handleClickUploadButton}
                handleImageChange={cropperProps.handleImageChange}
                setCroppedImage={cropperProps.setCroppedImage}
                setThumbnail={cropperProps.setThumbnail}
                // editor
                editorContent={editorContent}
                setEditorContent={setEditorContent}
            />

            {/* Modal Loading for fetching data */}
            <LoadingModal modalLoading={modalState.isLoading}/>

            {/* Crop Image Modal */}
            <CropImageModal
                visible={cropperProps.visibleCropImageModal}
                onClose={cropperProps.handleCloseCropImageModal}
                selectedImage={cropperProps.selectedImage}
                onCrop={cropperProps.handleCrop}
                cropperRef={cropperProps.cropperRef}
                imageRef={cropperProps.imageRef}
                aspectRatio={16 / 9}
            />

            {/* Delete Post Modal */}
            <DeleteModal
                submitLoading={modalState.isSubmitting}
                visibleModal={modalState.isVisible && modalState.mode === "delete"}
                setVisibleModal={(isVisible) => !isVisible && closeModal()}
                onSubmit={handleDeleteConfirm}
            />
        </div>
    );
};

export default Post;
