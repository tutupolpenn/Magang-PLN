import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  HiOutlineBars3,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";

import SidebarAdmin from "../components/SidebarAdmin";

// Komponen untuk baris data trafo
function TrafoRow({ trafo, onEdit, onHapus }) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3 font-medium text-gray-800">{trafo.kodegi}</td>
      <td className="p-3 text-gray-700">{trafo.ulp}</td>
      <td className="p-3 text-gray-700">{trafo.kodepenyul}</td>
      <td className="p-3 text-gray-700">{trafo.kodegardu}</td>
      <td className="p-3 text-gray-700">{trafo.alamatgardu}</td>
      <td className="p-3 flex items-center justify-end gap-2">
        <button
          onClick={() => onEdit(trafo.kodegardu)}
          className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
          title="Edit"
        >
          <HiOutlinePencil className="w-5 h-5" />
        </button>
        <button
          onClick={() => onHapus(trafo.kodegardu)}
          className="p-2 text-red-600 hover:bg-red-100 rounded-full"
          title="Hapus"
        >
          <HiOutlineTrash className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
}

export default function ManajemenTrafo() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [trafos, setTrafos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(1);

  const token = localStorage.getItem("token");

  // Ambil data trafo
  const fetchTrafos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/data-trafo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrafos(response.data);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        Swal.fire({
          icon: "warning",
          title: "Sesi Habis",
          text: "Sesi login habis, silakan login ulang.",
        }).then(() => navigate("/login"));
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat",
          text: "Terjadi kesalahan saat memuat data trafo.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrafos();
  }, []);

  // Navigasi CRUD
  const handleAddTrafo = () => navigate("/add-trafo");
  const handleEdit = (kodegardu) => navigate(`/edit-trafo/${kodegardu}`);

  // Hapus data
  const handleHapus = async (kodegardu) => {
    const confirm = await Swal.fire({
      title: "Yakin Hapus Data Trafo?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/data-trafo/${kodegardu}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data trafo berhasil dihapus.",
          timer: 1500,
          showConfirmButton: true,
        });
        fetchTrafos();
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Gagal menghapus data trafo.",
        });
      }
    }
  };

  // Filter pencarian
  const filteredTrafos = trafos.filter(
    (trafo) =>
      trafo.kodegi?.toLowerCase().includes(search.toLowerCase()) ||
      trafo.ulp?.toLowerCase().includes(search.toLowerCase()) ||
      trafo.kodepenyul?.toLowerCase().includes(search.toLowerCase()) ||
      trafo.kodegardu?.toLowerCase().includes(search.toLowerCase()) ||
      trafo.alamatgardu?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalData = filteredTrafos.length;
  const totalPages = Math.ceil(totalData / limit);
  const startIndex = (page - 1) * limit;
  const currentData = filteredTrafos.slice(startIndex, startIndex + limit);

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  return (
    <div className="flex w-screen h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-white flex-col justify-between shadow-lg">
        <SidebarAdmin active="trafo" />
      </aside>

      {/* Sidebar Responsif */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-white flex-col justify-between shadow-lg">
            <SidebarAdmin active="trafo" close={() => setSidebarOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold">Manajemen Gardu</h2>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded hover:bg-gray-200 md:hidden"
            >
              <HiOutlineBars3 className="text-2xl" />
            </button>
          </div>
          <button
            onClick={handleAddTrafo}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2 justify-center w-full sm:w-auto"
          >
            <HiOutlinePlus className="text-lg" /> Tambah Gardu
          </button>
        </div>

        {/* Search dan Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="relative w-full sm:max-w-md">
            <HiOutlineMagnifyingGlass
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari trafo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Tampilkan</span>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="500">500</option>
            </select>
            <span className="text-gray-600 text-sm">data</span>
          </div>
        </div>

        {/* Tabel Trafo */}
        <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 uppercase">
                <th className="p-3 font-semibold">Kode GI</th>
                <th className="p-3 font-semibold">ULP</th>
                <th className="p-3 font-semibold">Kode Penyulang</th>
                <th className="p-3 font-semibold">Kode Gardu</th>
                <th className="p-3 font-semibold">Alamat Gardu</th>
                <th className="p-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center p-8 text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((trafo) => (
                  <TrafoRow
                    key={trafo.kodegardu}
                    trafo={trafo}
                    onEdit={handleEdit}
                    onHapus={handleHapus}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-8 text-gray-500">
                    Tidak ada data trafo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination info */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <span>
              Menampilkan {startIndex + 1}–{Math.min(startIndex + limit, totalData)} dari {totalData} data
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
