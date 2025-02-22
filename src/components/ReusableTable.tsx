import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const ReusableTable = ({
                           handleVisibleCreateModal,
                           data,
                           totalItem,
                           page,
                           size,
                           onPageChange,
                           actionTemplate,
                           sizeOptions,
                           searchParams,
                           setSearchParams,
                           onSearch,
                            children

                       }) => {
    return (
        <div>
            {/* Search Input */}
            <div className="flex justify-between mb-4 md:flex-row flex-col gap-2">
                <div className="flex justify-end  gap-2" >
                <div className="p-inputgroup w-full size-11">
                    <InputText
                        placeholder="Search..."
                        value={searchParams.name || searchParams.email || searchParams.phoneNumber}
                        onChange={(e) => {
                            setSearchParams({
                                ...searchParams,
                                email: e.target.value,
                                name: e.target.value,
                                phoneNumber: e.target.value
                            });
                        }}
                    />
                    <Button
                        icon={<i className="pi pi-sync" style={{fontSize: '1.25rem'}}></i>}
                        className="w-11 h-11"
                        onClick={onSearch}
                    />
                </div>
                <Button
                    icon={<i className="pi pi-plus-circle" style={{fontSize: '1.45rem'}}></i>}
                    severity="secondary"
                    className="w-11 h-11 min-w-[44px] min-h-[44px]"
                    onClick={handleVisibleCreateModal}
                />
            </div>
        </div>

    {/* Data Table */
    }
    <DataTable
        value={data}
        paginator
        rows={size}
        totalRecords={totalItem}
        lazy
        first={(page - 1) * size}
        onPage={(e) => onPageChange(e.page + 1, e.rows)}
        showGridlines
                size={"small"}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                rowsPerPageOptions={sizeOptions}
        currentPageReportTemplate={`Menampilkan ${totalItem == 0 ? 0 : Math.min((page - 1) * size + 1, totalItem)} hingga ${Math.min(page * size, totalItem)} dari ${totalItem} data`}
            >
        {children}

            </DataTable>
        </div>
    );
};

export default ReusableTable;
