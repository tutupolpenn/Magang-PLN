// Perbaikan.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineBars3,
  HiOutlineCalendar,
  HiOutlineWrench,
  HiOutlineTrash,
} from "react-icons/hi2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SidebarAdmin from "../components/SidebarAdmin";
import axios from "axios";
import Swal from "sweetalert2";

export default function PerbaikanAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [laporanData, setLaporanData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        // 🔹 Ambil data laporan
        const laporanRes = await axios.get("http://localhost:5000/api/laporan", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const laporanArray = Array.isArray(laporanRes.data)
          ? laporanRes.data
          : laporanRes.data.data || laporanRes.data.laporan || [];

        // 🔹 Ambil data perbaikan
        const perbaikanRes = await axios.get("http://localhost:5000/api/perbaikan", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const perbaikanArray = Array.isArray(perbaikanRes.data)
          ? perbaikanRes.data
          : perbaikanRes.data.data || [];

        // 🔹 Gabungkan laporan dengan perbaikan berdasarkan laporan_id
        const mergedData = laporanArray.map((laporan) => {
          const perbaikan = perbaikanArray.find(
            (p) => p.laporan_id === laporan.id
          );

          return {
            ...laporan,
            status: perbaikan
              ? perbaikan.jenis_perbaikan // jika sudah diperbaiki → pakai jenis perbaikan
              : "Rusak", // jika belum diperbaiki → default Rusak
          };
        });

        setLaporanData(mergedData);
      } catch (err) {
        console.error("ERROR FETCH:", err);
        Swal.fire(
          "Gagal mengambil data",
          "Periksa token dan koneksi server.",
          "error"
        );
      }
    };

    fetchData();
  }, [navigate]);

  const handlePerbaikan = (id) => {
    navigate(`/pilihan-perbaikan/${id}`);
  };

  const handleHapus = async (id) => {
    const konfirmasi = await Swal.fire({
      title: "Hapus Data?",
      text: `Apakah kamu yakin ingin menghapus laporan ID ${id}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (konfirmasi.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/laporan/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLaporanData(laporanData.filter((item) => item.id !== id));
        Swal.fire("Berhasil", "Data berhasil dihapus", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Gagal", "Tidak dapat menghapus data", "error");
      }
    }
  };

  // 🔹 Gaya warna status
  const getStatusStyle = (status) => {
    switch (status) {
      case "gantiTrafo":
        return "bg-green-500";
      case "GantiTrafoMobile":
        return "bg-blue-500";
      case "kopelTrafoSebelah":
        return "bg-purple-500";
      default:
        return "bg-red-500";
    }
  };

  return (
    <div className="flex w-screen h-screen bg-gray-100 text-gray-800">
      <aside className="hidden md:flex md:w-64 bg-gray-200 flex-col justify-between shadow-md">
        <SidebarAdmin active="perbaikan" />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-gray-200 flex flex-col justify-between shadow-md">
            <SidebarAdmin active="perbaikan" close={() => setSidebarOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}

      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-700">
            Perbaikan Trafo
          </h2>
          <div className="relative flex items-center border rounded-lg bg-white px-3 py-2 gap-2 shadow-sm w-full sm:w-auto">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              className="outline-none text-sm w-full sm:w-28 cursor-pointer text-center"
            />
            <HiOutlineCalendar className="text-gray-600 text-xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100 text-gray-700 font-semibold">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Tanggal</th>
                <th className="p-3 text-left">Gardu Induk</th>
                <th className="p-3 text-left">Penyulang</th>
                <th className="p-3 text-left">Alamat</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {laporanData.length > 0 ? (
                laporanData.map((laporan) => (
                  <tr
                    key={laporan.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{laporan.id}</td>
                    <td className="p-3">
                      {laporan.tanggalKerusakan
                        ? new Date(
                            laporan.tanggalKerusakan
                          ).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td className="p-3">{laporan.kodegi || "-"}</td>
                    <td className="p-3">{laporan.kodepenyul || "-"}</td>
                    <td className="p-3">{laporan.alamatgardu || "-"}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs md:text-sm ${getStatusStyle(
                          laporan.status
                        )}`}
                      >
                        {laporan.status}
                      </span>
                    </td>
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => handlePerbaikan(laporan.id)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-yellow-50 border border-gray-200"
                      >
                        <HiOutlineWrench className="text-yellow-600 text-xl" />
                      </button>
                      <button
                        onClick={() => handleHapus(laporan.id)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-red-50 border border-gray-200"
                      >
                        <HiOutlineTrash className="text-red-600 text-xl" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-500">
                    Data tidak tersedia
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
