import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const ReusableTable = ({
                           handleVisibleCreateModal,
                           data,
                           totalRecords,
                           page,
                           size,
                           onPageChange,
                           actionTemplate,
                           loading,
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
                        placeholder="Cari..."
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
                        icon={<i className="pi pi-search" style={{fontSize: '1.25rem'}}></i>}
                        className="w-11 h-11"
                        onClick={onSearch}
                    />
                </div>
                <Button
                    icon={<i className="pi pi-plus" style={{fontSize: '1.25rem'}}></i>}
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
        totalRecords={totalRecords}
        lazy
        loading={loading}
        first={(page - 1) * size}
        onPage={(e) => onPageChange(e.page + 1, e.rows)}
        showGridlines
                size={"small"}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                rowsPerPageOptions={sizeOptions}
                currentPageReportTemplate={`Menampilkan ${(page - 1) * size + 1} hingga ${Math.min(page * size, totalRecords)} dari ${totalRecords} data`}
            >
        {children}

            </DataTable>
        </div>
    );
};

export default ReusableTable;
