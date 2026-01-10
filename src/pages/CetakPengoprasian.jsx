// src/pages/CetakPengoperasian.jsx
import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlinePrinter } from "react-icons/hi2";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "../components/Sidebar";
import PengoperasianDocument from "../components/PengoprasianCetak";

export default function CetakPengoperasian() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const printRef = useRef();

  // Ambil data pengoperasian berdasarkan ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire("Sesi berakhir", "Silakan login kembali.", "warning");
          navigate("/login");
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/test-jaringan/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Data pengoperasian:", res.data);
        const fetchedData = res.data.data || res.data;
        setData(Array.isArray(fetchedData) ? fetchedData[0] : fetchedData);
      } catch (err) {
        console.error("Gagal memuat data:", err);
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Data",
          text: "Terjadi kesalahan saat mengambil data pengoperasian.",
        });
        navigate("/pengoperasian-jaringan");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, navigate]);

  // Fungsi print menggunakan window.print()
  const handlePrint = () => {
    window.print();
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data pengoperasian...</p>
        </div>
      </div>
    );
  }

  // Jika data tidak ditemukan
  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-500 mb-4 text-lg">Data tidak ditemukan.</p>
          <button
            onClick={() => navigate("/pengoperasian-jaringan")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Kembali ke Pengoperasian Jaringan
          </button>
        </div>
      </div>
    );
  }

  // Tampilan utama
  return (
    <div className="flex w-screen min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-gray-200 flex-col justify-between shadow-md print:hidden">
        <Sidebar active="pengoperasian" />
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Tombol Aksi */}
        <div className="flex justify-between items-center mb-4 print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            <HiOutlineArrowLeft /> Kembali
          </button>

            {/*<button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            <HiOutlinePrinter /> Cetak PDF
          </button>*/}
        </div>

        {/* Dokumen Cetak - F4 Size */}
        <div
          ref={printRef}
          className="bg-white shadow-lg rounded-lg mx-auto"
          style={{
            width: "8.3in",
            minHeight: "11.7in",
          }}
        >
          <PengoperasianDocument data={data} />
        </div>
      </main>
    </div>
  );
}