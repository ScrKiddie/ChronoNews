import React from "react";
import {Button} from "primereact/button";
import PostModal from "../../components/PostModal.tsx";
import CropImageModal from "../../components/CropImageModal.tsx";
import ReusableLazyTable from "../../components/ReusableLazyTable.tsx";
import LoadingRetry from "../../components/LoadingRetry.tsx";
import {useToast} from "../../hooks/useToast.tsx";
import {Column} from "primereact/column";
import LoadingModal from "../../components/LoadingModal.tsx";
import DeleteModal from "../../components/DeleteModal.tsx";
import useSearchPost from "../../hooks/useSearchPost.tsx";
import {useCreatePost} from "../../hooks/useCreatePost.tsx";
import {useUpdatePost} from "../../hooks/useUpdatePost.tsx";
import {useDeletePost} from "../../hooks/useDeletePost.tsx";
import {useAuth} from "../../hooks/useAuth.tsx";

const Post = () => {
    const toastRef = useToast();
    const {role} = useAuth()
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
    } = useSearchPost();

    const {
        visibleModal: visiblePostCreateModal,
        submitLoading: submitPostCreateLoading,
        data: dataPostCreate,
        setData: setDataPostCreate,
        errors: createPostErrors,
        handleVisibleModal: handleVisiblePostCreateModal,
        handleCloseModal: handleClosePostCreateModal,
        handleSubmit: handleSubmitCreatePost,
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
        modalLoading: modalCreateLoading,
        categoryOptions: categoryOptionsCreate,
        userOptions: userOptionsCreate,
        role: roleCreate,
        editorContent: editorContentCreate,
        setThumbnail: setThumbnailCreate,
        setCroppedImage: setCroppedImageCreate
    } = useCreatePost(toastRef, fetchData);

    const {
        visibleModal: visiblePostUpdateModal,
        submitLoading: submitPostUpdateLoading,
        data: dataPostUpdate,
        setData: setDataPostUpdate,
        errors: updatePostErrors,
        handleVisibleModal: handleVisiblePostUpdateModal,
        handleCloseModal: handleClosePostUpdateModal,
        handleSubmit: handleSubmitUpdatePost,
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
        modalLoading: modalUpdateLoading,
        categoryOptions: categoryOptionsUpdate,
        userOptions: userOptionsUpdate,
        role: roleUpdate,
        editorContent: editorContentUpdate,
        setThumbnail: setThumbnailUpdate,
        setCroppedImage: setCroppedImageUpdate
    } = useUpdatePost(toastRef, fetchData);

    const {
        handleSubmit: handleSubmitDeletePost,
        submitLoading: submitPostDeleteLoading,
        visibleModal: visiblePostDeleteModal,
        handleVisibleModal: handleVisiblePostDeleteModal,
        setVisibleModal: setVisiblePostDeleteModal
    } = useDeletePost(toastRef, fetchData, page, setPage, totalItem, size);

    const actionTemplate = (rowData) => {
        return (
            <div className="flex items-center justify-center gap-2">
                <Button
                    icon={<i className="pi pi-pen-to-square" style={{fontSize: '1.4rem'}}></i>}
                    className="size-11"
                    onClick={() => handleVisiblePostUpdateModal(rowData.id)}
                />
                <Button
                    icon={<i className="pi pi-trash" style={{fontSize: '1.25rem'}}></i>}
                    severity="secondary"
                    className="size-11"
                    onClick={() => {
                        handleVisiblePostDeleteModal(rowData.id)
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
                    handleVisibleCreateModal={handleVisiblePostCreateModal}
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
                    {role == "admin" && <Column className="text-center" field="user"
                                                header={<p className="text-center font-medium">Penulis</p>}/>}

                    <Column
                        header={<p className="text-center font-medium ">Ringkasan</p>}
                        className="text-center max-w-md"
                        body={(rowData) => (
                            <div className="max-h-24 mx-auto overflow-y-auto break-words whitespace-pre-wrap p-2">
                                {rowData.summary}
                            </div>
                        )}
                    />
                    <Column className="text-center" field="category"
                            header={<p className="text-center font-medium">Kategori</p>}/>
                    <Column className="text-center " field="publishedDate"
                            header={<p className="text-center font-medium">Publikasi</p>}/>
                    <Column className="text-center" field="lastUpdated"
                            header={<p className="text-center font-medium">Revisi</p>}/>
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

            {/* modal create post */}
            <PostModal
                role={roleCreate}
                userOptions={userOptionsCreate}
                categoryOptions={categoryOptionsCreate}
                isEditMode={false}
                visible={visiblePostCreateModal}
                onClose={handleClosePostCreateModal}
                data={dataPostCreate}
                croppedImage={croppedImageCreate}
                fileInputRef={fileInputRefCreate}
                errors={createPostErrors}
                submitLoading={submitPostCreateLoading}
                handleSubmit={handleSubmitCreatePost}
                handleClickUploadButton={handleClickUploadButtonCreate}
                handleImageChange={handleImageChangeCreate}
                setData={setDataPostCreate}
                editorContent={editorContentCreate}
                setCroppedImage={setCroppedImageCreate}
                setThumbnail={setThumbnailCreate}
            />

            {/*modal loading create*/}
            <LoadingModal
                modalLoading={modalCreateLoading}
            />

            {/* modal cropper untuk create */}
            <CropImageModal
                visible={visibleCropImageModalCreate}
                onClose={handleCloseCropImageModalCreate}
                selectedImage={selectedImageCreate}
                onCrop={handleCropCreate}
                cropperRef={cropperRefCreate}
                imageRef={imageRefCreate}
                aspectRatio={16 / 9}
            />


            {/* modal update post /*/}
            <PostModal
                role={roleUpdate}
                userOptions={userOptionsUpdate}
                isEditMode={true}
                visible={visiblePostUpdateModal}
                onClose={handleClosePostUpdateModal}
                data={dataPostUpdate}
                croppedImage={croppedImageUpdate}
                fileInputRef={fileInputRefUpdate}
                errors={updatePostErrors}
                submitLoading={submitPostUpdateLoading}
                handleSubmit={handleSubmitUpdatePost}
                handleClickUploadButton={handleClickUploadButtonUpdate}
                handleImageChange={handleImageChangeUpdate}
                setData={setDataPostUpdate}
                categoryOptions={categoryOptionsUpdate}
                editorContent={editorContentUpdate}
                setThumbnail={setThumbnailUpdate}
                setCroppedImage={setCroppedImageUpdate}
            />

            {/*modal loading create*/}
            <LoadingModal
                modalLoading={modalUpdateLoading}
            />


            {/* modal cropper untuk update */}
            <CropImageModal
                visible={visibleCropImageModalUpdate}
                onClose={handleCloseCropImageModalUpdate}
                selectedImage={selectedImageUpdate}
                onCrop={handleCropUpdate}
                cropperRef={cropperRefUpdate}
                imageRef={imageRefUpdate}
                aspectRatio={16 / 9}
            />

            {/* modal delete post */}
            <DeleteModal
                submitLoading={submitPostDeleteLoading}
                visibleModal={visiblePostDeleteModal}
                setVisibleModal={setVisiblePostDeleteModal}
                onSubmit={handleSubmitDeletePost}
            />
        </div>
    );
};

export default Post;
