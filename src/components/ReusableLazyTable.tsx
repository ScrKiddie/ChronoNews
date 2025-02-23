import React, {useCallback, useEffect, useState} from "react";
import {DataTable} from "primereact/datatable";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {debounce} from "lodash";

const ReusableLazyTable = ({
                               handleVisibleCreateModal,
                               data,
                               totalItem,
                               page,
                               size,
                               onPageChange,
                               searchParams,
                               setSearchParams,
                               onSearch,
                               children

                           }) => {

    const [searchValue, setSearchValue] = useState(searchParams.name || "");
    const debouncedSearch = useCallback(
        debounce((value) => {
            setSearchParams((prev) => {
                return {
                    ...prev,
                    email: value,
                    name: value,
                    phoneNumber: value
                };
            });
        }, 300), // 300ms delay
        [setSearchParams]
    );

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        debouncedSearch(e.target.value);
    };

    useEffect(() => {
        onSearch();
    }, [searchParams]);

    return (
        <div>
            {/* Search Input */}
            <div className="flex justify-between mb-4 md:flex-row flex-col gap-2">
                <div className="flex justify-end  gap-2">
                    <div className="p-inputgroup w-full size-11">
                        <InputText
                            placeholder="Search"
                            value={searchValue}
                            onChange={handleSearchChange}
                        />

                    </div>
                    {/*<Button*/}
                    {/*    icon={<i className="pi pi-sync" style={{fontSize: '1.25rem'}}></i>}*/}
                    {/*    className="w-11 h-11 min-w-[44px] min-h-[44px]"*/}
                    {/*    onClick={onSearch}*/}
                    {/*/>*/}
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
                rowsPerPageOptions={[5, 10, 20, 50, 100]}
                currentPageReportTemplate={`Menampilkan ${totalItem == 0 ? 0 : Math.min((page - 1) * size + 1, totalItem)} hingga ${Math.min(page * size, totalItem)} dari ${totalItem} data`}
            >
                {children}

            </DataTable>
        </div>
    );
};

export default ReusableLazyTable;
