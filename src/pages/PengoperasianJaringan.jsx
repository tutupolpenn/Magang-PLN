import React, { useState } from "react";
// PERBAIKAN: Import useNavigate untuk navigasi
import { useNavigate } from "react-router-dom"; 
import { HiOutlineBars3, HiOutlineCalendar, HiOutlinePlus } from "react-icons/hi2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Sidebar from "../components/Sidebar";

export default function Pelaporan() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  // PERBAIKAN: Inisialisasi hook useNavigate
  const navigate = useNavigate(); 

  // PERBAIKAN: Data tabel disimpan dalam state array
  const [laporanData, setLaporanData] = useState([
    { no: "01", tanggal: "15/09/2025", gardu: "GI-01", penyulang: "P1", alamat: "Jl. Mawar 1", status: "Rusak", color: "bg-red-400" },
    
  ]);

  return (
    <div className="flex w-screen h-screen bg-gray-100 text-gray-800">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex md:w-64 bg-gray-200 flex-col justify-between shadow-md">
        <Sidebar active="pengoperasian" />
      </aside>

      {/* SIDEBAR MOBILE */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-gray-200 flex flex-col justify-between shadow-md">
            <Sidebar active="pengoperasian" close={() => setSidebarOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        {/* PERBAIKAN: Struktur header disederhanakan dan dibuat lebih konsisten */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold">Pengoperasian Jaringan</h2>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded hover:bg-gray-200 md:hidden"
            >
              <HiOutlineBars3 className="text-2xl" />
            </button>
          </div>

          {/* FILTER + BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full md:w-auto">
            <div className="relative flex items-center border rounded-lg bg-white px-3 py-2 gap-2 shadow-sm w-full sm:w-auto">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                className="outline-none text-sm w-full sm:w-28 cursor-pointer text-center"
              />
              <HiOutlineCalendar className="text-gray-600 text-xl" />
            </div>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2 rounded-lg shadow flex items-center gap-1 justify-center w-full sm:w-auto">
              <HiOutlineBars3 className="text-xl" /> Filter
            </button>
            <button
              onClick={() => navigate("/form-pengoperasian")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow flex items-center gap-1 justify-center w-full sm:w-auto whitespace-nowrap"
            >
              <HiOutlinePlus className="text-lg" /> Hasil Test Jaringan Distribusi
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
              {/* PERBAIKAN: Merender baris tabel secara dinamis dari state */}
              {laporanData.map((laporan) => (
                <Row
                  key={laporan.no}
                  no={laporan.no}
                  tanggal={laporan.tanggal}
                  gardu={laporan.gardu}
                  penyulang={laporan.penyulang}
                  alamat={laporan.alamat}
                  status={laporan.status}
                  color={laporan.color}
                />
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

/* Row component */
function Row({ no, tanggal, gardu, penyulang, alamat, status, color }) {
  return (
    <tr className="border-b">
      <td className="p-2">{no}</td>
      <td className="p-2">{tanggal}</td>
      <td className="p-2">{gardu}</td>
      <td className="p-2">{penyulang}</td>
      <td className="p-2">{alamat}</td>
      <td className="p-2">
        <span className={`px-3 py-1 rounded-full text-white text-xs md:text-sm ${color}`}>
          {status}
        </span>
      </td>
      <td className="p-2 space-x-2 flex flex-wrap gap-1">
        <button className="px-3 py-1 bg-blue-500 text-white rounded">Edit</button>
        <button className="px-3 py-1 bg-gray-700 text-white rounded">Cetak</button>
      </td>
    </tr>
  );
}
