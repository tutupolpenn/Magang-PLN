// src/pages/PengoperasianJaringan.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
 HiOutlineBars3,
 HiOutlineCalendar,
 HiOutlinePlus,
 HiOutlinePrinter,
 HiOutlinePencil,
 HiOutlineTrash,
 HiOutlineDocumentText, // Icon Excel
} from "react-icons/hi2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import Swal from "sweetalert2";
import * as XLSX from "xlsx"; // Import Library XLSX


// 🔹 Komponen Baris Tabel (Dipisah agar rapi)
function Row({ no, ulp, pekerjaan, pelanggan, tanggal, alamat, onEdit, onCetak, onHapus }) {
 return (
   <tr className="border-b hover:bg-gray-50 transition-colors">
     <td className="p-3 text-gray-700">{no}</td>
     <td className="p-3 text-gray-700">{ulp}</td>
     <td className="p-3 text-gray-700">{pekerjaan}</td>
     <td className="p-3 text-gray-700">{pelanggan}</td>
     <td className="p-3 text-gray-700">{tanggal}</td>
     <td className="p-3 text-gray-700">{alamat}</td>
     <td className="p-3 flex justify-center gap-2">
       {/* Tombol Edit */}
       <button
         onClick={onEdit}
         style={{ backgroundColor: "#eff6ff", color: "#2563eb", border: "none" }} // Biru muda
         className="p-2 rounded-lg hover:brightness-95 transition shadow-sm"
         title="Edit Data"
       >
         <HiOutlinePencil className="w-5 h-5" />
       </button>


       {/* Tombol Cetak */}
       <button
         onClick={onCetak}
         style={{ backgroundColor: "#f3f4f6", color: "#4b5563", border: "none" }} // Abu muda
         className="p-2 rounded-lg hover:brightness-95 transition shadow-sm"
         title="Cetak Laporan"
       >
         <HiOutlinePrinter className="w-5 h-5" />
       </button>


       {/* Tombol Hapus */}
       <button
         onClick={onHapus}
         style={{ backgroundColor: "#fef2f2", color: "#dc2626", border: "none" }} // Merah muda
         className="p-2 rounded-lg hover:brightness-95 transition shadow-sm"
         title="Hapus Data"
       >
         <HiOutlineTrash className="w-5 h-5" />
       </button>
     </td>
   </tr>
 );
}


