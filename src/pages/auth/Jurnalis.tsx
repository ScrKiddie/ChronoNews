import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";

const Jurnalis = () => {
    const [data, setData] = useState([
        { nomor: 1, name: "Budi Santoso", email: "budi@email.com", phone: "08123456789" },
        { nomor: 2, name: "Ani Wijaya", email: "ani@email.com", phone: "08129876543" },
        { nomor: 3, name: "Siti Rahma", email: "siti@email.com", phone: "08134567890" },
        { nomor: 4, name: "Joko Widodo", email: "joko@email.com", phone: "08125678901" },
        { nomor: 5, name: "Dewi Sartika", email: "dewi@email.com", phone: "08137890123" },
        { nomor: 1, name: "Budi Santoso", email: "budi@email.com", phone: "08123456789" },
        { nomor: 2, name: "Ani Wijaya", email: "ani@email.com", phone: "08129876543" },
        { nomor: 3, name: "Siti Rahma", email: "siti@email.com", phone: "08134567890" },
        { nomor: 4, name: "Joko Widodo", email: "joko@email.com", phone: "08125678901" },
        { nomor: 5, name: "Dewi Sartika", email: "dewi@email.com", phone: "08137890123" },
    ]);

    const [search, setSearch] = useState("");

    const onSearch = (e) => {
        setSearch(e.target.value);
    };

    // Filter berdasarkan pencarian
    const filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase()) ||
        item.phone.includes(search)
    );

    // Fungsi Edit
    const handleEdit = (rowData) => {
        alert(`Edit jurnalis: ${rowData.name}`);
    };

    // Fungsi Delete
    const handleDelete = (rowData) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus ${rowData.name}?`)) {
            setData(data.filter(item => item.nomor !== rowData.nomor));
        }
    };

    // Template Aksi Edit & Delete
    const actionTemplate = (rowData) => {
        return (
            <div className="flex items-center justify-center gap-2">
                <Button icon={<i className={`pi pi-pen-to-square`} style={{fontSize: '1.25rem'}}></i>} className="size-11"
                        onClick={() => handleEdit(rowData)}/>
                <Button icon={<i className={`pi pi-trash`} style={{fontSize: '1.25rem'}}></i>}
                        severity="secondary" className="size-11" onClick={() => handleDelete(rowData)} />
            </div>
        );
    };

    return (
        <div className="m-4 min-h-full  max-h-fit bg-white rounded-xl shadow-md p-4 flex flex-col">
            {/* Pencarian */}


            {/*<div className="flex flex-grow items-center justify-center text-center font-medium text-3xl">*/}
            {/*    <div>*/}
            {/*        Connection Lost*/}
            {/*        <p className="font-normal text-xl mb-3 mt-1">*/}
            {/*            It seems there is an error with your internet connection.*/}
            {/*        </p>*/}
            {/*        <Button severity="secondary">*/}
            {/*            Retry*/}
            {/*        </Button>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/*<div className="flex flex-grow items-center justify-center">*/}
            {/*    <i className="pi pi-spin pi-spinner text-[10vh]"*/}
            {/*       style={{color: '#64748b', animationDuration: '1s'}}></i>*/}
            {/*</div>*/}
            <>
                <div className="flex justify-between mb-4">
                    <div className="p-inputgroup w-full size-11">
                        <InputText placeholder="Search..." value={search} onChange={onSearch}/>
                        <Button icon={<i className={`pi pi-search`} style={{fontSize: '1.25rem'}}></i>}
                                className="w-11 h-11"/>
                    </div>
                    <Button
                        icon={<i className={`pi pi-user-plus`} style={{fontSize: '1.25rem'}}></i>}
                        severity="secondary"
                        className="ml-2 w-11 h-11 min-w-[44px] min-h-[44px]"
                    />
                </div>
                <DataTable
                    value={filteredData}
                    paginator
                    rows={10}
                    showGridlines
                    size={"small"}
                >
                    <Column className={`text-center`} field="name"
                            header={<p className="text-center font-medium">Nama</p>}/>
                    <Column className={`text-center`} field="email"
                            header={<p className="text-center font-medium">Email</p>}/>
                    <Column className={`text-center`} field="phone"
                            header={<p className="text-center font-medium">Telepon</p>}/>
                    <Column body={actionTemplate} className={`text-center`} field="nomor"
                            header={<p className="text-center font-medium">Aksi</p>}/>
                </DataTable>
            </>


            {/*<div*/}
            {/*    className={`flex item-center justify-center  p-dialog-mask p-dialog-center p-component-overlay p-component-overlay-enter`}*/}
            {/*    data-pc-section="mask"*/}
            {/*    style={{*/}
            {/*        height: '100%',*/}
            {/*        width: '100%',*/}
            {/*        left: 0,*/}
            {/*        top: 0,*/}
            {/*        justifyContent: 'center',*/}
            {/*        alignItems: 'center',*/}
            {/*        zIndex: 1000*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <i className="pi pi-spin pi-spinner text-[10vh]"*/}
            {/*       style={{color: '#f59e0b', animationDuration: '1s'}}></i>*/}
            {/*</div>*/}

        </div>
    );
};

export default Jurnalis;
