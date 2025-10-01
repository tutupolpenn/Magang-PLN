import React, { useState } from "react";
import Sidebar from "../components/Sidebar"; // Pastikan path ini benar
import { HiOutlineBars3 } from "react-icons/hi2";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dummy data per hari
  const dailyData = [
    { date: "15 Sep", masuk: 2, rusak: 1, perbaikan: 0, selesai: 1 },
    { date: "16 Sep", masuk: 3, rusak: 2, perbaikan: 1, selesai: 1 },
    { date: "17 Sep", masuk: 1, rusak: 0, perbaikan: 1, selesai: 0 },
    { date: "18 Sep", masuk: 4, rusak: 2, perbaikan: 2, selesai: 2 },
    { date: "19 Sep", masuk: 5, rusak: 3, perbaikan: 1, selesai: 2 },
  ];

  // Data trafo rusak
  const [trafoData, setTrafoData] = useState([
    { no: "1", gardu: "GI-01", penyulang: "P1", gtt: "GTT-001", alamat: "Jl. Mawar 1", status: "Rusak", color: "bg-red-400" },
    { no: "2", gardu: "GI-02", penyulang: "P2", gtt: "GTT-002", alamat: "Jl. Melati 2", status: "Ganti Trafo", color: "bg-green-400" },
    { no: "3", gardu: "GI-03", penyulang: "P3", gtt: "GTT-003", alamat: "Jl. Kenanga 3", status: "Trafo Mobile", color: "bg-yellow-400" },
  ]);

  // State untuk modal edit
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  // Handler untuk buka modal edit
  const handleEdit = (row, idx) => {
    setEditData(row);
    setEditIndex(idx);
    setEditModalOpen(true);
  };

  // Handler untuk simpan perubahan
  const handleSaveEdit = (newData) => {
    const updated = [...trafoData];
    let color = "bg-red-400";
    if (newData.status === "Ganti Trafo") color = "bg-green-400";
    else if (newData.status === "Trafo Mobile") color = "bg-yellow-400";
    updated[editIndex] = { ...newData, color };
    setTrafoData(updated);
    setEditModalOpen(false);
  };

  return (
    <div className="flex w-screen h-screen bg-gray-100 text-gray-800">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex md:w-64 bg-gray-200 flex-col justify-between shadow-md">
        {/* PERUBAIKAN: Mengganti active menjadi "dashboard" */}
        <Sidebar active="dashboard" />
      </aside>

      {/* SIDEBAR MOBILE */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-gray-200 flex flex-col justify-between shadow-md">
            {/* PERUBAIKAN: Mengganti active menjadi "dashboard" */}
            <Sidebar active="dashboard" close={() => setSidebarOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
        {/* PERUBAIKAN: Struktur header disatukan agar lebih rapi dan konsisten */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold">Dashboard</h2>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded hover:bg-gray-200 md:hidden"
          >
            <HiOutlineBars3 className="text-2xl" />
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card title="Total Laporan Masuk" value="15" color="bg-blue-500" />
          <Card title="Total Kerusakan" value="15" color="bg-red-400" />
          <Card title="Total Perbaikan" value="10" color="bg-yellow-400" />
          <Card title="Total Selesai" value="5" color="bg-green-400" />
        </div>

        {/* Charts per hari */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-center text-sm text-gray-500 mb-2">
              Laporan Masuk per Hari
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="masuk" fill="#2563EB" />
                <Bar dataKey="rusak" fill="#DC2626" />
                <Bar dataKey="perbaikan" fill="#FBBF24" />
                <Bar dataKey="selesai" fill="#16A34A" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-center text-sm text-gray-500 mb-2">
              Trend Laporan Harian
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="masuk" stroke="#2563EB" />
                <Line type="monotone" dataKey="rusak" stroke="#DC2626" />
                <Line type="monotone" dataKey="perbaikan" stroke="#FBBF24" />
                <Line type="monotone" dataKey="selesai" stroke="#16A34A" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">Data Trafo Rusak</h3>
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white text-left">
                <th className="p-2">No</th>
                <th className="p-2">Gardu Induk</th>
                <th className="p-2">Penyulang</th>
                <th className="p-2">Nomer GTT</th>
                <th className="p-2">Alamat</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {trafoData.map((row, idx) => (
                <Row
                  key={row.no}
                  {...row}
                  onEdit={() => handleEdit(row, idx)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Edit */}
        {editModalOpen && (
          <EditModal
            data={editData}
            onClose={() => setEditModalOpen(false)}
            onSave={handleSaveEdit}
          />
        )}
      </main>
    </div>
  );
}

// ... (Komponen Card, Row, dan EditModal tetap sama, tidak perlu diubah) ...
/* ===== Sub Components ===== */
function Card({ title, value, color }) {
  return (
    <div className={`p-4 md:p-6 rounded-lg shadow text-white ${color}`}>
      <p className="font-semibold text-sm md:text-base">{title}</p>
      <h3 className="text-2xl md:text-3xl font-bold mt-1 md:mt-2">{value}</h3>
    </div>
  );
}

function Row({ no, gardu, penyulang, gtt, alamat, status, color, onEdit }) {
  return (
    <tr className="border-b text-sm md:text-base">
      <td className="p-2">{no}</td>
      <td className="p-2">{gardu}</td>
      <td className="p-2">{penyulang}</td>
      <td className="p-2">{gtt}</td>
      <td className="p-2">{alamat}</td>
      <td className="p-2">
        <span className={`px-3 py-1 rounded-full text-white text-xs md:text-sm ${color}`}>
          {status}
        </span>
      </td>
      <td className="p-2 space-x-1 md:space-x-2">
        <button
          className="px-2 md:px-3 py-1 bg-blue-500 text-white rounded text-xs md:text-sm"
          onClick={onEdit}
        >
          Edit
        </button>
        <button className="px-2 md:px-3 py-1 bg-gray-700 text-white rounded text-xs md:text-sm">Cetak</button>
      </td>
    </tr>
  );
}

function EditModal({ data, onClose, onSave }) {
  const [form, setForm] = useState({ ...data });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Data Trafo</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Gardu Induk</label>
            <input
              type="text"
              name="gardu"
              value={form.gardu}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Penyulang</label>
            <input
              type="text"
              name="penyulang"
              value={form.penyulang}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Nomer GTT</label>
            <input
              type="text"
              name="gtt"
              value={form.gtt}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Alamat</label>
            <input
              type="text"
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="Rusak">Rusak</option>
              <option value="Ganti Trafo">Ganti Trafo</option>
              <option value="Trafo Mobile">Trafo Mobile</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}