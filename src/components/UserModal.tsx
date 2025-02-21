import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import defaultProfilePicture from "../../public/profilepicture.svg";
const ModalUser = ({
                       visible,
                       onClose,
                       data,
                       setData,
                       croppedImage,
                       fileInputRef,
                       errors,
                       submitLoading,
                       handleSubmit,
                       handleClickUploadButton,
                       handleImageChange,
                       isUserCreateMode,
                       isUserEditMode,
                       isProfileMode,
                   }) => {
    return (
        <Dialog
            header={
                <h1 className="font-medium m-0 text-xl">
                    {isUserCreateMode
                        ? "Buat Pengguna Baru"
                        : isUserEditMode
                            ? "Edit Pengguna"
                            : "Ubah Profil"}
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
                    <div className="relative w-fit mx-auto flex justify-center items-center">
                        <img
                            src={croppedImage || (data?.profilePicture ? `http://localhost:3000/profile_picture/${data?.profilePicture}`  : `${defaultProfilePicture}` ) }
                            className="mr-2 size-[12rem] bg-[#f49f14] rounded-full"
                            style={{
                                border: "2.4px solid white",
                                boxShadow: "0 0 0 2.4px #f59e0b",
                            }}
                        />

                        {/* Tombol Upload Gambar */}
                        <Button
                            onClick={handleClickUploadButton}
                            icon={<i className="pi pi-image block" style={{fontSize: "1.3rem"}}></i>}
                            type="button"
                            className="absolute bottom-2 right-3 rounded-full size-[3rem]"
                            style={{
                                border: "2.4px solid white",
                                boxShadow: "0 0 0 2.4px #f59e0b",
                            }}
                        />
                        <input
                            ref={fileInputRef}
                            id="file-upload"
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="name" className="block mb-1 font-medium">
                            Nama Lengkap
                        </label>
                        <InputText
                            id="name"
                            className="w-full"
                            invalid={errors.name}
                            placeholder="Masukkan Nama Lengkap"
                            value={data?.name}
                            onChange={(e) => {
                                setData((prev) => ({...prev, name: e.target.value}));
                                errors.name = false;
                            }}
                        />
                        {errors.name && <small className="p-error">{errors.name}</small>}
                    </div>

                    <div className="w-full">
                        <label htmlFor="email" className="block mb-1 font-medium">
                            Email
                        </label>
                        <InputText
                            id="email"
                            className="w-full"
                            invalid={errors.email}
                            placeholder="Masukkan Email"
                            value={data?.email}
                            onChange={(e) => {
                                setData((prev) => ({...prev, email: e.target.value}));
                                errors.email = false;
                            }}
                        />
                        {errors.email && <small className="p-error">{errors.email}</small>}
                    </div>

                    <div className="w-full">
                        <label htmlFor="phoneNumber" className="block mb-1 font-medium">
                            Telepon
                        </label>
                        <InputText
                            id="phoneNumber"
                            className="w-full"
                            invalid={errors.phoneNumber}
                            placeholder="Masukkan Nomor Telepon"
                            value={data?.phoneNumber}
                            onChange={(e) => {
                                setData((prev) => ({...prev, phoneNumber: e.target.value}));
                                errors.phoneNumber = false;
                            }}
                        />
                        {errors.phoneNumber && <small className="p-error">{errors.phoneNumber}</small>}
                    </div>

                    {/* Input Password untuk Create & Edit */}
                    {(isUserCreateMode || isUserEditMode) && (
                        <div className="w-full">
                            <label htmlFor="password" className="block mb-1 font-medium">
                                Password
                            </label>
                            <Password
                                id="password"
                                className="w-full"
                                invalid={errors.password}
                                placeholder={isUserEditMode ? "Kosongkan jika tidak ingin mengubah password" : "Masukkan Password"}
                                value={data?.password || ""}
                                onChange={(e) => {
                                    setData((prev) => ({...prev, password: e.target.value}));
                                    errors.password = false;
                                }}
                                toggleMask
                                feedback={isUserCreateMode} // Feedback hanya di create mode
                            />
                            {errors.password && <small className="p-error">{errors.password}</small>}
                            {isUserEditMode &&
                                <small className="text-gray-500">Kosongkan jika tidak ingin mengubah password</small>}
                        </div>
                    )}

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

export default ModalUser;
