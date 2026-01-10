import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineBars3,
  HiOutlineCalendar,
  HiOutlinePencil,
  HiOutlinePrinter,
  HiOutlineTrash,
  HiOutlineDocumentMagnifyingGlass,
  HiMagnifyingGlass,
  HiXMark,
  HiOutlineDocumentText,
  HiOutlineFunnel
} from "react-icons/hi2";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import * as XLSX from "xlsx";

import Sidebar from "../components/Sidebar";

export default function Investigasi() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [laporanData, setLaporanData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  // ================= FETCH DATA DENGAN ERROR HANDLING LEBIH BAIK =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire({
            icon: "warning",
            title: "Akses Ditolak",
            text: "Silakan login terlebih dahulu.",
          });
          return navigate("/login");
        }

        setLoading(true);

        // Ambil data laporan dengan error handling
        let laporanArray = [];
        try {
          const laporanRes = await axios.get("http://localhost:5000/api/laporan", {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          laporanArray = Array.isArray(laporanRes.data)
            ? laporanRes.data
            : laporanRes.data.data || laporanRes.data.laporan || [];
          
          console.log("✅ Data Laporan berhasil diambil:", laporanArray.length, "items");
        } catch (err) {
          console.error("❌ Error mengambil laporan:", err.response?.data || err.message);
          throw new Error(`Gagal mengambil data laporan: ${err.response?.data?.message || err.message}`);
        }

        // Ambil data investigasi dengan error handling
        let investigasiArray = [];
        try {
          const investigasiRes = await axios.get("http://localhost:5000/api/investigasi", {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          investigasiArray = Array.isArray(investigasiRes.data)
            ? investigasiRes.data
            : investigasiRes.data.data || [];
          
          console.log("✅ Data Investigasi berhasil diambil:", investigasiArray.length, "items");
        } catch (err) {
          console.error("❌ Error mengambil investigasi:", err.response?.data || err.message);
          // Investigasi boleh kosong, jadi tidak throw error
          investigasiArray = [];
        }

        // Gabungkan laporan dengan investigasi
        const mergedData = laporanArray.map((laporan) => {
          const investigasi = investigasiArray.find(
            (inv) => inv.laporan_id === laporan.id
          );

          return {
            ...laporan,
            investigasi_id: investigasi?.id || null,
            hasInvestigasi: !!investigasi,
            status_investigasi: investigasi ? "Sudah Investigasi" : "Belum Investigasi",
            detail_investigasi: investigasi || {},
            // Helper field untuk searching/filtering
            tglDisplay: investigasi?.tanggalKerusakan || laporan.tanggalKerusakan || null,
            noSeriDisplay: investigasi?.nomorSerie || laporan.nomorSerie || "-",
            merkDisplay: investigasi?.merk || laporan.merk || "-",
            dayaDisplay: investigasi?.daya || laporan.daya || "-",
            fasaDisplay: investigasi?.fasa || laporan.fasa || "-",
          };
        });

        // Sort data terbaru di atas
        const sortedData = mergedData.sort((a, b) => b.id - a.id);

        console.log("✅ Data berhasil digabungkan:", sortedData.length, "items");
        
        setLaporanData(sortedData);
        setFilteredData(sortedData);
        
      } catch (error) {
        console.error("❌ ERROR FETCH:", error);
        
        Swal.fire({
          icon: "error",
          title: "Gagal Mengambil Data",
          html: `
            <p>${error.message || "Terjadi kesalahan saat mengambil data"}</p>
            <p class="text-sm text-gray-600 mt-2">Silakan periksa:</p>
            <ul class="text-sm text-left text-gray-600 mt-2">
              <li>• Koneksi server backend</li>
              <li>• Token autentikasi masih valid</li>
              <li>• Endpoint API tersedia</li>
            </ul>
          `,
          confirmButtonText: "OK"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // ================= LOGIKA FILTER UTAMA =================
  const handleFilter = () => {
    let result = [...laporanData];

    // 1. Filter Tanggal
    if (startDate && endDate) {
      const mulai = new Date(startDate).setHours(0, 0, 0, 0);
      const selesai = new Date(endDate).setHours(23, 59, 59, 999);
      
      result = result.filter((item) => {
        if (!item.tglDisplay) return false;
        const itemTime = new Date(item.tglDisplay).getTime();
        return itemTime >= mulai && itemTime <= selesai;
      });
    }

    // 2. Filter Status
    if (filterStatus !== "Semua") {
      const isSudah = filterStatus === "Sudah Investigasi";
      result = result.filter((item) => item.hasInvestigasi === isSudah);
    }

    // 3. Filter Search Text
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase().trim();
      result = result.filter((item) =>
        String(item.id).toLowerCase().includes(lowerQuery) ||
        String(item.noSeriDisplay).toLowerCase().includes(lowerQuery) ||
        String(item.merkDisplay).toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredData(result);

    if (result.length === 0) {
      Swal.fire("Info", "Tidak ditemukan data dengan kriteria filter tersebut.", "info");
    }
  };

  // ================= RESET FILTER =================
  const handleReset = () => {
    setSearchQuery("");
    setDateRange([null, null]);
    setFilterStatus("Semua");
    setFilteredData(laporanData);
  };

  // ================= EXPORT EXCEL =================
  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      Swal.fire("Gagal", "Tidak ada data untuk diexport", "warning");
      return;
    }

    const dataToExport = filteredData.map((item, index) => ({
      No: index + 1,
      "ID Laporan": item.id,
      "Tanggal Kerusakan": item.tglDisplay
        ? new Date(item.tglDisplay).toLocaleString("id-ID", {
            day: "2-digit", month: "2-digit", year: "numeric"
          })
        : "-",
      "No Seri": item.noSeriDisplay,
      "Daya": item.dayaDisplay,
      "Merk": item.merkDisplay,
      "Fasa": item.fasaDisplay,
      "Status Investigasi": item.status_investigasi,
      "Penyebab Kerusakan": item.detail_investigasi?.penyebabKerusakan || "-",
      "Rekomendasi": item.detail_investigasi?.rekomendasi || "-"
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Investigasi");

    const wscols = [
      { wch: 5 }, { wch: 12 }, { wch: 20 }, { wch: 20 }, { wch: 10 },
      { wch: 15 }, { wch: 10 }, { wch: 20 }, { wch: 30 }, { wch: 30 }
    ];
    worksheet["!cols"] = wscols;

    XLSX.writeFile(workbook, "Laporan_Investigasi_Trafo.xlsx");
  };

  // ================= INVESTIGASI =================
  const handleInvestigasi = (laporanId, hasInvestigasi) => {
    if (hasInvestigasi) {
      Swal.fire({
        icon: "info",
        title: "Sudah Ada Investigasi",
        text: "Laporan ini sudah memiliki data investigasi. Gunakan tombol Edit untuk mengubah data.",
      });
      return;
    }
    navigate(`/investigasi/input/${laporanId}`);
  };

  // ================= CETAK =================
  const handleCetak = (investigasiId) => {
    if (!investigasiId) return;
    navigate(`/cetak-investigasi/${investigasiId}`);
  };

  // ================= EDIT =================
  const handleEdit = (investigasiId) => {
    if (!investigasiId) return;
    navigate(`/edit-investigasi/${investigasiId}`);
  };

  // ================= HAPUS =================
  const handleHapus = async (investigasiId) => {
    if (!investigasiId) return;

    const result = await Swal.fire({
      title: "Hapus Data Investigasi?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/investigasi/${investigasiId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const updatedData = laporanData.map((item) =>
          item.investigasi_id === investigasiId
            ? {
                ...item,
                investigasi_id: null,
                hasInvestigasi: false,
                status_investigasi: "Belum Investigasi",
                detail_investigasi: {}
              }
            : item
        );

        setLaporanData(updatedData);
        setFilteredData(updatedData);

        Swal.fire({
          title: "Berhasil",
          text: "Data investigasi berhasil dihapus.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Gagal menghapus:", error);
        Swal.fire({
          title: "Gagal",
          text: error.response?.data?.message || "Gagal menghapus data investigasi.",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="flex w-screen h-screen bg-gray-100 text-gray-800">
      <aside className="hidden md:flex md:w-64 bg-white flex-col justify-between shadow-lg">
        <Sidebar active="investigasi" />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-white flex-col justify-between shadow-lg">
            <Sidebar active="investigasi" close={() => setSidebarOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}

      <main className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Investigasi Gangguan Trafo
          </h2>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded hover:bg-gray-200 md:hidden"
          >
            <HiOutlineBars3 className="text-2xl" />
          </button>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 mb-6">
          <div className="relative w-full xl:w-auto">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <HiMagnifyingGlass />
            </span>
            <input
              type="text"
              placeholder="Cari ID / No Seri / Merk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full xl:w-64 pl-9 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            />
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2 w-full xl:w-auto">
            <div className="flex items-center bg-white border rounded-lg px-3 py-2 shadow-sm w-full sm:w-auto">
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                isClearable
                dateFormat="dd/MM/yyyy"
                placeholderText="Pilih Rentang Tanggal"
                className="outline-none text-sm w-full sm:w-40 cursor-pointer text-center bg-transparent"
              />
              <HiOutlineCalendar className="text-gray-600 ml-2" />
            </div>

            <div className="flex items-center bg-white border rounded-lg px-3 py-2 shadow-sm w-full sm:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="outline-none text-sm bg-transparent text-gray-700 cursor-pointer w-full sm:w-auto min-w-[140px]"
              >
                <option value="Semua">Semua Status</option>
                <option value="Belum Investigasi">Belum Investigasi</option>
                <option value="Sudah Investigasi">Sudah Investigasi</option>
              </select>
            </div>

            <button
              onClick={handleFilter}
              className="px-4 py-2 bg-yellow-400 text-black font-medium rounded-lg shadow hover:bg-yellow-500 transition flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <HiOutlineFunnel className="text-lg" /> Filter
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg shadow hover:bg-gray-300 transition flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <HiXMark className="text-lg" /> Reset
            </button>

            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg shadow hover:bg-green-600 transition flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <HiOutlineDocumentText className="text-lg" /> Excel
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 uppercase font-bold tracking-wider">
                <th className="p-3">ID</th>
                <th className="p-3">Tanggal Kerusakan</th>
                <th className="p-3">No Seri</th>
                <th className="p-3">Daya</th>
                <th className="p-3">Merk</th>
                <th className="p-3">Fasa</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center p-8 text-gray-500 animate-pulse">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50 transition duration-150">
                    <td className="p-3 font-medium text-gray-700">{item.id}</td>
                    <td className="p-3">
                      {item.tglDisplay
                        ? new Date(item.tglDisplay).toLocaleString("id-ID", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>
                    <td className="p-3">{item.noSeriDisplay}</td>
                    <td className="p-3">{item.dayaDisplay}</td>
                    <td className="p-3">{item.merkDisplay}</td>
                    <td className="p-3">{item.fasaDisplay}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                          item.hasInvestigasi ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {item.status_investigasi}
                      </span>
                    </td>

                    <td className="p-3 flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleInvestigasi(item.id, item.hasInvestigasi)}
                        className={`p-2 rounded-lg transition shadow-sm ${
                          item.hasInvestigasi
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border border-yellow-200"
                        }`}
                        title={item.hasInvestigasi ? "Sudah ada investigasi" : "Input Investigasi"}
                        disabled={item.hasInvestigasi}
                      >
                        <HiOutlineDocumentMagnifyingGlass className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleEdit(item.investigasi_id)}
                        className={`p-2 rounded-lg transition shadow-sm ${
                          item.hasInvestigasi
                            ? "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                        title="Edit Investigasi"
                        disabled={!item.hasInvestigasi}
                      >
                        <HiOutlinePencil className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleCetak(item.investigasi_id)}
                        className={`p-2 rounded-lg transition shadow-sm ${
                          item.hasInvestigasi
                            ? "bg-gray-50 text-gray-700 hover:bg-gray-200 border border-gray-300"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                        title="Cetak Laporan"
                        disabled={!item.hasInvestigasi}
                      >
                        <HiOutlinePrinter className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleHapus(item.investigasi_id)}
                        className={`p-2 rounded-lg transition shadow-sm ${
                          item.hasInvestigasi
                            ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                        title="Hapus Data"
                        disabled={!item.hasInvestigasi}
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-8 text-gray-500">
                    Tidak ditemukan data yang sesuai.
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