import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog';

interface DeleteModalProps {
    visibleModal: boolean;
    setVisibleModal: () => void;
    onSubmit: () => void;
    submitLoading: boolean;
}

const DeleteModal = ({
    visibleModal,
    setVisibleModal,
    onSubmit,
    submitLoading,
}: DeleteModalProps) => {
    const footer = (
        <div className="flex justify-end gap-2">
            <Button
                className="flex items-center justify-center font-normal"
                onClick={() => {
                    setVisibleModal();
                }}
                text
                disabled={submitLoading}
            >
                Batal
            </Button>
            <Button
                className="flex items-center justify-center font-normal"
                onClick={() => {
                    onSubmit();
                }}
                disabled={submitLoading}
            >
                {submitLoading ? (
                    <i
                        className="pi pi-spin pi-spinner text-[24px] w-[51px]"
                        style={{ color: '#475569' }}
                    ></i>
                ) : (
                    'Delete'
                )}
            </Button>
        </div>
    );
    return (
        <ConfirmDialog
            visible={visibleModal}
            closable={false}
            header={<h1 className="font-medium m-0 text-xl">Hapus</h1>}
            message="Apakah Anda yakin ingin menghapus data ini?"
            className="w-[94%] md:w-[40%]"
            footer={footer}
        />
    );
};

export default DeleteModal;
