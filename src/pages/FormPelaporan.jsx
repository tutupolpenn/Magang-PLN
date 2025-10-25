import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineBars3 } from "react-icons/hi2";
import axios from "axios";

// Komponen terpisah
import Sidebar from "../components/Sidebar";
import Section from "../components/Section";
import InputField from "../components/InputField";
import CollapsibleSection from "../components/CollapsibleSection";
import PhotoUpload from "../components/PhotoUpload";

// Konfigurasi API Base URL
const API_URL = "http://localhost:5000/api";

export default function FormPelaporan() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // State utama form - dengan nilai default yang konsisten
  const [formData, setFormData] = useState({
    // Data Gardu
    garduInduk: "",
    penyulang: "",
    nomorGTT: "",
    alamat: "",

    // Data Trafo
    merk: "",
    daya: "",
    nomorSerie: "",
    fasa: "",
    teganganPrimer: "",
    teganganSekunder: "",
    arusPrimer: "",
    arusSekunder: "",
    impedensi: "",
    tahun: "",
    tapTrafo: "",
    teganganTap: "",
    konstruksiTrafo: "",
    hubunganBelitan: "",
    trafoEk: "",
    namaBengkel: "",
    tanggalOperasi: "",
    platPemeriksaanMinyak: "",

    // Kerusakan
    tanggalKerusakan: "",
    tangkiRusak: false,
    bushingTM: false,
    bushingTR: false,
    tapCharger: false,
    minyakTrafo: false,
    stopKran: false,

    // Penahanan
    titikNetral: "",
    lightningArrester: "",

    // Pembatas Trafo - Primer
    pengamanPrimerPhasaR: "",
    pengamanPrimerPhasaS: "",
    pengamanPrimerPhasaT: "",
    
    // Pembatas Trafo - Sekunder Pertama
    pengamanSkunderPhasaR: "",
    pengamanSkunderPhasaS: "",
    pengamanSkunderPhasaT: "",
    
    // Pembatas Trafo - Sekunder Jurusan A
    pengamanSkunderAPhasaR: "",
    pengamanSkunderAPhasaS: "",
    pengamanSkunderAPhasaT: "",
    
    // Pembatas Trafo - Sekunder Jurusan B
    pengamanSkunderBPhasaR: "",
    pengamanSkunderBPhasaS: "",
    pengamanSkunderBPhasaT: "",
    
    // Pembatas Trafo - Sekunder Jurusan C
    pengamanSkunderCPhasaR: "",
    pengamanSkunderCPhasaS: "",
    pengamanSkunderCPhasaT: "",
    
    // Pembatas Trafo - Sekunder Jurusan D
    pengamanSkunderDPhasaR: "",
    pengamanSkunderDPhasaS: "",
    pengamanSkunderDPhasaT: "",
    
    // Data Pembatas Lainnya
    merkSaklarUtama: "",
    arusNominalSaklarUtama: "",
    jenisKabel: "",
    penampangIncoming: "",
    penampangOutgoing: "",

    // Lainnya
    keterangan: "",
    Latitude: "",
    Longitude: "",

    // Foto
    foto1: "",
    foto2: "",
    foto3: "",
  });

  // Input handler generik
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Ambil lokasi GPS otomatis saat component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            Latitude: pos.coords.latitude.toString(),
            Longitude: pos.coords.longitude.toString(),
          }));
        },
        (err) => {
          console.error("Error mendapatkan lokasi GPS:", err);
          // Optional: tampilkan notifikasi ke user
        }
      );
    } else {
      console.warn("Geolocation tidak didukung oleh browser ini");
    }
  }, []);

  // Helper function untuk membersihkan data sebelum dikirim
  const cleanDataForSubmit = (data) => {
    const cleaned = { ...data };
    
    // Konversi string kosong menjadi null untuk field yang optional
    Object.keys(cleaned).forEach(key => {
      if (cleaned[key] === "") {
        cleaned[key] = null;
      }
    });
    
    // Pastikan boolean tetap boolean
    const booleanFields = ["tangkiRusak", "bushingTM", "bushingTR", "tapCharger", "minyakTrafo", "stopKran"];
    booleanFields.forEach(field => {
      if (typeof cleaned[field] !== 'boolean') {
        cleaned[field] = false;
      }
    });
    
    return cleaned;
  };

  // Validasi form sebelum submit
  const validateForm = () => {
    const requiredFields = {
      garduInduk: "Gardu Induk",
      penyulang: "Penyulang",
      nomorGTT: "Nomor GTT",
      alamat: "Alamat"
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field] || formData[field].trim() === "") {
        setError(`Field ${label} wajib diisi`);
        return false;
      }
    }

    return true;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validasi form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Anda belum login. Silakan login terlebih dahulu.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      // Bersihkan data sebelum dikirim
      const cleanedData = cleanDataForSubmit(formData);
      
      // Log untuk debugging (hapus di production)
      console.log("DATA YANG AKAN DIKIRIM:", cleanedData);

      const response = await axios.post(`${API_URL}/laporan`, cleanedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("RESPONSE DARI SERVER:", response.data);

      if (response.data.success) {
        alert("Laporan berhasil dikirim!");
        // Reset form atau redirect
        navigate("/pelaporan");
      } else {
        setError(response.data.message || "Gagal mengirim laporan");
      }
    } catch (err) {
      console.error("Error submit:", err);
      console.error("Error detail:", err.response?.data);
      
      if (err.response?.status === 401) {
        setError("Sesi berakhir, silakan login ulang.");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || "Data tidak valid. Periksa kembali isian Anda.");
      } else if (err.response?.status === 500) {
        setError("Terjadi kesalahan di server. Silakan coba lagi.");
      } else {
        setError(err.response?.data?.message || "Gagal mengirim laporan. Periksa koneksi internet Anda.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk reset form
  const handleReset = () => {
    if (window.confirm("Apakah Anda yakin ingin mengosongkan semua isian?")) {
      setFormData({
        garduInduk: "",
        penyulang: "",
        nomorGTT: "",
        alamat: "",
        merk: "",
        daya: "",
        nomorSerie: "",
        fasa: "",
        teganganPrimer: "",
        teganganSekunder: "",
        arusPrimer: "",
        arusSekunder: "",
        impedensi: "",
        tahun: "",
        tapTrafo: "",
        teganganTap: "",
        konstruksiTrafo: "",
        hubunganBelitan: "",
        trafoEk: "",
        namaBengkel: "",
        tanggalOperasi: "",
        platPemeriksaanMinyak: "",
        tanggalKerusakan: "",
        tangkiRusak: false,
        bushingTM: false,
        bushingTR: false,
        tapCharger: false,
        minyakTrafo: false,
        stopKran: false,
        titikNetral: "",
        lightningArrester: "",
        pengamanPrimerPhasaR: "",
        pengamanPrimerPhasaS: "",
        pengamanPrimerPhasaT: "",
        pengamanSkunderPhasaR: "",
        pengamanSkunderPhasaS: "",
        pengamanSkunderPhasaT: "",
        pengamanSkunderAPhasaR: "",
        pengamanSkunderAPhasaS: "",
        pengamanSkunderAPhasaT: "",
        pengamanSkunderBPhasaR: "",
        pengamanSkunderBPhasaS: "",
        pengamanSkunderBPhasaT: "",
        pengamanSkunderCPhasaR: "",
        pengamanSkunderCPhasaS: "",
        pengamanSkunderCPhasaT: "",
        pengamanSkunderDPhasaR: "",
        pengamanSkunderDPhasaS: "",
        pengamanSkunderDPhasaT: "",
        merkSaklarUtama: "",
        arusNominalSaklarUtama: "",
        jenisKabel: "",
        penampangIncoming: "",
        penampangOutgoing: "",
        keterangan: "",
        Latitude: formData.Latitude, // Pertahankan GPS
        Longitude: formData.Longitude, // Pertahankan GPS
        foto1: "",
        foto2: "",
        foto3: "",
      });
      setError("");
    }
  };

  return (
    <div className="flex w-screen h-screen bg-gray-100 text-gray-800">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:w-64 bg-gray-200 flex-col justify-between shadow-md">
        <Sidebar active="pelaporan" />
      </aside>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-gray-200 flex flex-col justify-between shadow-md">
            <Sidebar active="pelaporan" close={() => setSidebarOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-bold">
            Form Pelaporan Kerusakan Trafo
          </h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded hover:bg-gray-200 md:hidden"
            aria-label="Open Menu"
          >
            <HiOutlineBars3 className="text-2xl" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
            <span className="block sm:inline">{error}</span>
            <button
              onClick={() => setError("")}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <span className="text-xl">&times;</span>
            </button>
          </div>
        )}

        {/* ================= FORM ================== */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* DATA GARDU */}
          <Section title="DATA GARDU" color="bg-blue-50" open>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Gardu Induk *"
                name="garduInduk"
                value={formData.garduInduk}
                onChange={handleInputChange}
                required
                placeholder="Contoh: GI Kediri"
              />
              <InputField
                label="Penyulang *"
                name="penyulang"
                value={formData.penyulang}
                onChange={handleInputChange}
                required
                placeholder="Contoh: Penyulang Brawijaya"
              />
              <InputField
                label="Nomor GTT *"
                name="nomorGTT"
                value={formData.nomorGTT}
                onChange={handleInputChange}
                required
                placeholder="Contoh: GTT-001"
              />
              <InputField
                label="Alamat *"
                name="alamat"
                value={formData.alamat}
                onChange={handleInputChange}
                required
                placeholder="Alamat lengkap lokasi gardu"
              />
            </div>
          </Section>

          {/* I. DATA GARDU TRAFO TIANG */}
          <CollapsibleSection title="I. DATA GARDU TRAFO TIANG" color="bg-green-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <InputField label="Merk" name="merk" value={formData.merk} onChange={handleInputChange} placeholder="Merk trafo" />
                <InputField label="Daya (kVA)" name="daya" value={formData.daya} onChange={handleInputChange} placeholder="Contoh: 50" />
                <InputField label="Nomor Serie" name="nomorSerie" value={formData.nomorSerie} onChange={handleInputChange} placeholder="Nomor seri trafo" />
                <InputField label="Fasa" name="fasa" value={formData.fasa} onChange={handleInputChange} placeholder="Contoh: 3" />
                <InputField label="Tegangan Primer (kV)" name="teganganPrimer" value={formData.teganganPrimer} onChange={handleInputChange} placeholder="Contoh: 20" />
                <InputField label="Tegangan Sekunder (V)" name="teganganSekunder" value={formData.teganganSekunder} onChange={handleInputChange} placeholder="Contoh: 380" />
                <InputField label="Arus Primer (A)" name="arusPrimer" value={formData.arusPrimer} onChange={handleInputChange} placeholder="Arus primer" />
                <InputField label="Arus Sekunder (A)" name="arusSekunder" value={formData.arusSekunder} onChange={handleInputChange} placeholder="Arus sekunder" />
                <InputField label="Impedensi (%)" name="impedensi" value={formData.impedensi} onChange={handleInputChange} placeholder="Contoh: 4" />
                <InputField label="Tahun" name="tahun" type="number" value={formData.tahun} onChange={handleInputChange} placeholder="Tahun pembuatan" />
              </div>
              <div className="space-y-4">
                <InputField label="Tap Trafo" name="tapTrafo" value={formData.tapTrafo} onChange={handleInputChange} placeholder="Posisi tap" />
                <InputField label="Tegangan Tap (kV)" name="teganganTap" value={formData.teganganTap} onChange={handleInputChange} placeholder="Tegangan tap" />
                <InputField label="Konstruksi Trafo" name="konstruksiTrafo" value={formData.konstruksiTrafo} onChange={handleInputChange} placeholder="Jenis konstruksi" />
                <InputField label="Hubungan Belitan" name="hubunganBelitan" value={formData.hubunganBelitan} onChange={handleInputChange} placeholder="Contoh: Dyn5" />
                <InputField label="Trafo Ek." name="trafoEk" value={formData.trafoEk} onChange={handleInputChange} placeholder="Trafo eksisting" />
                <InputField label="Nama Bengkel" name="namaBengkel" value={formData.namaBengkel} onChange={handleInputChange} placeholder="Bengkel perbaikan" />
                <InputField label="Tanggal Operasi" name="tanggalOperasi" type="date" value={formData.tanggalOperasi} onChange={handleInputChange} />
                <InputField label="Plat Pemeriksaan Minyak" name="platPemeriksaanMinyak" value={formData.platPemeriksaanMinyak} onChange={handleInputChange} placeholder="Nomor plat" />
              </div>
            </div>
          </CollapsibleSection>

          {/* II. DATA KERUSAKAN */}
          <CollapsibleSection title="II. DATA KERUSAKAN" color="bg-red-50">
            <InputField 
              label="Tanggal Kerusakan" 
              name="tanggalKerusakan" 
              type="date" 
              value={formData.tanggalKerusakan} 
              onChange={handleInputChange} 
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
              {[
                { key: "tangkiRusak", label: "Tangki Rusak" },
                { key: "bushingTM", label: "Bushing TM" },
                { key: "bushingTR", label: "Bushing TR" },
                { key: "tapCharger", label: "Tap Charger" },
                { key: "minyakTrafo", label: "Minyak Trafo" },
                { key: "stopKran", label: "Stop Kran" }
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-2 p-2 bg-white rounded border hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name={item.key} 
                    checked={formData[item.key]} 
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{item.label}</span>
                </label>
              ))}
            </div>
          </CollapsibleSection>

          {/* III. PENGUKURAN PENAHANAN */}
          <CollapsibleSection title="III. PENGUKURAN PENAHANAN" color="bg-yellow-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField 
                label="Titik Netral (Ohm)" 
                name="titikNetral" 
                value={formData.titikNetral} 
                onChange={handleInputChange} 
                placeholder="Nilai tahanan"
              />
              <InputField 
                label="Lightning Arrester (Ohm)" 
                name="lightningArrester" 
                value={formData.lightningArrester} 
                onChange={handleInputChange} 
                placeholder="Nilai tahanan"
              />
            </div>
          </CollapsibleSection>

          {/* IV. DATA PEMBATAS TRAFO */}
          <CollapsibleSection title="IV. DATA PEMBATAS TRAFO" color="bg-purple-50">
            <div className="space-y-4">

              {/* Pengaman Primer */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold mb-3 text-blue-700">Pengaman Primer</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <InputField label="Fasa R (A)" name="pengamanPrimerPhasaR" value={formData.pengamanPrimerPhasaR} onChange={handleInputChange} placeholder="Ampere" />
                  <InputField label="Fasa S (A)" name="pengamanPrimerPhasaS" value={formData.pengamanPrimerPhasaS} onChange={handleInputChange} placeholder="Ampere" />
                  <InputField label="Fasa T (A)" name="pengamanPrimerPhasaT" value={formData.pengamanPrimerPhasaT} onChange={handleInputChange} placeholder="Ampere" />
                </div>
              </div>

              {/* Pembatas Sekunder Pertama */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold mb-3 text-blue-700">Pembatas Sekunder Pertama</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <InputField label="Fasa R (A)" name="pengamanSkunderPhasaR" value={formData.pengamanSkunderPhasaR} onChange={handleInputChange} placeholder="Ampere" />
                  <InputField label="Fasa S (A)" name="pengamanSkunderPhasaS" value={formData.pengamanSkunderPhasaS} onChange={handleInputChange} placeholder="Ampere" />
                  <InputField label="Fasa T (A)" name="pengamanSkunderPhasaT" value={formData.pengamanSkunderPhasaT} onChange={handleInputChange} placeholder="Ampere" />
                </div>
              </div>

              {/* Sekunder Jurusan A */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold mb-3 text-blue-700">Pembatas Sekunder Jurusan A</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <InputField label="Fasa R (A)" name="pengamanSkunderAPhasaR" value={formData.pengamanSkunderAPhasaR} onChange={handleInputChange} placeholder="Ampere" />
                  <InputField label="Fasa S (A)" name="pengamanSkunderAPhasaS" value={formData.pengamanSkunderAPhasaS} onChange={handleInputChange} placeholder="Ampere" />
                  <InputField label="Fasa T (A)" name="pengamanSkunderAPhasaT" value={formData.pengamanSkunderAPhasaT} onChange={handleInputChange} placeholder="Ampere" />
                </div>
              </div>

              {/* Sekunder Jurusan B */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold mb-3 text-blue-700">Pembatas Sekunder Jurusan B</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <InputField label="Fasa R (A)" name="pengamanSkunderBPhasaR" value={formData.pengamanSkunderBPhasaR} onChange={handleInputChange} placeholder="Ampere" />
                  <InputField label="Fasa S (A)" name="pengamanSkunderBPhasaS" value={formData.pengamanSkunderBPhasaS} onChange={handleInputChange} placeholder="Ampere" />
                  <InputField label="Fasa T (A)" name="pengamanSkunderBPhasaT" value={formData.pengamanSkunderBPhasaT} onChange={handleInputChange} placeholder="Ampere" />
                </div>
              </div>

              {/* Sekunder Jurusan C */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold mb-3 text-blue-700">Pembatas Sekunder Jurusan C</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <InputField label="Fasa R (A)" name="pengamanSkunderCPhasaR" value={formData.pengamanSkunderCPhasaR} onChange={handleInputChange} placeholder="Ampere" />
                  <InputField label="Fasa S (A)" name="pengamanSkunderCPhasaS" value={formData.pengamanSkunderCPhasaS} onChange={handleInputChange} placeholder="Ampere" />
                  <InputField label="Fasa T (A)" name="pengamanSkunderCPhasaT" value={formData.pengamanSkunderCPhasaT} onChange={handleInputChange} placeholder="Ampere" />
                </div>
              </div>

              {/* Sekunder Jurusan D */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold mb-3 text-blue-700">Pembatas Sekunder Jurusan D</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <InputField label="Fasa R (A)" name="pengamanSkunderDPhasaR" value={formData.pengamanSkunderDPhasaR} onChange={handleInputChange} placeholder="Ampere" />
                  <InputField label="Fasa S (A)" name="pengamanSkunderDPhasaS" value={formData.pengamanSkunderDPhasaS} onChange={handleInputChange} placeholder="Ampere" />
                  <InputField label="Fasa T (A)" name="pengamanSkunderDPhasaT" value={formData.pengamanSkunderDPhasaT} onChange={handleInputChange} placeholder="Ampere" />
                </div>
              </div>

            </div>

            {/* Field tambahan Pembatas Trafo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t">
              <InputField label="Merk Saklar Utama" name="merkSaklarUtama" value={formData.merkSaklarUtama} onChange={handleInputChange} placeholder="Merk saklar" />
              <InputField label="Arus Nominal Saklar Utama (A)" name="arusNominalSaklarUtama" value={formData.arusNominalSaklarUtama} onChange={handleInputChange} placeholder="Ampere nominal" />
              <InputField label="Jenis Kabel" name="jenisKabel" value={formData.jenisKabel} onChange={handleInputChange} placeholder="Contoh: XLPE" />
              <InputField label="Penampang Incoming (mm²)" name="penampangIncoming" value={formData.penampangIncoming} onChange={handleInputChange} placeholder="Luas penampang" />
              <InputField label="Penampang Outgoing (mm²)" name="penampangOutgoing" value={formData.penampangOutgoing} onChange={handleInputChange} placeholder="Luas penampang" />
            </div>
          </CollapsibleSection>

          {/* V. KETERANGAN KERUSAKAN */}
          <CollapsibleSection title="V. KETERANGAN KERUSAKAN" color="bg-orange-50">
            <textarea
              name="keterangan"
              value={formData.keterangan}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tuliskan keterangan lengkap mengenai kerusakan yang terjadi, kondisi fisik trafo, dan informasi tambahan lainnya..."
            />
          </CollapsibleSection>

          {/* LAMPIRAN FOTO */}
          <Section title="LAMPIRAN FOTO" color="bg-gray-50" open>
            <PhotoUpload 
              formData={formData} 
              setFormData={setFormData}
            />
          </Section>

          {/* LOKASI GPS */}
          <Section title="LOKASI GPS" color="bg-teal-50" open>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField 
                label="Latitude" 
                name="Latitude" 
                value={formData.Latitude} 
                readOnly 
                placeholder="Otomatis terdeteksi"
              />
              <InputField 
                label="Longitude" 
                name="Longitude" 
                value={formData.Longitude} 
                readOnly 
                placeholder="Otomatis terdeteksi"
              />
            </div>
            {(!formData.Latitude || !formData.Longitude) && (
              <p className="text-sm text-gray-500 mt-2">
                * Lokasi GPS akan terdeteksi otomatis. Pastikan Anda mengizinkan akses lokasi pada browser.
              </p>
            )}
          </Section>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Reset Form
            </button>
            <button
              type="button"
              onClick={() => navigate("/pelaporan")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading 
                  ? "bg-blue-300 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white px-8 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengirim...
                </>
              ) : (
                "Submit Laporan"
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}