// src/pages/CetakInvestigasi.jsx
import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlinePrinter } from "react-icons/hi2";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "../components/Sidebar";
import InvestigasiDocument from "../components/InvestigasiDocument";

const API_URL = "http://localhost:5000/api";

export default function CetakInvestigasi() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const printRef = useRef();

  // Ambil data investigasi berdasarkan ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire("Sesi berakhir", "Silakan login kembali.", "warning");
          navigate("/login");
          return;
        }

        console.log("Fetching data for ID:", id);
        const res = await axios.get(`${API_URL}/investigasi/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Response dari API:", res.data);
        
        // Handle berbagai format response dari API
        let fetchedData;
        if (res.data.data) {
          // Format: { data: {...} } atau { data: [{...}] }
          fetchedData = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
        } else if (Array.isArray(res.data)) {
          // Format: [{...}]
          fetchedData = res.data[0];
        } else {
          // Format: {...}
          fetchedData = res.data;
        }

        console.log("Data yang akan digunakan:", fetchedData);
        setData(fetchedData);
      } catch (err) {
        console.error("Gagal memuat data:", err);
        const errorMessage = err.response?.data?.message || "Terjadi kesalahan saat mengambil data investigasi.";
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Data",
          text: errorMessage,
        });
        navigate("/investigasi");
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
          <p className="text-gray-600">Memuat data investigasi...</p>
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
            onClick={() => navigate("/investigasi")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Kembali ke Investigasi
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
        <Sidebar active="investigasi" />
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 p-6 overflow-auto">
<div className="grid grid-cols-3 items-center mb-4 print:hidden">
  {/* Kolom Kiri */}
  <div className="justify-self-start">
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
    >
      <HiOutlineArrowLeft /> Kembali
    </button>
  </div>

  {/* Kolom Tengah */}
  <h1 className="text-2xl font-bold text-gray-800 text-center whitespace-nowrap">
    Preview Form Investigasi
  </h1>

  {/* Kolom Kanan (Kosong/Tempat Tombol Cetak) */}
  <div className="justify-self-end">
    {/* Biarkan kosong agar judul tetap di tengah, 
        atau pasang tombol cetak di sini nanti */}
  </div>
</div>
        {/* Info Data */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow print:hidden">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Informasi Data:</h2>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>
              <span className="font-medium">No. Seri:</span> {data.noSeri || "-"}
            </div>
            <div>
              <span className="font-medium">Kode Trafo:</span> {data.kodeTrafo || "-"}
            </div>
            <div>
              <span className="font-medium">Daya:</span> {data.daya || "-"}
            </div>
            <div>
              <span className="font-medium">Fasa:</span> {data.fasa || "-"}
            </div>
          </div>
        </div>

        {/* Dokumen Cetak - F4 Size */}
        <div
          ref={printRef}
          className="bg-white shadow-lg rounded-lg mx-auto"
          style={{
            width: "215mm",
            minHeight: "330mm",
          }}
        >
          <InvestigasiDocument data={data} />
        </div>

        {/* Info */}
        <div className="mt-4 text-center text-sm text-gray-600 print:hidden">
          <p>💡 Klik tombol "Cetak" untuk mencetak atau menyimpan sebagai PDF</p>
          <p className="text-xs text-gray-500 mt-1">Data ID: {id}</p>
        </div>
      </main>

      {/* Print-specific styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}