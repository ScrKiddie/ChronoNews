import emptyData from "../../public/empty-image.webp";
import React from "react";

const EmptyData = () => {
  return (
      <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full flex flex-col h-fit justify-center items-center">
              <img src={emptyData} className="lg:w-[15%] w-[60%]" alt="emptyData"/>
              <h3 className="text-[#4d555e] text-2xl font-[600] mt-2 text-center break-all">
                  Data Tidak Ditemukan
              </h3>
              <p className="text-[#4d555e] text-center">
                  Data yang kamu cari belum tersedia.
              </p>
          </div>
      </div>

  )
}
export default EmptyData