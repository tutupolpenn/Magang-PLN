import React, { useEffect, useState, forwardRef } from 'react';
import axios from "axios";
import plnLogo from "../assets/plnLogo.png";

// =============================
// Helper Components
// =============================
const SectionTitle = ({ title }) => (
  <h2 className="font-bold text-lg underline text-center mb-4">{title}</h2>
);

const DataRow = ({ label, value, unit = "" }) => (
  <div className="flex text-sm">
    <span className="w-48 font-semibold">{label}</span>
    <span>: {value || "-"} {unit}</span>
  </div>
);

const SignatureBox = ({ title }) => (
  <div className="flex flex-col items-center text-sm">
    <p className="font-semibold">{title}</p>
    <div className="w-40 h-24 border border-gray-400 mt-2"></div>
  </div>
);

// =============================
// MAIN COMPONENT
// =============================
const HasilTestCetak = forwardRef(({ id }, ref) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/hasiltest/${id}`);
        setData(response.data);
      } catch (err) {
        setError("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p>Memuat data...</p>;
  if (error || !data) return <p>Data tidak ditemukan.</p>;

  return (
    <div ref={ref} className="p-10 w-full text-black font-sans">

      {/* ======================== */}
      {/* HEADER */}
      {/* ======================== */}
      <div className="flex justify-between items-center mb-8">
        <img src={plnLogo} alt="PLN Logo" className="w-24" />
        <div className="text-right text-sm">
          <p>PT PLN (Persero)</p>
          <p>Unit Layanan Pelanggan</p>
          <p><strong>Hasil Pengujian</strong></p>
        </div>
      </div>

      {/* ======================== */}
      {/* HALAMAN 1 - HASIL TEST */}
      {/* ======================== */}
      <SectionTitle title="HASIL PENGUJIAN PERALATAN" />

      <div className="space-y-2">
        <DataRow label="Nama Pelanggan" value={data.namaPelanggan} />
        <DataRow label="Alamat" value={data.alamat} />
        <DataRow label="Nomor Meter" value={data.nomorMeter} />
        <DataRow label="Jenis Pengujian" value={data.jenisPengujian} />
        <DataRow label="Stand" value={data.stand} />
        <DataRow label="Hasil Akhir" value={data.hasilAkhir} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
        <SignatureBox title="Petugas Penguji" />
        <SignatureBox title="Pengawas" />
        <SignatureBox title="Pelanggan" />
      </div>

      {/* Break for printing page 2 */}
      <div className="page-break" />

      {/* ======================== */}
      {/* HALAMAN 2 - BERITA ACARA */}
      {/* ======================== */}
      <SectionTitle title="BERITA ACARA PENGECEKAN PERALATAN" />

      <p className="text-sm leading-relaxed mb-4">
        Pada hari ini dilakukan pengecekan peralatan terhadap pelanggan bernama
        <strong> {data.namaPelanggan}</strong> yang berlokasi di <strong>{data.alamat}</strong>.
        Hasil pengecekan menunjukkan bahwa kondisi perangkat: <strong>{data.hasilAkhir}</strong>.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
        <SignatureBox title="Pemeriksa" />
        <SignatureBox title="Saksi 1" />
        <SignatureBox title="Saksi 2" />
      </div>
    </div>
  );
});

export default HasilTestCetak;