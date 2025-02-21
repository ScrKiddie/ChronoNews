import React from "react";
import { Chart } from 'primereact/chart';

const Beranda = () => {
    // Data untuk Chart Bar (Batang)
    const barData = {
        labels: ["Januari", "Februari", "Maret", "April", "Mei"],
        datasets: [
            {
                label: "Berita Dibuat",
                backgroundColor: "#FFA500", // Orange
                borderColor: "#FFD700", // Kuning
                borderWidth: 1,
                data: [65, 59, 80, 81, 56],
            },
        ],
    };

    // Data untuk Chart Garis (Line)
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

    return (
        <div className="flex flex-col">
            <div className="flex-grow flex flex-wrap justify-center w-full ">
                {/* Chart Bar */}
                <div className="w-full px-4 pt-4 h-[50vh] md:h-[70vh]">
                    <div className="card shadow-md rounded-xl bg-white h-full p-4">
                        <Chart
                            type="bar"
                            data={barData}
                            options={{ responsive: true, maintainAspectRatio: false }}
                            style={{ height: "100%" }}
                        />
                    </div>
                </div>

                {/* Chart Line */}
                <div className="w-full p-4 h-[50vh] md:h-[70vh]">
                    <div className="card shadow-md rounded-xl bg-white h-full p-4">
                        <Chart
                            type="line"
                            data={lineData}
                            options={{ responsive: true, maintainAspectRatio: false }}
                            style={{ height: "100%" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Beranda;
