import React from "react";
import {Button} from "primereact/button";
import {ConfirmDialog} from "primereact/confirmdialog";

const LogoutModal = ({visible, setVisible, onLogout}) => {
    const footer = (
        <div className="flex justify-end gap-2">
            <Button
                className="flex items-center justify-center font-normal"
                onClick={() => {
                    setVisible(false);
                }}
                text
            >Batal</Button>
            <Button
                className="flex items-center justify-center font-normal"
                onClick={() => {
                    setVisible(false);
                    onLogout();
                }}
            >Keluar</Button>
        </div>
    );
    return (
        <ConfirmDialog
            visible={visible}
            closable={false}
            group="templating"
            header={<h1 className="font-medium m-0 text-xl">Keluar</h1>}
            message="Apakah Anda yakin ingin keluar?"
            className="w-[94%] md:w-[40%]"
            footer={footer}
        />
    );
};

export default LogoutModal;
