import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineBars3,
  HiOutlineCalendar,
  HiOutlinePlus,
  HiOutlinePrinter,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Swal from "sweetalert2";
import SidebarAdmin from "../components/SidebarAdmin";

export default function PengoperasianJaringanAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [laporanData, setLaporanData] = useState([]);
  const navigate = useNavigate();

  // 🔹 Ambil data dari backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/test-jaringan", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((res) => setLaporanData(res.data))
      .catch((err) => console.error("Gagal mengambil data:", err));
  }, []);

  // 🔹 Fungsi cetak (→ arahkan ke halaman cetak sesuai ID)
  const handleCetak = (id) => {
    navigate(`/cetak-test-jaringan-admin/${id}`);
  };

  // 🔹 Fungsi edit
  const handleEdit = (id) => {
    navigate(`/edit-pengoperasian-admin/${id}`);
  };

  // 🔹 Fungsi hapus data
  const handleHapus = async (id) => {
    const token = localStorage.getItem("token");
    Swal.fire({
      title: "Yakin ingin menghapus data ini?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/api/test-jaringan/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
          setLaporanData((prev) => prev.filter((item) => item.id !== id));
        } catch (error) {
          console.error("Gagal menghapus data:", error);
          Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
        }
      }
    });
  };

  return (
    <div className="flex w-screen h-screen bg-gray-100 text-gray-800">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:w-64 bg-gray-200 flex-col justify-between shadow-md">
        <SidebarAdmin active="pengoperasian" />
      </aside>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-gray-200 flex flex-col justify-between shadow-md">
            <SidebarAdmin active="pengoperasian" close={() => setSidebarOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold">
              Pengoperasian Jaringan Admin
            </h2>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded hover:bg-gray-200 md:hidden"
            >
              <HiOutlineBars3 className="text-2xl" />
            </button>
          </div>

          {/* Filter + Button */}
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
              onClick={() => navigate("/form-pengoperasian-admin")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow flex items-center gap-1 justify-center w-full sm:w-auto whitespace-nowrap"
            >
              <HiOutlinePlus className="text-lg" /> Tambah Data Hasil Test
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
          <table className="w-full min-w-[700px] border border-gray-200 rounded-lg text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left font-semibold">
                <th className="p-3 border-b">No</th>
                <th className="p-3 border-b">ULP</th>
                <th className="p-3 border-b">Nama Pekerjaan</th>
                <th className="p-3 border-b">Nama Pelanggan</th>
                <th className="p-3 border-b">Tanggal</th>
                <th className="p-3 border-b">Alamat</th>
                <th className="p-3 border-b text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {laporanData.length > 0 ? (
                laporanData.map((laporan, index) => (
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
                    onEdit={() => handleEdit(laporan.id)}
                    onCetak={() => handleCetak(laporan.id)}
                    onHapus={() => handleHapus(laporan.id)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
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

/* 🔹 Komponen Baris Tabel */
function Row({ no, ulp, pekerjaan, pelanggan, tanggal, alamat, onEdit, onCetak, onHapus }) {
  return (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="p-3">{no}</td>
      <td className="p-3">{ulp}</td>
      <td className="p-3">{pekerjaan}</td>
      <td className="p-3">{pelanggan}</td>
      <td className="p-3">{tanggal}</td>
      <td className="p-3">{alamat}</td>
      <td className="p-3 flex justify-center gap-3">
        <button
          onClick={onEdit}
          className="p-2 bg-gray-50 hover:bg-blue-100 rounded-xl"
          title="Edit"
        >
          <HiOutlinePencil className="text-blue-500 w-5 h-5" />
        </button>
        <button
          onClick={onCetak}
          className="p-2 bg-gray-50 hover:bg-gray-200 rounded-xl"
          title="Cetak"
        >
          <HiOutlinePrinter className="text-gray-600 w-5 h-5" />
        </button>
        <button
          onClick={onHapus}
          className="p-2 bg-gray-50 hover:bg-red-100 rounded-xl"
          title="Hapus"
        >
          <HiOutlineTrash className="text-red-500 w-5 h-5" />
        </button>
      </td>
    </tr>
  );
}
