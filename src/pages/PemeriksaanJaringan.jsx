import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineBars3,
  HiOutlineCalendar,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlinePrinter,
  HiOutlineTrash
} from "react-icons/hi2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// Komponen untuk satu baris data di tabel
function Row({ data, onCetak, onEdit, onDelete }) {
  const { id, no_ba, tanggal, nama_pekerjaan, nama_pelanggan, alamat_lokasi, rayon } = data;

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3">{id}</td>
      <td className="p-3">{no_ba || "-"}</td>
      <td className="p-3">{tanggal ? new Date(tanggal).toLocaleDateString() : "-"}</td>
      <td className="p-3">{nama_pekerjaan}</td>
      <td className="p-3">{nama_pelanggan}</td>
      <td className="p-3">{alamat_lokasi}</td>
      <td className="p-3">{rayon}</td>

      <td className="p-3 flex items-center gap-2">
        <button
          onClick={() => onEdit(id)}
          className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
          title="Edit"
        >
          <HiOutlinePencil className="w-5 h-5" />
        </button>

        <button
          onClick={() => onCetak(data)}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded-full"
          title="Cetak"
        >
          <HiOutlinePrinter className="w-5 h-5" />
        </button>

        <button
          onClick={() => onDelete(id)}
          className="p-2 text-red-600 hover:bg-red-100 rounded-full"
          title="Hapus"
        >
          <HiOutlineTrash className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
}

export default function PemeriksaanJaringan() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();

  // --- Ambil data dari API ---
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/pemeriksaan", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTableData(response.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error.response || error.message);
      Swal.fire("Gagal!", "Gagal mengambil data dari server.", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCetak = (data) => {
    navigate("/cetak-berita-acara", { state: { recordToPrint: data } });
  };

  const handleEdit = (id) => {
    navigate(`/edit-pemeriksaan/${id}`);
  };

  const handleDelete = async (id) => {
    // Konfirmasi hapus
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`http://localhost:5000/api/pemeriksaan/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          Swal.fire({
            title: "Berhasil!",
            text: "Data berhasil dihapus.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });

          fetchData(); // refresh data
        } catch (error) {
          console.error("Gagal menghapus data:", error.response || error.message);
          Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
        }
      }
    });
  };

  return (
    <div className="flex w-screen h-screen bg-gray-100 text-gray-800">
      <aside className="hidden md:flex md:w-64 bg-white flex-col justify-between shadow-lg">
        <Sidebar active="pemeriksaan" />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-white flex-col justify-between shadow-lg">
            <Sidebar active="pemeriksaan" close={() => setSidebarOpen(false)} />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}

      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold">Pemeriksaan Jaringan</h2>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded hover:bg-gray-200 md:hidden"
            >
              <HiOutlineBars3 className="text-2xl" />
            </button>
          </div>

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

            <button
              onClick={() => navigate("/form-pemeriksaan")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2 justify-center w-full sm:w-auto whitespace-nowrap"
            >
              <HiOutlinePlus className="text-lg" /> BA Pemeriksaan Jaringan
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 uppercase">
                <th className="p-3 font-semibold">ID</th>
                <th className="p-3 font-semibold">No. BA</th>
                <th className="p-3 font-semibold">Tanggal</th>
                <th className="p-3 font-semibold">Nama Pekerjaan</th>
                <th className="p-3 font-semibold">Pelanggan</th>
                <th className="p-3 font-semibold">Lokasi</th>
                <th className="p-3 font-semibold">Rayon</th>
                <th className="p-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tableData.length > 0 ? (
                tableData.map((item) => (
                  <Row
                    key={item.id}
                    data={item}
                    onCetak={handleCetak}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center p-8 text-gray-500">
                    Belum ada data pemeriksaan.
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
