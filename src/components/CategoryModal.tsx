import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
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
                    {/* Avatar hanya untuk mode profile */}

                    <div className="w-full">
                        <label htmlFor="name" className="block mb-1 font-medium">
                            Nama Kategori
                        </label>
                        <InputText
                            id="name"
                            className="w-full"
                            invalid={errors.name}
                            placeholder="Masukkan Nama Kategori"
                            value={data?.name}
                            onChange={(e) => {
                                setData((prev) => ({...prev, name: e.target.value}));
                                errors.name = false;
                            }}
                        />
                        {errors.name && <small className="p-error">{errors.name}</small>}
                    </div>

                    <Button
                        disabled={submitLoading}
                        className="w-full flex items-center justify-center font-normal"
                        type="submit"
                    >
                        {submitLoading ? (
                            <i className="pi pi-spin pi-spinner text-[24px]" style={{color: "#475569"}}></i>
                        ) : (
                            "Submit"
                        )}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
};

export default CategoryModal;
