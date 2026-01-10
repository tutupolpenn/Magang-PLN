// src/pages/Pelaporan.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineBars3,
  HiOutlineCalendar,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlinePrinter,
  HiOutlineTrash,
  HiOutlineDocumentText,
} from "react-icons/hi2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

export default function Pelaporan() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [laporanData, setLaporanData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const navigate = useNavigate();

  // === FETCH DATA LAPORAN ===
  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await axios.get("http://localhost:5000/api/laporan", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📥 Response dari server:", res.data);

        // ✅ FIX: Handle berbagai format response
        let data = [];
        
        if (res.data.success && res.data.data) {
          // Format: { success: true, data: [...] }
          data = res.data.data;
        } else if (res.data.laporan) {
          // Format: { laporan: [...] }
          data = res.data.laporan;
        } else if (Array.isArray(res.data)) {
          // Format: [...]
          data = res.data;
        } else {
          console.warn("⚠️ Format response tidak dikenali:", res.data);
          data = [];
        }

        // ✅ Pastikan data adalah array
        if (!Array.isArray(data)) {
          console.error("❌ Data bukan array:", data);
          data = [];
        }

        console.log("📊 Data setelah parsing:", data);

        // SORTING: Laporan terbaru di atas
        const sortedData = data.sort((a, b) => {
          // Prioritas 1: createdAt
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          // Prioritas 2: id
          if (a.id && b.id) {
            return b.id - a.id;
          }
          // Prioritas 3: tanggalKerusakan
          if (a.tanggalKerusakan && b.tanggalKerusakan) {
            return new Date(b.tanggalKerusakan) - new Date(a.tanggalKerusakan);
          }
          return 0;
        });

        setLaporanData(sortedData);
        setFilteredData(sortedData);
      } catch (err) {
        console.error("❌ ERROR FETCH:", err);
        
        if (err.response?.status === 401) {
          Swal.fire("Sesi Berakhir", "Silakan login kembali", "warning");
          navigate("/login");
        } else {
          Swal.fire("Error", "Gagal mengambil data laporan", "error");
        }
      }
    };
    fetchLaporan();
  }, [navigate]);

  // ================= FILTER =================
  const handleFilter = () => {
    if (!startDate || !endDate) {
      Swal.fire("Peringatan", "Pilih rentang tanggal terlebih dahulu!", "warning");
      return;
    }

    const mulai = new Date(startDate).setHours(0, 0, 0, 0);
    const selesai = new Date(endDate).setHours(23, 59, 59, 999);

    const hasil = laporanData.filter((item) => {
      if (!item.tanggalKerusakan) return false;
      const tgl = new Date(item.tanggalKerusakan).getTime();
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
    if (filteredData.length === 0) {
      Swal.fire("Gagal", "Tidak ada data untuk diexport", "warning");
      return;
    }

    const dataToExport = filteredData.map((item, index) => ({
      No: index + 1,
      "Tanggal Kerusakan": item.tanggalKerusakan
        ? new Date(item.tanggalKerusakan).toLocaleString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-",
      "Gardu Induk": item.kodegi || "-",
      Penyulang: item.kodepenyul || "-",
      "Nomor GTT": item.kodegardu || "-",
      Alamat: item.alamatgardu || "-",
      Merk: item.merk || "-",
      Daya: item.daya || "-",
      "No Seri": item.nomorSerie || "-",
      Fasa: item.fasa || "-",
      Status: item.status || "Rusak",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pelaporan");

    const wscols = [
      { wch: 5 },  // No
      { wch: 22 }, // Tanggal
      { wch: 15 }, // Gardu
      { wch: 15 }, // Penyulang
      { wch: 15 }, // GTT
      { wch: 30 }, // Alamat
      { wch: 15 }, // Merk
      { wch: 10 }, // Daya
      { wch: 20 }, // No Seri
      { wch: 5 },  // Fasa
      { wch: 10 }, // Status
    ];
    worksheet["!cols"] = wscols;

    XLSX.writeFile(workbook, "Data_Pelaporan_Trafo.xlsx");
  };

  // === HAPUS LAPORAN ===
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Hapus data ini?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`http://localhost:5000/api/laporan/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setLaporanData((prev) => prev.filter((item) => item.id !== id));
          setFilteredData((prev) => prev.filter((item) => item.id !== id));
          Swal.fire("Dihapus!", "Data berhasil dihapus.", "success");
        } catch (err) {
          console.error(err);
          Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
        }
      }
    });
  };

  const handlePrintPage = (laporan) => {
    navigate(`/cetak-laporan-kerusakan/${laporan.id}`);
  };

  return (
    <div className="flex w-screen h-screen bg-gray-100 text-gray-800">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex md:w-64 bg-gray-200 flex-col justify-between shadow-md">
        <Sidebar active="pelaporan" />
      </aside>

      {/* SIDEBAR MOBILE */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="w-64 bg-gray-200 flex flex-col justify-between shadow-md">
            <Sidebar active="pelaporan" close={() => setSidebarOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
        {/* HEADER */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-bold text-gray-700">
            Pelaporan Trafo
          </h2>
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <HiOutlineBars3 className="text-2xl text-gray-700" />
          </button>
        </div>

        {/* SCROLLABLE CONTENT WRAPPER */}
        <div className="flex-1 overflow-y-auto">
          {/* FILTER SECTION */}
          <div className="p-4 md:p-6">
            {/* Desktop Layout - All in one row */}
            <div className="hidden md:flex md:items-center md:gap-3">
              {/* Date Picker */}
              <div className="flex items-center bg-white border rounded-lg px-3 py-2.5 shadow-sm flex-1 max-w-xs">
                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  isClearable
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Pilih rentang tanggal"
                  className="text-sm outline-none bg-transparent w-full"
                />
                <HiOutlineCalendar className="text-gray-600 ml-2 flex-shrink-0" />
              </div>

              {/* Filter Button */}
              <button
                onClick={handleFilter}
                style={{ backgroundColor: "#fbbf24" }}
                className="py-2.5 px-4 rounded-lg shadow-sm text-sm font-medium text-black hover:brightness-90 transition flex items-center justify-center gap-2"
              >
                <HiOutlineBars3 className="text-lg" />
                <span>Filter</span>
              </button>

              {/* Reset Button */}
              <button
                onClick={handleResetFilter}
                style={{ backgroundColor: "#d1d5db" }}
                className="py-2.5 px-4 rounded-lg shadow-sm text-sm font-medium text-black hover:brightness-90 transition"
              >
                Reset
              </button>

              {/* Excel Button */}
              <button
                onClick={handleExportExcel}
                style={{ backgroundColor: "#10b981" }}
                className="py-2.5 px-4 rounded-lg shadow-sm text-sm font-medium text-white hover:brightness-90 transition flex items-center justify-center gap-2"
              >
                <HiOutlineDocumentText className="text-lg" />
                <span>Excel</span>
              </button>

              {/* Tambah Button */}
              <button
                onClick={() => navigate("/form-pelaporan")}
                style={{ backgroundColor: "#3b82f6" }}
                className="py-2.5 px-4 rounded-lg shadow-sm text-sm font-medium text-white hover:brightness-90 transition flex items-center justify-center gap-2"
              >
                <HiOutlinePlus className="text-lg" />
                <span>Tambah</span>
              </button>
            </div>

            {/* Mobile Layout - Stacked */}
            <div className="flex flex-col md:hidden space-y-3">
              {/* Date Picker */}
              <div className="flex items-center bg-white border rounded-lg px-3 py-2.5 shadow-sm">
                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  isClearable
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Pilih rentang tanggal"
                  className="text-sm outline-none bg-transparent w-full"
                />
                <HiOutlineCalendar className="text-gray-600 ml-2 flex-shrink-0" />
              </div>

              {/* Buttons */}
              <button
                onClick={handleFilter}
                style={{ backgroundColor: "#fbbf24" }}
                className="w-full py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-black hover:brightness-90 transition flex items-center justify-center gap-2"
              >
                <HiOutlineBars3 className="text-xl" />
                <span>Filter</span>
              </button>

              <button
                onClick={handleResetFilter}
                style={{ backgroundColor: "#d1d5db" }}
                className="w-full py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-black hover:brightness-90 transition"
              >
                Reset
              </button>

              <button
                onClick={handleExportExcel}
                style={{ backgroundColor: "#10b981" }}
                className="w-full py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white hover:brightness-90 transition flex items-center justify-center gap-2"
              >
                <HiOutlineDocumentText className="text-xl" />
                <span>Excel</span>
              </button>

              <button
                onClick={() => navigate("/form-pelaporan")}
                style={{ backgroundColor: "#3b82f6" }}
                className="w-full py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white hover:brightness-90 transition flex items-center justify-center gap-2"
              >
                <HiOutlinePlus className="text-xl" />
                <span>Tambah</span>
              </button>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="px-4 pb-4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-gray-700 font-semibold">
                      <th className="p-3 text-left border-b">No</th>
                      <th className="p-3 text-left border-b">Tanggal</th>
                      <th className="p-3 text-left border-b">Gardu Induk</th>
                      <th className="p-3 text-left border-b">Penyulang</th>
                      <th className="p-3 text-left border-b">Alamat</th>
                      <th className="p-3 text-center border-b">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((laporan, index) => (
                        <tr
                          key={laporan.id}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="p-3 text-gray-700">{index + 1}</td>
                          <td className="p-3 text-gray-700 whitespace-nowrap">
                            {laporan.tanggalKerusakan
                              ? new Date(laporan.tanggalKerusakan).toLocaleString(
                                  "id-ID",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )
                              : "-"}
                          </td>
                          <td className="p-3 text-gray-700">{laporan.kodegi || "-"}</td>
                          <td className="p-3 text-gray-700">{laporan.kodepenyul || "-"}</td>
                          <td className="p-3 text-gray-700">{laporan.alamatgardu || "-"}</td>
                          <td className="p-3">
                            <div className="flex justify-center gap-2">
                              {/* Edit Button */}
                              <button
                                onClick={() => navigate(`/edit-pelaporan/${laporan.id}`)}
                                className="p-2 rounded-lg bg-gray-100 border border-gray-300 hover:bg-blue-50 transition"
                                title="Edit"
                              >
                                <HiOutlinePencil className="text-blue-600 text-lg" />
                              </button>
                              
                              {/* Print Button */}
                              <button
                                onClick={() => handlePrintPage(laporan)}
                                className="p-2 rounded-lg bg-gray-100 border border-gray-300 hover:bg-gray-200 transition"
                                title="Print"
                              >
                                <HiOutlinePrinter className="text-gray-600 text-lg" />
                              </button>
                              
                              {/* Delete Button */}
                              <button
                                onClick={() => handleDelete(laporan.id)}
                                className="p-2 rounded-lg bg-gray-100 border border-gray-300 hover:bg-red-50 transition"
                                title="Hapus"
                              >
                                <HiOutlineTrash className="text-red-600 text-lg" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center p-8 text-gray-500">
                          Data tidak tersedia
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}