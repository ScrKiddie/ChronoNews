import { Dialog } from 'primereact/dialog';
import InputGroup from '../ui/InputGroup.tsx';
import SubmitButton from '../ui/SubmitButton.tsx';
import React, { Dispatch, SetStateAction } from 'react';
import { Category } from '../../types/category.ts';

interface CategoryModalProps {
    visible: boolean;
    onClose: () => void;
    data: Category;
    setData: Dispatch<SetStateAction<Category>>;
    errors: Record<string, string>;
    submitLoading: boolean;
    handleSubmit: (e?: React.FormEvent) => Promise<void>;
    isEditMode: boolean;
}

const CategoryModal = ({
    visible,
    onClose,
    data,
    setData,
    errors,
    submitLoading,
    handleSubmit,
    isEditMode,
}: CategoryModalProps) => {
    return (
        <Dialog
            closable={!submitLoading}
            header={
                <h1 className="font-medium m-0 text-xl">
                    {isEditMode ? 'Edit Kategori' : 'Buat Kategori Baru'}
                </h1>
            }
            visible={visible}
            maximizable
            className="w-[94%] md:w-[60%]"
            onHide={onClose}
        >
            <form onSubmit={handleSubmit} className="w-full">
                <div className="flex flex-col p-4 gap-4">
                    <div className="w-full">
                        <InputGroup
                            label="Nama Kategori"
                            data={data?.name}
                            error={errors.name}
                            setData={(e) => {
                                setData((prev: Category) => ({ ...prev, name: e }));
                            }}
                            setError={(e) => {
                                errors.name = e;
                            }}
                        />
                    </div>

                    <SubmitButton loading={submitLoading} />
                </div>
            </form>
        </Dialog>
    );
};

export default CategoryModal;
