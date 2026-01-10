// Perbaikan.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineBars3,
  HiOutlineCalendar,
  HiOutlineWrench,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineDocumentText,
} from "react-icons/hi2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

export default function Perbaikan() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [laporanData, setLaporanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Validasi token
      if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Akses Ditolak",
          text: "Silakan login terlebih dahulu.",
        });
        return navigate("/login");
      }

      console.log("🔑 Token:", token);

      // Fetch data laporan
      let laporanArray = [];
      try {
        const laporanRes = await axios.get(
          "http://localhost:5000/api/laporan",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("✅ Laporan Response:", laporanRes.data);

        laporanArray = Array.isArray(laporanRes.data)
          ? laporanRes.data
          : laporanRes.data.data || laporanRes.data.laporan || [];
      } catch (err) {
        console.error("❌ Error Laporan:", err.response?.data || err.message);
        throw new Error("Gagal mengambil data laporan");
      }

      // Fetch data perbaikan
      let perbaikanArray = [];
      try {
        const perbaikanRes = await axios.get(
          "http://localhost:5000/api/perbaikan",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("✅ Perbaikan Response:", perbaikanRes.data);

        perbaikanArray = Array.isArray(perbaikanRes.data)
          ? perbaikanRes.data
          : perbaikanRes.data.data || [];
      } catch (err) {
        console.error("❌ Error Perbaikan:", err.response?.data || err.message);
        // Jika perbaikan gagal, tetap lanjut dengan data kosong
        perbaikanArray = [];
      }

      // Gabungkan data laporan dengan perbaikan
      const mergedData = laporanArray.map((laporan) => {
        const perbaikan = perbaikanArray.find(
          (p) => p.laporan_id === laporan.id
        );

        return {
          ...laporan,
          status: perbaikan ? perbaikan.jenis_perbaikan : "Rusak",
          perbaikan_id: perbaikan ? perbaikan.id : null,
          detail_perbaikan: perbaikan || {},
        };
      });

      // Sort data terbaru di atas
      const sortedData = mergedData.sort((a, b) => b.id - a.id);

      setLaporanData(sortedData);
      console.log("📊 Merged Data:", sortedData);
    } catch (err) {
      console.error("❌ ERROR FETCH:", err);
      console.error("Error Response:", err.response);
      console.error("Error Status:", err.response?.status);
      console.error("Error Data:", err.response?.data);

      Swal.fire({
        icon: "error",
        title: "Gagal Mengambil Data",
        text: err.response?.data?.message || err.message || "Periksa token atau koneksi server.",
      });

      // Jika token invalid, redirect ke login
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Export Excel Function
  const handleExportExcel = () => {
    if (laporanData.length === 0) {
      Swal.fire("Gagal", "Tidak ada data untuk diexport", "warning");
      return;
    }

    // Format data untuk Excel
    const dataToExport = laporanData.map((item, index) => {
      // Label status yang lebih readable
      let statusLabel = item.status;
      if (item.status === "gantiTrafo") statusLabel = "Ganti Trafo";
      else if (item.status === "gantiTrafoMobile") statusLabel = "Trafo Mobile";
      else if (item.status === "kopelTrafoSebelah") statusLabel = "Kopel Trafo";

      // Ambil tanggal perbaikan
      const tanggalPerbaikan =
        item.detail_perbaikan?.tanggal_perbaikan ||
        item.detail_perbaikan?.createdAt;

      return {
        No: index + 1,
        "ID Laporan": item.id,
        "Tanggal Perbaikan": tanggalPerbaikan
          ? new Date(tanggalPerbaikan).toLocaleString("id-ID", {
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
        "Status Perbaikan": statusLabel,
        "Merk Trafo (Baru)": item.detail_perbaikan?.merk || "-",
        "No Seri (Baru)": item.detail_perbaikan?.noSeri || "-",
        "Kapasitas (Baru)": item.detail_perbaikan?.kapasitas || "-",
      };
    });

    // Buat worksheet & workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Perbaikan");

    // Atur lebar kolom
    const wscols = [
      { wch: 5 }, // No
      { wch: 10 }, // ID
      { wch: 22 }, // Tanggal Perbaikan
      { wch: 15 }, // Gardu
      { wch: 15 }, // Penyulang
      { wch: 15 }, // GTT
      { wch: 30 }, // Alamat
      { wch: 20 }, // Status
      { wch: 15 }, // Merk
      { wch: 20 }, // No Seri
      { wch: 10 }, // Kapasitas
    ];
    worksheet["!cols"] = wscols;

    // Simpan file
    const fileName = `Data_Perbaikan_Trafo_${new Date().toLocaleDateString("id-ID")}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Data berhasil diexport ke Excel",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handlePerbaikan = (id) => {
    navigate(`/pilihan-perbaikan/${id}`);
  };

  const handleEdit = (perbaikanId) => {
    if (!perbaikanId) {
      return Swal.fire({
        icon: "warning",
        title: "Belum Ada Perbaikan",
        text: "Laporan ini belum memiliki data perbaikan.",
      });
    }

    navigate(`/edit-perbaikan/${perbaikanId}`);
  };

  const handleHapus = async (perbaikanId) => {
    if (!perbaikanId) {
      return Swal.fire({
        icon: "warning",
        title: "Tidak Ada Data",
        text: "Tidak ada data perbaikan untuk dihapus.",
      });
    }

    const confirm = await Swal.fire({
      title: "Yakin Menghapus?",
      text: `Data perbaikan ID ${perbaikanId} akan dihapus permanen.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("token");

        await axios.delete(
          `http://localhost:5000/api/perbaikan/${perbaikanId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Update state lokal
        setLaporanData(
          laporanData.map((item) =>
            item.perbaikan_id === perbaikanId
              ? { ...item, status: "Rusak", perbaikan_id: null, detail_perbaikan: {} }
              : item
          )
        );

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data perbaikan telah dihapus.",
          timer: 1600,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Error Delete:", err);

        Swal.fire({
          icon: "error",
          title: "Gagal Menghapus",
          text: err.response?.data?.message || "Terjadi kesalahan, coba lagi.",
        });
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "gantiTrafo":
        return "bg-green-500";
      case "gantiTrafoMobile":
        return "bg-blue-500";
      case "kopelTrafoSebelah":
        return "bg-purple-500";
      default:
        return "bg-red-500";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "gantiTrafo":
        return "Ganti Trafo";
      case "gantiTrafoMobile":
        return "Trafo Mobile";
      case "kopelTrafoSebelah":
        return "Kopel Trafo";
      default:
        return "Rusak";
    }
  };

  return (
    <div className="flex w-screen h-screen bg-gray-100 text-gray-800">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:w-64 bg-gray-200 flex-col justify-between shadow-md">
        <Sidebar active="perbaikan" />
      </aside>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-gray-200 flex flex-col justify-between shadow-md">
            <Sidebar active="perbaikan" close={() => setSidebarOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-700">
            Perbaikan Trafo
          </h2>

          {/* Menu Button Mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded hover:bg-gray-200 absolute right-4 top-4"
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <HiOutlineBars3 className="text-2xl text-gray-700" />
          </button>

          {/* Filter & Export */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full md:w-auto">
            <div className="relative flex items-center border rounded-lg bg-white px-3 py-2 gap-2 shadow-sm w-full sm:w-auto">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                className="outline-none text-sm w-full sm:w-28 cursor-pointer text-center bg-transparent text-gray-700"
              />
              <HiOutlineCalendar className="text-gray-600 text-xl" />
            </div>

            <button
              onClick={handleExportExcel}
              className="hover:brightness-90 px-4 py-2 rounded-lg shadow flex items-center gap-1 justify-center whitespace-nowrap transition"
              style={{ backgroundColor: "#10b981", color: "#fff", border: "none" }}
              disabled={loading || laporanData.length === 0}
            >
              <HiOutlineDocumentText className="text-lg" /> Excel
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
          </div>
        ) : (
          /* Table */
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-sm md:text-base">
              <thead>
                <tr className="bg-gray-100 text-gray-700 font-semibold">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Tanggal Perbaikan</th>
                  <th className="p-3 text-left">Gardu Induk</th>
                  <th className="p-3 text-left">Penyulang</th>
                  <th className="p-3 text-left">Alamat</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {laporanData.length > 0 ? (
                  laporanData.map((laporan) => {
                    const tanggalPerbaikan =
                      laporan.detail_perbaikan?.tanggal_perbaikan ||
                      laporan.detail_perbaikan?.createdAt;

                    return (
                      <tr
                        key={laporan.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="p-3 text-gray-700">{laporan.id}</td>

                        <td className="p-3 text-gray-700">
                          {tanggalPerbaikan
                            ? new Date(tanggalPerbaikan).toLocaleString("id-ID", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </td>

                        <td className="p-3 text-gray-700">
                          {laporan.kodegi || "-"}
                        </td>
                        <td className="p-3 text-gray-700">
                          {laporan.kodepenyul || "-"}
                        </td>
                        <td className="p-3 text-gray-700">
                          {laporan.alamatgardu || "-"}
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-white text-xs md:text-sm ${getStatusStyle(
                              laporan.status
                            )}`}
                          >
                            {getStatusLabel(laporan.status)}
                          </span>
                        </td>

                        <td className="p-3 flex justify-center gap-2">
                          <button
                            onClick={() => handlePerbaikan(laporan.id)}
                            className="p-2 rounded-lg hover:bg-yellow-50 transition"
                            style={{
                              backgroundColor: "#f3f4f6",
                              border: "1px solid #e5e7eb",
                            }}
                            title="Input Perbaikan"
                          >
                            <HiOutlineWrench className="text-yellow-600 text-xl" />
                          </button>

                          <button
                            onClick={() => handleEdit(laporan.perbaikan_id)}
                            className="p-2 rounded-lg hover:bg-blue-50 transition"
                            style={{
                              backgroundColor: "#f3f4f6",
                              border: "1px solid #e5e7eb",
                            }}
                            title="Edit Perbaikan"
                          >
                            <HiOutlinePencil className="text-blue-600 text-xl" />
                          </button>

                          <button
                            onClick={() => handleHapus(laporan.perbaikan_id)}
                            className="p-2 rounded-lg hover:bg-red-50 transition"
                            style={{
                              backgroundColor: "#f3f4f6",
                              border: "1px solid #e5e7eb",
                            }}
                            title="Hapus Data"
                            disabled={!laporan.perbaikan_id}
                          >
                            <HiOutlineTrash className="text-red-600 text-xl" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-4 text-gray-500">
                      Tidak ada data tersedia
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}