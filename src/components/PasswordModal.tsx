import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Password } from "primereact/password";

const PasswordModal = ({
                           visible,
                           onClose,
                           data,
                           errors,
                           submitLoading,
                           handleSubmit,
                           setData,
                       }) => {
    return (
        <Dialog
            header={<h1 className="font-medium m-0 text-xl">Ganti Password</h1>}
            visible={visible}
            maximizable
            className="w-[94%] md:w-[50%]"
            onHide={onClose}
        >
            <form onSubmit={handleSubmit} className="w-full">
                <div className="flex flex-col p-4 gap-4">
                    {/* Password Lama */}
                    <div className="w-full">
                        <label htmlFor="oldPassword" className="block mb-1 font-medium">Password Lama</label>
                        <Password
                            id="oldPassword"
                            className="w-full"
                            invalid={errors.oldPassword}
                            placeholder="Masukkan Password Lama"
                            value={data.oldPassword}
                            toggleMask
                            feedback={false}
                            onChange={(e) => {
                                setData(prev => ({...prev, oldPassword: e.target.value}))
                                errors.oldPassword = false
                            }}
                        />
                        {errors.oldPassword && <small className="p-error">{errors.oldPassword}</small>}
                    </div>

                    {/* Password Baru */}
                    <div className="w-full">
                        <label htmlFor="password" className="block mb-1 font-medium">Password Baru</label>
                        <Password
                            id="password"
                            className="w-full"
                            invalid={errors.password}
                            placeholder="Masukkan Password Baru"
                            value={data.password}
                            toggleMask
                            feedback={false}
                            onChange={(e) => {
                                setData(prev => ({...prev, password: e.target.value}))
                                errors.password = false
                            }}
                        />
                        {errors.password && <small className="p-error">{errors.password}</small>}
                    </div>

                    {/* Konfirmasi Password */}
                    <div className="w-full">
                        <label htmlFor="confirmPassword" className="block mb-1 font-medium">Konfirmasi Password</label>
                        <Password
                            id="confirmPassword"
                            className="w-full"
                            invalid={errors.confirmPassword}
                            placeholder="Konfirmasi Password Baru"
                            value={data.confirmPassword}
                            toggleMask
                            feedback={false}
                            onChange={(e) => {
                                setData(prev => ({...prev, confirmPassword: e.target.value}))
                                errors.confirmPassword = false
                            }}
                        />
                        {errors.confirmPassword && <small className="p-error">{errors.confirmPassword}</small>}
                    </div>

                    {/* Tombol Submit */}
                    <Button
                        disabled={submitLoading}
                        className="w-full flex items-center justify-center font-normal"
                        type="submit"
                    >
                        {submitLoading ? (
                            <i className="pi pi-spin pi-spinner text-[24px]" style={{ color: "#475569" }}></i>
                        ) : (
                            "Submit"
                        )}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
};

export default PasswordModal;
