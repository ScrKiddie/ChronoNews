import React from "react";
import {Chart} from 'primereact/chart';
import {Card} from "primereact/card";
import {Ripple} from "primereact/ripple";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth.tsx";


const Beranda = () => {
    const navigate = useNavigate();
    const {role} = useAuth();

    const lineData = {
        labels: ["Januari", "Februari", "Maret", "April", "Mei"],
        datasets: [
            {
                label: "Pengunjung Web",
                data: [40, 55, 75, 90, 120],
                fill: false,
                borderColor: "#FFA500",
                tension: 0.4,
            },
        ],
    };
    const list = [
        {
            icon: <i className="pi pi-users text-[#f59e0b]" style={{fontSize: '2rem'}}></i>,
            title: "Jurnalis",
            desc: "Kelola jurnalis",
            route: "/admin/jurnalis",
        },
        {
            icon: <i className="pi pi-paperclip text-[#f59e0b]" style={{fontSize: '2rem'}}></i>,
            title: "Kategori",
            desc: "Kelola kategori",
            route: "/admin/kategori",
        },
        {
            icon: <i className="pi pi-file text-[#f59e0b]" style={{fontSize: '2rem'}}></i>,
            title: "Berita",
            desc: "Kelola berita",
            route: "/admin/berita",
        },

    ];
    const filteredList = role === 'admin' ? list : list.filter(item => item.title === "Berita");
    return (
        <div className="flex flex-col">
            <div className="flex-grow flex flex-wrap w-full ">
                <div
                    className={`flex gap-4 justify-between m-4 md:flex-row flex-col ${role === 'admin' ? "w-full" : "w-full md:w-1/3"}`}>
                    {filteredList.map((item, index) => (
                        <div
                            onClick={() => navigate(item.route)}
                            className=" shadow-md rounded-xl w-full h-full p-ripple"
                            key={index}
                        >
                            <Ripple
                                pt={
                                    {
                                        root: {
                                            style: {background: "rgba(245, 158, 11,0.5)"},
                                        },
                                    }
                                }
                            />
                            <Card
                                key={index}
                                className="h-full w-full flex flex-col items-center justify-center cursor-pointer "
                                style={{fontFamily: "Poppins"}}
                            >
                                <div className="flex w-full flex-col items-center justify-center h-full">
                                    <div className="text-xl font-medium mb-4">{item.title}</div>
                                    {item.icon && <div className="text-4xl mb-4">{item.icon}</div>}
                                    <div className="text-xl text-center">{item.desc}</div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>

                <div className="w-full px-4 pb-4 h-[50vh] md:h-[70vh]">
                    <div className="card shadow-md rounded-xl bg-white h-full p-4">
                        <Chart
                            type="line"
                            data={lineData}
                            options={{responsive: true, maintainAspectRatio: false}}
                            style={{height: "100%"}}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Beranda;
