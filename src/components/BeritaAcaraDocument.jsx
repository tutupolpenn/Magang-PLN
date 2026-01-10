import React, { useEffect, useState, forwardRef } from "react";
import axios from "axios";
import plnLogo from "../assets/plnLogo.png"; // pastikan path sudah benar

// --- Helper components ---
const UnderlineField = ({ label, value, className = "" }) => (
  <div className={`flex items-end gap-2 text-xs ${className}`}>
    <span className="w-55 font-semibold whitespace-nowrap">{label}</span>
    <span className="font-semibold">:</span>
    <div className="flex-1 border-b border-black pb-2 font-medium">{value || "\u00A0"}</div>
  </div>
);

const UnderlineValue = ({ value, width = "w-full" }) => (
  <div className={`border-b border-black pb-2 text-center ${width}`}>{value || "\u00A0"}</div>
);

// --- Main Document Component ---
const BeritaAcaraDocument = forwardRef(({ id, data: initialData }, ref) => {
  const [data, setData] = useState(initialData || null);

  useEffect(() => {
    if (!id || initialData) return; // Jika data sudah dikirim, tidak perlu fetch lagi

    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/pemeriksaan/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    };

    fetchData();
  }, [id, initialData]);



  if (!data) return <div ref={ref}>Data tidak ditemukan atau sedang dimuat...</div>;

  const petugasPLN = [
    data.petugas1,
    data.petugas2,
    data.petugas3,
    data.petugas4,
    data.petugas5,
  ].filter(Boolean); // Hanya ambil yang ada

  return (
    <div ref={ref} className="bg-white p-10 font-mono text-black">
      {/* KOP SURAT */}
      <div className="flex items-center gap-4">
        <img src={plnLogo} alt="PLN Logo" className="w-16 h-auto" />
        <div className="font-bold text-[10px] leading-tight">
          <p>PT.PLN (PERSERO)</p>
          <p>UNIT INDUK DISTRIBUSI JATIM</p>
          <p>UP3 PONOROGO</p>
        </div>
      </div>

      {/* Judul */}
      <div className="text-center my-6">
        <h2 className="text-sm font-bold underline uppercase">Berita Acara</h2>
        <p className="text-xs uppercase">Tentang</p>
        <p className="text-xs font-semibold uppercase">Pemeriksaan Jaringan Distribusi 20 KV</p>
      </div>

      {/* Isi Dokumen */}
      <div className="space-y-1 text-xs">
        <div className="flex items-end gap-2">
          <span className="w-55 font-semibold">No. BA</span>
          <span className="font-semibold">:</span>
          <div className="flex-1 border-b border-black pb-1">{data.no_ba || "\u00A0"}</div>
          <span>/ UP3-PRG / ULP - /</span>
          <span>{new Date(data.tanggal || Date.now()).getFullYear()}</span>
        </div>
        <UnderlineField label="PLN AREA" value={data.pln_area} />
        <UnderlineField label="NAMA PEKERJAAN" value={data.nama_pekerjaan} />
        <UnderlineField label="NAMA PELANGGAN" value={data.nama_pelanggan} />
        <UnderlineField label="ALAMAT / LOKASI" value={data.alamat_lokasi} />
        <UnderlineField label="RAYON" value={data.rayon} />
      </div>

      {/* Tanggal */}
      <div className="flex justify-between items-end mt-6 text-xs">
        <span>Pada Hari ini :</span>
        <div className="flex items-end gap-4 w-3/4">
          <div className="flex items-end gap-2 flex-1">
            <span>Tanggal:</span>
            <UnderlineValue value={data.tanggal ? new Date(data.tanggal).getDate() : ""} />
          </div>
          <div className="flex items-end gap-2 flex-1">
            <span>Bulan:</span>
            <UnderlineValue value={data.tanggal ? new Date(data.tanggal).toLocaleString("id-ID", { month: "long" }) : ""} />
          </div>
          <div className="flex items-end gap-2 flex-1">
            <span>Tahun:</span>
            <UnderlineValue value={data.tanggal ? new Date(data.tanggal).getFullYear() : ""} />
          </div>
        </div>
      </div>

      {/* SPK */}
      <div className="space-y-2 mt-4 text-xs">
        <UnderlineField label="Berdasarkan SPK / PK No. (SUTM)" value={data.spk_sutm} />
        <UnderlineField label="SPK / PK No. (SUTR)" value={data.spk_sutr} />
        <UnderlineField label="SPK / PK No. (GTT)" value={data.spk_gtt} />
        <UnderlineField label="Tanggal" value={data.tanggal ? new Date(data.tanggal).toLocaleDateString("id-ID") : ""} />
      </div>

      {/* Pemeriksaan */}
      <div className="mt-6 text-xs space-y-2">
        <p>Telah Melaksanakan Pemeriksaan Pada :</p>
        <div className="pl-4">
          <div className="flex items-end justify-between">
            <span>1. SUTM &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; A3C</span>
            <div className="flex items-end gap-2">
              <UnderlineValue value={data.sutm_as3c} width="w-20" /> = <span>Kms</span>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <span>2. SUTR Bund.Konduktor</span>
            <div className="flex items-end gap-2">
              <UnderlineValue value={data.sutr_bund_conductor} width="w-20" /> = <span>Kms</span>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <span>3. Trafo Distribusi 20 KV 3 Ph</span>
            <div className="flex items-end gap-2">
              <UnderlineValue value={data.trafo_3ph} width="w-20" /> = <span>kVA / Bh</span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs">Dan siap untuk dilakukan proses pengoperasian.</p>
      <p className="mt-2 text-xs">Demikian Berita Acara ini dibuat dengan sebenarnya untuk dipergunakan seperlunya.</p>

      {/* Petugas & Pelaksana */}
      <div className="grid grid-cols-2 gap-8 pt-8 text-xs">
        <div>
          <p className="font-semibold">Petugas PLN :</p>
          <div className="mt-2 space-y-2">
            {petugasPLN.map((petugas, index) => (
              <div key={index} className="flex items-end gap-2">
                <span>{index + 1}.</span>
                <div className="flex-1 border-b border-black pb-2">{petugas || "\u00A0"}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col">
        <p className="font-semibold">Pelaksana</p>
          <div className="flex-grow"></div>
          <div className="border-b border-dotted border-black pb-2">
        {data.pelaksana}
        </div>
      </div>
      </div>

      {/* Mengetahui & Pengawas */}
      <div className="grid grid-cols-2 gap-8 pt-20 text-center text-xs">
        <div>
          <p>Mengetahui</p>
          <p className="font-semibold">Asman Jaringan</p>
          <div className="mt-20 border-b border-black w-2/3 mx-auto"></div>
        </div>
        <div>
          <p>Pengawas</p>
          <p className="font-semibold">PT. PLN UP3 Ponorogo</p>
          <div className="mt-20 border-b border-black w-2/3 mx-auto"></div>
        </div>
      </div>
    </div>
  );
});

export default BeritaAcaraDocument;
