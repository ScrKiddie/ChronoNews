import {Dialog} from "primereact/dialog";
import InputGroup from "./InputGroup.tsx";
import React from "react";
import SubmitButton from "./SubmitButton.tsx";

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
                    <div className="w-full">
                        <InputGroup
                            type="password"
                            label="Password Lama"
                            data={data?.oldPassword}
                            error={errors.oldPassword}
                            setData={(e)=>{ setData(prev => ({ ...prev, oldPassword: e }));}}
                            setError={(e)=>{ errors.oldPassword = e }}
                        />
                    </div>
                    <div className="w-full">
                        <InputGroup
                            type="password"
                            label="Password Baru"
                            data={data?.password}
                            error={errors.password}
                            setData={(e)=>{ setData(prev => ({ ...prev, password: e }));}}
                            setError={(e)=>{ errors.password = e }}
                        />
                    </div>
                    <div className="w-full">
                        <InputGroup
                            type="password"
                            label="Konfirmasi Password Baru"
                            data={data?.confirmPassword}
                            error={errors.confirmPassword}
                            setData={(e)=>{ setData(prev => ({ ...prev, confirmPassword: e }));}}
                            setError={(e)=>{ errors.confirmPassword = e }}
                        />
                    </div>
                    <SubmitButton loading={submitLoading}/>
                </div>
            </form>
        </Dialog>
    );
};

export default PasswordModal;
