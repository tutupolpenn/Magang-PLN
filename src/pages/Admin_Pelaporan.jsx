// Pelaporan.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineBars3,
  HiOutlineCalendar,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlinePrinter,
  HiOutlineTrash,
} from "react-icons/hi2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SidebarAdmin from "../components/SidebarAdmin";
import axios from "axios";
import Swal from "sweetalert2";

export default function PelaporanAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [laporanData, setLaporanData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await axios.get("http://localhost:5000/api/laporan", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("RESPON API:", res.data);
        setLaporanData(res.data.laporan || res.data || []);
      } catch (err) {
        console.error("ERROR FETCH:", err);
      }
    };
    fetchLaporan();
  }, [navigate]);

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
      <aside className="hidden md:flex md:w-64 bg-gray-200 flex-col justify-between shadow-md">
        <SidebarAdmin active="pelaporan" />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-gray-200 flex flex-col justify-between shadow-md">
            <SidebarAdmin active="pelaporan" close={() => setSidebarOpen(false)} />
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
            Pelaporan Trafo
          </h2>
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

            <button disabled className="bg-yellow-400 text-black px-3 py-2 rounded-lg shadow flex items-center gap-1 justify-center w-full sm:w-auto">
              <HiOutlineBars3 className="text-xl" /> Filter
            </button>

            <button
              onClick={() => navigate("/form-pelaporan")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow flex items-center gap-1 justify-center w-full sm:w-auto whitespace-nowrap"
            >
              <HiOutlinePlus className="text-lg" /> BA Kerusakan Trafo
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100 text-gray-700 font-semibold">
                <th className="p-3 text-left">No</th>
                <th className="p-3 text-left">Tanggal</th>
                <th className="p-3 text-left">Gardu Induk</th>
                <th className="p-3 text-left">Penyulang</th>
                <th className="p-3 text-left">Alamat</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {laporanData.length > 0 ? (
                laporanData.map((laporan, index) => (
                  <tr key={laporan.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">
                      {laporan.tanggalKerusakan
                        ? new Date(laporan.tanggalKerusakan).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td className="p-3">{laporan.kodegi || "-"}</td>
                    <td className="p-3">{laporan.kodepenyul || "-"}</td>
                    <td className="p-3">{laporan.alamatgardu || "-"}</td>
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/edit-pelaporan/${laporan.id}`)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-blue-50 border border-gray-200"
                      >
                        <HiOutlinePencil className="text-blue-600 text-xl" />
                      </button>
                      <button
                        onClick={() => handlePrintPage(laporan)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-50 border border-gray-200"
                      >
                        <HiOutlinePrinter className="text-gray-600 text-xl" />
                      </button>
                      <button
                        onClick={() => handleDelete(laporan.id)}
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
