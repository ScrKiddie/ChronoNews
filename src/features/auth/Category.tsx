import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { useToast } from '../../hooks/useToast.tsx';
import { useCategory } from '../../hooks/useCategory.tsx';
import ReusableTable from '../../components/table/ReusableTable.tsx';
import LoadingRetry from '../../components/ui/LoadingRetry.tsx';
import CategoryModal from '../../components/modal/CategoryModal.tsx';
import LoadingModal from '../../components/modal/LoadingModal.tsx';
import DeleteModal from '../../components/modal/DeleteModal.tsx';

const Category = () => {
    const toastRef = useToast();

    const {
        modalState,
        formData,
        setFormData,
        errors,
        listData,
        connectionState,
        openModal,
        closeModal,
        handleSubmit,
        refetch,
    } = useCategory({ toastRef });

    const actionTemplate = (rowData: { id: number }) => (
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

    return (
        <div className="m-4 min-h-full max-h-fit bg-white rounded-xl shadow-md p-4 flex flex-col">
            <div
                className={`${connectionState.isLoading || connectionState.isError ? 'hidden' : 'block'}`}
            >
                <ReusableTable data={listData} handleVisibleCreateModal={() => openModal('create')}>
                    <Column
                        className="text-center"
                        field="name"
                        header={<p className="text-center font-medium">Kategori</p>}
                    />
                    <Column
                        body={actionTemplate}
                        className="text-center"
                        header={<p className="text-center font-medium">Aksi</p>}
                    />
                </ReusableTable>
            </div>

            {/* Connection Error/Loading */}
            <LoadingRetry
                visibleConnectionError={connectionState.isError}
                onRetry={refetch}
                visibleLoadingConnection={connectionState.isLoading}
            />

            {/* Create/Update Category Modal */}
            <CategoryModal
                isEditMode={modalState.mode === 'edit'}
                visible={
                    modalState.isVisible &&
                    (modalState.mode === 'create' || modalState.mode === 'edit')
                }
                onClose={closeModal}
                data={formData}
                errors={errors}
                submitLoading={modalState.isSubmitting}
                handleSubmit={handleSubmit}
                setData={setFormData}
            />

            {/* Loading Modal for fetching data */}
            <LoadingModal modalLoading={modalState.isLoading} />

            {/* Delete Category Modal */}
            <DeleteModal
                submitLoading={modalState.isSubmitting}
                visibleModal={modalState.isVisible && modalState.mode === 'delete'}
                setVisibleModal={closeModal}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default Category;
