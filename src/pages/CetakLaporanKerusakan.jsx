import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { HiOutlineArrowDownTray, HiOutlineArrowLeft } from "react-icons/hi2";
import axios from "axios";
import Swal from "sweetalert2";

import Sidebar from "../components/Sidebar";
import LaporanDocument from "../components/LaporanKerusakanCetak";

export default function CetakLaporanKerusakan() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [laporanData, setLaporanData] = useState(null);
  const printRef = useRef();

  // 🔹 Ambil data laporan berdasarkan ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/laporan/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data.laporan || res.data;
        const finalData = Array.isArray(data) ? data[0] : data;
        setLaporanData(finalData);

        // 📝 Set judul dokumen agar saat "Print" manual (Ctrl+P) nama file otomatis terisi
        document.title = `Laporan_Kerusakan_${finalData.kodegi || id}`;

      } catch (err) {
        console.error("Gagal memuat laporan:", err);
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Data",
          text: "Terjadi kesalahan saat mengambil data laporan.",
        });
        navigate("/pelaporan");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();

    // Cleanup title saat keluar halaman
    return () => { document.title = "Aplikasi PLN"; };
  }, [id, navigate]);

  // ✅ Fungsi Cetak ke PDF dengan Penamaan Otomatis
  const handleDownloadPdf = async () => {
    if (!laporanData) return;

    try {
      Swal.fire({
        title: "Memproses PDF...",
        text: "Mohon tunggu sebentar",
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
      });

      const element = printRef.current;
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const cloned = element.cloneNode(true);
      cloned.style.backgroundColor = "white";
      cloned.style.width = "794px"; 
      cloned.style.padding = "40px";
      
      // Mengatasi masalah warna OKLCH Tailwind agar terbaca html2canvas
      cloned.querySelectorAll("*").forEach((el) => {
        el.style.color = "black";
        el.style.borderColor = "#333";
      });

      document.body.appendChild(cloned);

      const canvas = await html2canvas(cloned, {
        scale: 2, 
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      // 🏷️ LOGIKA PENAMAAN OTOMATIS
      // Menghapus karakter yang dilarang dalam nama file (seperti / \ : * ? " < > |)
      const cleanKodeGI = String(laporanData.kodegi || id).replace(/[/\\?%*:|"<>]/g, '-');
      const fileName = `Laporan_Kerusakan_${cleanKodeGI}.pdf`;

      pdf.save(fileName);

      document.body.removeChild(cloned);
      Swal.close();

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: `Laporan "${fileName}" berhasil diunduh.`,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat membuat PDF.",
      });
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!laporanData) return null;

  return (
    <div className="flex w-screen min-h-screen bg-gray-100 text-gray-800">
      <aside className="hidden md:flex md:w-64 bg-gray-200 flex-col shadow-md print:hidden">
        <Sidebar active="pelaporan" />
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-4 print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            <HiOutlineArrowLeft /> Kembali
          </button>

          {/* Tombol Download yang sudah diaktifkan 
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow-lg"
          >
            <HiOutlineArrowDownTray /> Unduh PDF Otomatis
          </button>*/}
        </div>

        <div
          ref={printRef}
          className="bg-white shadow-xl p-8 rounded-lg mx-auto max-w-[794px]"
          style={{ minHeight: "1123px" }}
        >
          <LaporanDocument laporan={laporanData} />
        </div>
      </main>
    </div>
  );
}