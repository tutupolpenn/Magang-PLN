import React, { useState, useEffect } from "react";
import axios from "axios";
import SidebarAdmin from "../components/SidebarAdmin";
import {
  HiOutlineBars3,
  HiOutlinePencil,
  HiOutlinePrinter,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function DashboardAdmin() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [laporanCount, setLaporanCount] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [trafoData, setTrafoData] = useState([]);
  const [perbaikanData, setPerbaikanData] = useState([]);
  const [filterType, setFilterType] = useState("harian");

  const getToken = () => localStorage.getItem("token");

  // Re-fetch saat filter berubah
  useEffect(() => {
    fetchLaporanData();
  }, [filterType]);

  // Fetch data perbaikan saat mount
  useEffect(() => {
    fetchPerbaikanData();
  }, []);

  // ================= FETCH LAPORAN & PROCESS CHART =================
  const fetchLaporanData = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.warn("⚠️ Token tidak ditemukan");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/laporan", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📥 Response Dashboard:", res.data);

      let laporan = [];
      
      if (res.data.success && res.data.data) {
        laporan = res.data.data;
      } else if (res.data.laporan) {
        laporan = res.data.laporan;
      } else if (Array.isArray(res.data)) {
        laporan = res.data;
      } else {
        console.error("❌ Format response tidak dikenali:", res.data);
        laporan = [];
      }

      if (!Array.isArray(laporan)) {
        console.error("❌ Data bukan array:", laporan);
        laporan = [];
      }

      console.log("📊 Data laporan:", laporan.length, "items");

      setLaporanCount(laporan.length);

      // Setup table data
      const sortedForTable = [...laporan].sort((a, b) => {
        const dateA = new Date(a.tanggalKerusakan || 0);
        const dateB = new Date(b.tanggalKerusakan || 0);

        if (dateB.getTime() !== dateA.getTime()) {
          return dateB - dateA;
        }
        return b.id - a.id;
      });

      const topFiveData = sortedForTable.slice(0, 5);

      setTrafoData(
        topFiveData.map((item, idx) => ({
          id: item.id,
          no: idx + 1,
          tanggal: item.tanggalKerusakan
            ? new Date(item.tanggalKerusakan).toLocaleString("id-ID", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-",
          gardu: item.kodegi || "-",
          penyulang: item.kodepenyul || "-",
          gtt: item.kodegardu || "-",
          alamat: item.alamatgardu || "-",
        }))
      );

      // Setup chart data
      const grouped = {};

      laporan.forEach((item) => {
        const rawDate =
          item.tanggalKerusakan ||
          item.tanggal_kerusakan ||
          item.createdAt;

        if (!rawDate) return;

        const dateObj = new Date(rawDate);
        let key = "";
        let sortKey = 0;

        if (filterType === "harian") {
          key = dateObj.toLocaleDateString("id-ID");
          sortKey = dateObj.getTime();
        } else if (filterType === "bulanan") {
          key = dateObj.toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric",
          });
          sortKey = dateObj.getFullYear() * 100 + (dateObj.getMonth() + 1);
        } else {
          key = dateObj.getFullYear().toString();
          sortKey = dateObj.getFullYear();
        }

        if (!grouped[key]) {
          grouped[key] = {
            date: key,
            sortKey: sortKey,
            Masuk: 0,
            Rusak: 0,
            Perbaikan: 0,
            Selesai: 0,
          };
        }

        grouped[key].Masuk += 1;
        if (item.status === "Rusak") grouped[key].Rusak += 1;
        if (item.status === "Perbaikan") grouped[key].Perbaikan += 1;
        if (item.status === "Selesai") grouped[key].Selesai += 1;
      });

      const formattedChart = Object.values(grouped).sort(
        (a, b) => a.sortKey - b.sortKey
      );

      setChartData(formattedChart);
      
      console.log("📈 Chart data:", formattedChart.length, "points");
      console.log("📋 Table data:", topFiveData.length, "rows");
      
    } catch (err) {
      console.error("❌ Gagal ambil data laporan:", err);
      
      if (err.response?.status === 401) {
        console.error("❌ Token expired atau invalid");
        navigate("/login");
      }
    }
  };

  // ================= FETCH PERBAIKAN (FIXED) =================
  const fetchPerbaikanData = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.warn("⚠️ Token tidak ditemukan untuk perbaikan");
        return;
      }

      console.log("🔧 Fetching perbaikan data...");

      const res = await axios.get("http://localhost:5000/api/perbaikan", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📥 Response Perbaikan:", res.data);

      // ✅ Handle berbagai format response
      let perbaikan = [];

      if (res.data.success && res.data.data) {
        // Format: { success: true, data: [...] }
        perbaikan = res.data.data;
      } else if (res.data.perbaikan) {
        // Format: { perbaikan: [...] }
        perbaikan = res.data.perbaikan;
      } else if (Array.isArray(res.data)) {
        // Format: [...]
        perbaikan = res.data;
      } else {
        console.error("❌ Format response perbaikan tidak dikenali:", res.data);
        perbaikan = [];
      }

      // ✅ Validasi array
      if (!Array.isArray(perbaikan)) {
        console.error("❌ Data perbaikan bukan array:", perbaikan);
        perbaikan = [];
      }

      console.log("🔧 Total data perbaikan:", perbaikan.length);
      console.log("🔧 Sample data:", perbaikan[0]);

      setPerbaikanData(perbaikan);

    } catch (err) {
      console.error("❌ Gagal ambil data perbaikan:", err);
      console.error("❌ Error detail:", err.response?.data || err.message);
      
      if (err.response?.status === 401) {
        console.error("❌ Token expired atau invalid");
        navigate("/login");
      }
      
      // Set empty array jika error
      setPerbaikanData([]);
    }
  };

  // ✅ Hitung total dengan validasi
  const totalGantiTrafo = perbaikanData.filter(
    (p) => p.jenis_perbaikan === "gantiTrafo"
  ).length;

  const totalTrafoMobile = perbaikanData.filter(
    (p) => p.jenis_perbaikan === "gantiTrafoMobile"
  ).length;

  const totalKopelTrafo = perbaikanData.filter(
    (p) => p.jenis_perbaikan === "kopelTrafoSebelah"
  ).length;

  // Debug: Log totals
  useEffect(() => {
    console.log("📊 Perbaikan Stats:", {
      total: perbaikanData.length,
      gantiTrafo: totalGantiTrafo,
      trafoMobile: totalTrafoMobile,
      kopelTrafo: totalKopelTrafo,
    });
  }, [perbaikanData, totalGantiTrafo, totalTrafoMobile, totalKopelTrafo]);

  return (
    <div className="flex w-screen h-screen bg-gray-100 text-gray-800">
      {/* SIDEBAR */}
      <aside className="hidden md:flex md:w-64 bg-gray-200 flex-col justify-between shadow-md">
        <SidebarAdmin active="dashboard" />
      </aside>

      {/* MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-gray-200 flex flex-col justify-between shadow-md">
            <SidebarAdmin active="dashboard" close={() => setSidebarOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded hover:bg-gray-200"
          >
            <HiOutlineBars3 className="text-2xl" />
          </button>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Total Laporan" value={laporanCount} color="bg-red-500" />
          <Card title="Ganti Trafo" value={totalGantiTrafo} color="bg-green-500" />
          <Card title="Trafo Mobile" value={totalTrafoMobile} color="bg-yellow-500" />
          <Card title="Kopel Trafo" value={totalKopelTrafo} color="bg-blue-500" />
        </div>

        {/* BAR CHART */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-500 font-semibold">
              Statistik Laporan ({filterType.charAt(0).toUpperCase() + filterType.slice(1)})
            </p>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="harian">Harian</option>
              <option value="bulanan">Bulanan</option>
              <option value="tahunan">Tahunan</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" style={{ fontSize: '12px' }} />
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />

              <Bar
                dataKey="Masuk"
                name="Laporan Masuk"
                fill="#EF4444"
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* TABLE 5 DATA TERBARU */}
        <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">Data Pelaporan Terkini</h3>
          <table className="w-full min-w-[600px] border-collapse">
            <thead className="bg-gray-100 text-gray-700 border-b border-gray-200">
              <tr>
                <th className="p-3 text-left font-semibold">No</th>
                <th className="p-3 text-left font-semibold">Tanggal</th>
                <th className="p-3 text-left font-semibold">Gardu</th>
                <th className="p-3 text-left font-semibold">Penyulang</th>
                <th className="p-3 text-left font-semibold">GTT</th>
                <th className="p-3 text-left font-semibold">Alamat</th>
                <th className="p-3 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {trafoData.length > 0 ? (
                trafoData.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3">{row.no}</td>
                    <td className="p-3 text-sm">{row.tanggal}</td>
                    <td className="p-3">{row.gardu}</td>
                    <td className="p-3">{row.penyulang}</td>
                    <td className="p-3">{row.gtt}</td>
                    <td className="p-3">{row.alamat}</td>
                    <td className="p-3 flex gap-2 justify-center">
                      <button
                        onClick={() => navigate(`/edit-pelaporan/${row.id}`)}
                        style={{ backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb" }}
                        className="p-2 rounded-lg hover:bg-blue-50 transition text-blue-600"
                        title="Edit Data"
                      >
                        <HiOutlinePencil className="text-blue-600 text-xl" />
                      </button>
                     
                      <button
                        onClick={() => navigate(`/cetak-laporan-kerusakan/${row.id}`)}
                        style={{ backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb" }}
                        className="p-2 rounded-lg hover:bg-gray-200 transition text-gray-600"
                        title="Cetak Laporan"
                      >
                        <HiOutlinePrinter className="text-gray-600 text-xl" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    Belum ada data laporan terbaru.
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

function Card({ title, value, color }) {
  return (
    <div className={`p-4 rounded-lg shadow text-white ${color}`}>
      <p className="text-sm font-medium opacity-90">{title}</p>
      <h3 className="text-3xl font-bold mt-1">{value}</h3>
    </div>
  );
}