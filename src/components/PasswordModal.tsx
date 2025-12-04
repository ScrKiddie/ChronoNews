import {Dialog} from "primereact/dialog";
import InputGroup from "./InputGroup.tsx";
import SubmitButton from "./SubmitButton.tsx";
import {Dispatch, SetStateAction} from "react";

interface PasswordData {
    oldPassword: string;
    password: string;
    confirmPassword: string;
}

interface PasswordModalProps {
    visible: boolean;
    onClose: () => void;
    data: PasswordData;
    errors: Record<string, string>;
    submitLoading: boolean;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    setData: Dispatch<SetStateAction<PasswordData>>;
}

const PasswordModal = ({
                           visible,
                           onClose,
                           data,
                           errors,
                           submitLoading,
                           handleSubmit,
                           setData,
                       }: PasswordModalProps) => {
    return (
        <Dialog
            closable={!submitLoading}
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
                            setData={(e: string) => {
                                setData((prev: PasswordData) => ({...prev, oldPassword: e}));
                            }}
                            setError={(e: string) => {
                                errors.oldPassword = e
                            }}
                        />
                    </div>
                    <div className="w-full">
                        <InputGroup
                            type="password"
                            label="Password Baru"
                            data={data?.password}
                            error={errors.password}
                            setData={(e: string) => {
                                setData((prev: PasswordData) => ({...prev, password: e}));
                            }}
                            setError={(e: string) => {
                                errors.password = e
                            }}
                        />
                    </div>
                    <div className="w-full">
                        <InputGroup
                            type="password"
                            label="Konfirmasi Password Baru"
                            data={data?.confirmPassword}
                            error={errors.confirmPassword}
                            setData={(e: string) => {
                                setData((prev: PasswordData) => ({...prev, confirmPassword: e}));
                            }}
                            setError={(e: string) => {
                                errors.confirmPassword = e
                            }}
                        />
                    </div>
                    <SubmitButton loading={submitLoading}/>
                </div>
            </form>
        </Dialog>
    );
};

export default PasswordModal;
