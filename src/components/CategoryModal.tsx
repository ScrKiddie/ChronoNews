import {Dialog} from "primereact/dialog";
import InputGroup from "./InputGroup.tsx";
import React from "react";
import SubmitButton from "./SubmitButton.tsx";

const CategoryModal = ({
                           visible,
                           onClose,
                           data,
                           setData,
                           errors,
                           submitLoading,
                           handleSubmit,
                           isEditMode,
                       }) => {
    return (
        <Dialog
            header={
                <h1 className="font-medium m-0 text-xl">
                    {isEditMode
                        ? "Edit Kategori" : "Buat Kategori Baru"
                    }
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
                            setData={(e)=>{ setData(prev => ({ ...prev, name: e }));}}
                            setError={(e)=>{ errors.name = e }}
                        />
                    </div>

                    <SubmitButton loading={submitLoading}/>
                </div>
            </form>
        </Dialog>
    );
};

export default CategoryModal;
