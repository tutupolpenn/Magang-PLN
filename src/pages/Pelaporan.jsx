import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineBars3, HiOutlineCalendar, HiOutlinePlus } from "react-icons/hi2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useReactToPrint } from "react-to-print";
import Sidebar from "../components/Sidebar";
import { LaporanCetak } from "../components/LaporanCetak";
import axios from "axios";

export default function Pelaporan() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [laporanData, setLaporanData] = useState([]);
  const navigate = useNavigate();
  const printRef = useRef();

  // Ambil data laporan dari API
  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const token = localStorage.getItem("token"); // ambil dari localStorage
        const res = await axios.get("http://localhost:5000/api/laporan", {
          headers: {
            Authorization: `Bearer ${token}`, // penting!
          },
        });

        console.log("RESPON API:", res.data);
        setLaporanData(res.data.laporan || []);
      } catch (err) {
        console.error("ERROR FETCH:", err);
      }
    };
    fetchLaporan();
  }, []);


  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Berita-Acara-Kerusakan-Trafo",
  });

  return (
    <div className="flex w-screen h-screen bg-gray-100 text-gray-800">
      {/* SIDEBAR */}
      <aside className="hidden md:flex md:w-64 bg-gray-200 flex-col justify-between shadow-md">
        <Sidebar active="pelaporan" />
      </aside>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-gray-200 flex flex-col justify-between shadow-md">
            <Sidebar active="pelaporan" close={() => setSidebarOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}

      {/* MAIN */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <h2 className="text-xl md:text-2xl font-bold">Pelaporan Trafo</h2>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full md:w-auto">
            {/* Date Picker */}
            <div className="relative flex items-center border rounded-lg bg-white px-3 py-2 gap-2 shadow-sm w-full sm:w-auto">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                className="outline-none text-sm w-full sm:w-28 cursor-pointer text-center"
              />
              <HiOutlineCalendar className="text-gray-600 text-xl" />
            </div>

            {/* Filter Button */}
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2 rounded-lg shadow flex items-center gap-1 justify-center w-full sm:w-auto">
              <HiOutlineBars3 className="text-xl" /> Filter
            </button>

            {/* Tambah Laporan */}
            <button
              onClick={() => navigate("/form-pelaporan")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow flex items-center gap-1 justify-center w-full sm:w-auto whitespace-nowrap"
            >
              <HiOutlinePlus className="text-lg" /> BA Kerusakan Trafo
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
          <table className="w-full min-w-[700px] md:min-w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gray-800 text-white text-left">
                <th className="p-2">No</th>
                <th className="p-2">Tanggal</th>
                <th className="p-2">Gardu Induk</th>
                <th className="p-2">Penyulang</th>
                <th className="p-2">Alamat</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {laporanData.map((laporan, index) => {
                const status = "Rusak"; // Semua laporan statusnya Rusak
                const color = "bg-red-500"; // Warna merah

                return (
                  <tr key={laporan.id} className="border-b">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">
                      {laporan.tanggalKerusakan
                        ? new Date(laporan.tanggalKerusakan).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td className="p-2">{laporan.garduInduk || "-"}</td>
                    <td className="p-2">{laporan.penyulang || "-"}</td>
                    <td className="p-2">{laporan.alamat || "-"}</td>
                    <td className="p-2">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs md:text-sm ${color}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="p-2 flex gap-2 flex-wrap">
                      <button className="px-3 py-1 bg-blue-500 text-white rounded">
                        Edit
                      </button>
                      <button
                        onClick={handlePrint}
                        className="px-3 py-1 bg-gray-700 text-white rounded"
                      >
                        Cetak
                      </button>
                    </td>
                  </tr>
                );
              })}

              {laporanData.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center p-4">
                    Data tidak tersedia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Komponen Cetak */}
        <div className="hidden">
          {laporanData[0] && (
            <LaporanCetak ref={printRef} data={laporanData[0]} />
          )}
        </div>
      </main>
    </div>
  );
}
