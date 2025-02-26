import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const ReusableTable = ({
                           handleVisibleCreateModal,
                           data,
                           children
                       }) => {
    const [globalFilter, setGlobalFilter] = useState("");
    return (
        <div>
            {/* Search Input */}
            <div className="flex justify-between mb-4 md:flex-row flex-col gap-2">
                <div className="flex justify-end gap-2">
                    <div className="p-inputgroup w-full size-11">
                        <InputText
                            placeholder="Search"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />

                    </div>
                    <Button
                        icon={<i className="pi pi-plus-circle" style={{ fontSize: '1.45rem' }}></i>}
                        className="w-11 h-11 min-w-[44px] min-h-[44px]"
                        onClick={handleVisibleCreateModal}
                    />
                </div>
            </div>

            {/* Data Table */}
            <DataTable
                value={data}
                paginator
                showGridlines
                size={"small"}
                rows={5}
                globalFilter={globalFilter}
                filterDisplay="menu"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                rowsPerPageOptions={[5, 10, 20, 50, 100]}
                currentPageReportTemplate={`Menampilkan {first} hingga {last} dari {totalRecords} data`}
            >
                {children}
            </DataTable>
        </div>
    );
};

export default ReusableTable;
