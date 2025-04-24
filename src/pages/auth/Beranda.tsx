import React, {useState} from "react";
import { Chart } from 'primereact/chart';
import { Card } from "primereact/card";
import { Ripple } from "primereact/ripple";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.tsx";
import useSearchPost from "../../hooks/useSearchPost.tsx";
import { Paginator } from 'primereact/paginator';
import LoadingRetry from "../../components/LoadingRetry.tsx";
import {Dropdown} from "primereact/dropdown";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
const Beranda = () => {
    const navigate = useNavigate();
    const { role } = useAuth();

    const {
        data,
        page,
        setPage,
        size,
        setSize,
        totalItem,
        visibleLoadingConnection,
        visibleConnectionError,
        fetchData,
        setEndDate,
        setStartDate
    } = useSearchPost({ countMode: true});

    const handlePageChange = (e) => {
        setPage(e.page + 1);
        setSize(e.rows);
    };

    const list = [
        {
            icon: <i className="pi pi-users text-[#f59e0b]" style={{ fontSize: '2rem' }}></i>,
            title: "Jurnalis",
            desc: "Kelola jurnalis",
            route: "/admin/jurnalis",
        },
        {
            icon: <i className="pi pi-paperclip text-[#f59e0b]" style={{ fontSize: '2rem' }}></i>,
            title: "Kategori",
            desc: "Kelola kategori",
            route: "/admin/kategori",
        },
        {
            icon: <i className="pi pi-file text-[#f59e0b]" style={{ fontSize: '2rem' }}></i>,
            title: "Berita",
            desc: "Kelola berita",
            route: "/admin/berita",
        },
    ];

    const barData = {
        labels: data.map(item => item.title.length > 15 ? item.title.slice(0, 15) + "..." : item.title),
        datasets: [
            {
                label: "Jumlah Pengunjung",
                data: data.map(item => item.viewCount || 0),

                backgroundColor: "rgba(245, 158, 11,0.2)",
                borderColor: "#f59e0b",
                borderWidth: 1,
            }
        ]
    };
    const waktuOptions = [
        { label: 'Hari Ini', value: '1' },
        { label: '7 Hari Terakhir', value: '7' },
        { label: '30 Hari Terakhir', value: '30' },
        { label: 'Semua Waktu', value: 'all' }
    ];


    const [range, setRange] = useState('all');
    const filteredList = role === 'admin' ? list : list.filter(item => item.title === "Berita");
    return (
        <div className={`min-h-screen`}>
            <div className="flex flex-col ">
                <div className="flex-grow flex flex-wrap w-full">
                    <div
                        className={`flex gap-4 justify-between m-4 md:flex-row flex-col ${role === 'admin' ? "w-full" : "w-full md:w-1/3"}`}>
                        {filteredList.map((item, index) => (
                            <div
                                onClick={() => navigate(item.route)}
                                className="shadow-md rounded-xl w-full h-full p-ripple cursor-pointer"
                                key={index}
                            >
                                <Ripple pt={{
                                    root: {
                                        style: {background: "rgba(245, 158, 11,0.5)"},
                                    },
                                }}/>
                                <Card
                                    className="h-full w-full flex flex-col items-center justify-center"
                                    style={{fontFamily: "Poppins"}}
                                >
                                    <div
                                        className="flex w-full flex-col items-center justify-center h-full text-center">
                                        <div className="text-xl font-medium mb-4">{item.title}</div>
                                        {item.icon && <div className="text-4xl mb-4">{item.icon}</div>}
                                        <div className="text-xl text-center">{item.desc}</div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                    <div className="w-full px-4 pb-4 h-fit">
                        <div className="card shadow-md rounded-xl bg-white p-4 h-fit">

                            {visibleLoadingConnection ? (
                                <LoadingRetry
                                    visibleConnectionError={visibleConnectionError}
                                    onRetry={fetchData}
                                    visibleLoadingConnection={visibleLoadingConnection}
                                />
                            ) : (
                                <>
                                    <Chart
                                        className={`min-h-[50vh] md:min-h-[60vh]`}
                                        type="bar"
                                        data={barData}
                                        options={{
                                            indexAxis: 'y',
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                tooltip: {
                                                    callbacks: {
                                                        title: (tooltipItems) => {
                                                            const index = tooltipItems[0].dataIndex;
                                                            return data[index]?.title || "Tanpa Judul";
                                                        }
                                                    },
                                                    titleFont: {family: "Poppins"},
                                                    bodyFont: {family: "Poppins"}
                                                },
                                                legend: {
                                                    labels: {font: {family: "Poppins", size: 14}}
                                                }
                                            },
                                            scales: {
                                                x: {ticks: {font: {family: "Poppins"}}},
                                                y: {ticks: {font: {family: "Poppins"}}}
                                            }
                                        }}
                                        style={{height: "100%"}}
                                    />
                                    <span className={`flex w-full items-center  justify-center mb-2`}>

                                        </span>
                                    <Paginator
                                        first={(page - 1) * size}
                                        rows={size}
                                        totalRecords={totalItem}
                                        onPageChange={handlePageChange}
                                        rowsPerPageOptions={[5, 10, 20, 50]}
                                        rightContent={<Dropdown
                                            value={range}
                                            options={waktuOptions}
                                            onChange={(e) => {
                                                const value = e.value;
                                                setRange(value);
                                                let start = null;
                                                let end = dayjs().endOf('day').utc().unix();
                                                if (value === '1') {
                                                    start = dayjs().startOf('day').utc().unix();
                                                } else if (value === '7') {
                                                    start = dayjs().subtract(6, 'day').startOf('day').utc().unix();
                                                } else if (value === '30') {
                                                    start = dayjs().subtract(29, 'day').startOf('day').utc().unix();
                                                } else {
                                                    start = null;
                                                    end = null;
                                                }
                                                setStartDate(start);
                                                setEndDate(end);
                                                setPage(1)
                                                return
                                            }}
                                            placeholder="Pilih Waktu"
                                            className={`md:w-[200px] w-full`}
                                        />}
                                        className={`custom-pg`}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Beranda;
