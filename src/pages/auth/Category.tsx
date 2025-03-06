import React from "react";
import {Button} from "primereact/button";
import LoadingRetry from "../../components/LoadingRetry.tsx";
import {useToast} from "../../hooks/useToast.tsx";
import {Column} from "primereact/column";
import LoadingModal from "../../components/LoadingModal.tsx";
import DeleteModal from "../../components/DeleteModal.tsx";
import CategoryModal from "../../components/CategoryModal.tsx";
import {useCategory} from "../../hooks/useCategory.tsx";
import ReusableTable from "../../components/ReusableTable.tsx";

const Category = () => {
    const toastRef = useToast();

    const {
        visibleModal,
        modalLoading,
        submitLoading,
        data,
        setData,
        errors,
        isEditMode,
        handleOpenCreateModal,
        handleOpenEditModal,
        handleCloseModal,
        handleSubmit,
        fetchData,
        visibleLoadingConnection,
        visibleConnectionError,
        listData,
        handleVisibleDeleteModal,
        setVisibleDeleteModal,
        visibleDeleteModal,
        handleSubmitDelete
    } = useCategory(toastRef);


    const actionTemplate = (rowData) => {
        return (
            <div className="flex items-center justify-center gap-2">
                <Button
                    icon={<i className="pi pi-pen-to-square" style={{fontSize: '1.4rem'}}></i>}
                    className="size-11"
                    onClick={() => handleOpenEditModal(rowData.id)}
                />
                <Button
                    icon={<i className="pi pi-trash" style={{fontSize: '1.25rem'}}></i>}
                    severity="secondary"
                    className="size-11"
                    onClick={() => {
                        handleVisibleDeleteModal(rowData.id)
                    }}
                />
            </div>
        );
    };

    return (
        <div className="m-4 min-h-full max-h-fit bg-white rounded-xl shadow-md p-4 flex flex-col">
            <div className={`${(visibleLoadingConnection || visibleConnectionError) ? "hidden" : "block"}`}>
                <ReusableTable
                    data={listData}
                    handleVisibleCreateModal={handleOpenCreateModal}
                >
                    <Column className="text-center" field="name"
                            header={<p className="text-center font-medium">Kategori</p>}/>
                    <Column body={actionTemplate} className="text-center"
                            header={<p className="text-center font-medium">Aksi</p>}/>
                </ReusableTable>
            </div>

            <LoadingRetry
                visibleConnectionError={visibleConnectionError}
                onRetry={fetchData}
                visibleLoadingConnection={visibleLoadingConnection}
            />

            <CategoryModal
                isEditMode={isEditMode}
                visible={visibleModal}
                onClose={handleCloseModal}
                data={data}
                errors={errors}
                submitLoading={submitLoading}
                handleSubmit={handleSubmit}
                setData={setData}
            />

            <LoadingModal
                modalLoading={modalLoading}
            />

            <DeleteModal
                submitLoading={submitLoading}
                visibleModal={visibleDeleteModal}
                setVisibleModal={setVisibleDeleteModal}
                onSubmit={handleSubmitDelete}
            />
        </div>
    );
};

export default Category;