export default function PengoperasianJaringan() {
 const [sidebarOpen, setSidebarOpen] = useState(false);
 const navigate = useNavigate();


 // State Data
 const [laporanData, setLaporanData] = useState([]); // Master Data
 const [filteredData, setFilteredData] = useState([]); // Data Tampil
  // State Filter DatePicker
 const [dateRange, setDateRange] = useState([null, null]);
 const [startDate, endDate] = dateRange;


 // ✅ Setup instance axios
 const api = axios.create({
   baseURL: "http://localhost:5000/api",
   withCredentials: true,
 });


 // ✅ Ambil data dari backend
 useEffect(() => {
   const fetchData = async () => {
     try {
       const token = localStorage.getItem("token");


       if (!token) {
         Swal.fire("Sesi berakhir", "Silakan login kembali.", "warning");
         navigate("/login");
         return;
       }


       const res = await api.get("/test-jaringan", {
         headers: { Authorization: `Bearer ${token}` },
       });


       // Sort data terbaru di atas berdasarkan ID
       const sortedData = res.data.sort((a, b) => b.id - a.id);
      
       setLaporanData(sortedData);
       setFilteredData(sortedData); // Set awal filtered sama dengan master
     } catch (err) {
       console.error("Gagal mengambil data:", err);
       if (err.response?.status === 401) {
         navigate("/login");
       }
     }
   };


   fetchData();
 }, [navigate]);


 // === FILTER LOGIC ===
 const handleFilter = () => {
   if (!startDate || !endDate) {
     Swal.fire("Peringatan", "Pilih rentang tanggal terlebih dahulu!", "warning");
     return;
   }


   const mulai = new Date(startDate).setHours(0, 0, 0, 0);
   const selesai = new Date(endDate).setHours(23, 59, 59, 999);


   const hasil = laporanData.filter((item) => {
     if (!item.tanggalTest) return false;
     const tgl = new Date(item.tanggalTest).getTime();
     return tgl >= mulai && tgl <= selesai;
   });


   setFilteredData(hasil);


   if (hasil.length === 0) {
     Swal.fire("Tidak ada data", "Tidak ditemukan laporan pada rentang ini.", "info");
   }
 };


 const handleResetFilter = () => {
   setFilteredData(laporanData);
   setDateRange([null, null]);
 };


 // === EXPORT EXCEL FUNCTION ===
 const handleExportExcel = () => {
   // Gunakan filteredData agar sesuai tampilan tabel
   if (filteredData.length === 0) {
     Swal.fire("Info", "Tidak ada data untuk diexport", "info");
     return;
   }


   // Mapping data agar header excel rapi
   const dataToExport = filteredData.map((item, index) => ({
     No: index + 1,
     "ID Laporan": item.id,
     "Tanggal Test": item.tanggalTest
       ? new Date(item.tanggalTest).toLocaleDateString("id-ID")
       : "-",
     "ULP": item.ulp || "-",
     "Nama Pekerjaan": item.namaPekerjaan || "-",
     "Nama Pelanggan": item.namaPelanggan || "-",
     "Alamat": item.lokasiAlamat || "-",
     "Gardu Induk": item.garduInduk || "-",
     "Penyulang": item.penyulang || "-",
     "Pelaksana": item.pelaksana || "-",
   }));


   // Buat Worksheet & Workbook
   const worksheet = XLSX.utils.json_to_sheet(dataToExport);
   const workbook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pengoperasian");


   // Atur lebar kolom
   const wscols = [
     { wch: 5 },  // No
     { wch: 10 }, // ID
     { wch: 15 }, // Tanggal
     { wch: 15 }, // ULP
     { wch: 30 }, // Nama Pekerjaan
     { wch: 25 }, // Nama Pelanggan
     { wch: 30 }, // Alamat
     { wch: 15 }, // Gardu Induk
     { wch: 15 }, // Penyulang
     { wch: 20 }, // Pelaksana
   ];
   worksheet["!cols"] = wscols;


   // Download File
   XLSX.writeFile(workbook, "Data_Pengoperasian_Jaringan.xlsx");
 };


 // 🔹 Fungsi delete
 const handleHapus = async (id) => {
   const token = localStorage.getItem("token");
   Swal.fire({
     title: "Hapus data ini?",
     text: "Data tidak dapat dikembalikan!",
     icon: "warning",
     showCancelButton: true,
     confirmButtonColor: "#d33",
     confirmButtonText: "Ya, hapus",
     cancelButtonText: "Batal",
   }).then(async (result) => {
     if (result.isConfirmed) {
       try {
         await api.delete(`/test-jaringan/${id}`, {
           headers: { Authorization: `Bearer ${token}` },
         });
        
         Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
        
         // Update kedua state
         setLaporanData((prev) => prev.filter((item) => item.id !== id));
         setFilteredData((prev) => prev.filter((item) => item.id !== id));
        
       } catch (error) {
         console.error(error);
         Swal.fire("Gagal!", "Terjadi kesalahan.", "error");
       }
     }
   });
 };


 return (
   <div className="flex w-screen h-screen bg-gray-100 text-gray-800">
     {/* Sidebar Desktop */}
     <aside className="hidden md:flex md:w-64 bg-gray-200 flex-col justify-between shadow-md">
       <Sidebar active="pengoperasian" />
     </aside>


     {/* Sidebar Mobile */}
     {sidebarOpen && (
       <div className="fixed inset-0 z-40 flex">
         <div className="w-64 bg-gray-200 flex flex-col justify-between shadow-md">
           <Sidebar active="pengoperasian" close={() => setSidebarOpen(false)} />
         </div>
         <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)}></div>
       </div>
     )}


     {/* Main Content */}
     <main className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50">
       {/* Header */}
       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
         <div className="flex items-center justify-between w-full md:w-auto">
           <h2 className="text-xl md:text-2xl font-bold text-gray-700">
             Pengoperasian Jaringan
           </h2>
           <button
             onClick={() => setSidebarOpen(true)}
             style={{ backgroundColor: "transparent", border: "none" }}
             className="p-2 rounded hover:bg-gray-200 md:hidden"
           >
             <HiOutlineBars3 className="text-2xl text-gray-700" />
           </button>
         </div>


         {/* Filter, DatePicker, Buttons */}
         <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full md:w-auto overflow-x-auto pb-2 sm:pb-0">
           {/* Range DatePicker */}
           <div className="flex items-center bg-white border rounded-lg px-3 py-2 shadow-sm w-full sm:w-auto">
             <DatePicker
               selectsRange
               startDate={startDate}
               endDate={endDate}
               onChange={(update) => setDateRange(update)}
               isClearable
               dateFormat="dd/MM/yyyy"
               placeholderText="Pilih rentang tanggal"
               className="outline-none text-sm w-full sm:w-auto cursor-pointer text-center bg-transparent text-gray-700"
             />
             <HiOutlineCalendar className="text-gray-600 ml-2" />
           </div>
          
           {/* Tombol Filter - KUNING */}
           <button
             onClick={handleFilter}
             style={{ backgroundColor: "#fbbf24", color: "#000", border: "none" }}
             className="px-3 py-2 rounded-lg shadow flex items-center gap-1 justify-center w-full sm:w-auto hover:brightness-90 transition"
           >
             <HiOutlineBars3 className="text-xl" /> Filter
           </button>


           {/* Tombol Reset - ABU ABU */}
           <button
             onClick={handleResetFilter}
             style={{ backgroundColor: "#d1d5db", color: "#000", border: "none" }}
             className="px-3 py-2 rounded-lg shadow flex items-center gap-1 justify-center w-full sm:w-auto hover:brightness-90 transition"
           >
             Reset
           </button>


           {/* Tombol Export Excel - HIJAU */}
           <button
             onClick={handleExportExcel}
             style={{ backgroundColor: "#10b981", color: "#fff", border: "none" }}
             className="px-4 py-2 rounded-lg shadow flex items-center gap-1 justify-center w-full sm:w-auto whitespace-nowrap hover:brightness-90 transition"
           >
             <HiOutlineDocumentText className="text-lg" /> Excel
           </button>


           {/* Tombol Tambah - BIRU */}
           <button
             onClick={() => navigate("/form-pengoperasian")}
             style={{ backgroundColor: "#3b82f6", color: "#fff", border: "none" }}
             className="px-4 py-2 rounded-lg shadow flex items-center gap-1 justify-center w-full sm:w-auto whitespace-nowrap hover:brightness-90 transition"
           >
             <HiOutlinePlus className="text-lg" /> Tambah
           </button>
         </div>
       </div>


       {/* Table */}
       <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
         <table className="w-full min-w-[700px] border-collapse text-sm md:text-base">
           <thead className="bg-gray-100 text-gray-700 border-b border-gray-200">
             <tr>
               <th className="p-3 text-left font-semibold">No</th>
               <th className="p-3 text-left font-semibold">ULP</th>
               <th className="p-3 text-left font-semibold">Nama Pekerjaan</th>
               <th className="p-3 text-left font-semibold">Nama Pelanggan</th>
               <th className="p-3 text-left font-semibold">Tanggal</th>
               <th className="p-3 text-left font-semibold">Alamat</th>
               <th className="p-3 text-center font-semibold">Aksi</th>
             </tr>
           </thead>
           <tbody>
             {filteredData.length > 0 ? (
               // MENGGUNAKAN filteredData UNTUK MAPPING
               filteredData.map((laporan, index) => (
                 <Row
                   key={laporan.id}
                   no={index + 1}
                   ulp={laporan.ulp}
                   pekerjaan={laporan.namaPekerjaan}
                   pelanggan={laporan.namaPelanggan}
                   tanggal={
                     laporan.tanggalTest
                       ? new Date(laporan.tanggalTest).toLocaleDateString("id-ID")
                       : "-"
                   }
                   alamat={laporan.lokasiAlamat}
                   onEdit={() => navigate(`/edit-pengoperasian/${laporan.id}`)}
                   onCetak={() => navigate(`/cetak-pengoperasian/${laporan.id}`)}
                   onHapus={() => handleHapus(laporan.id)}
                 />
               ))
             ) : (
               <tr>
                 <td colSpan="7" className="text-center py-8 text-gray-500">
                   Tidak ada data hasil test jaringan
                 </td>
               </tr>
             )}
           </tbody>
         </table>
       </div>
     </main>
   </div>
 );
}

