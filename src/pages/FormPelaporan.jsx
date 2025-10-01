import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineBars3 } from "react-icons/hi2";

// Mengimpor semua komponen yang dibutuhkan dari file terpisah
import Sidebar from "../components/Sidebar";
import Section from "../components/Section";
import InputField from "../components/InputField";
import CollapsibleSection from "../components/CollapsibleSection";
import SubPembatas from "../components/SubPembatas";
import PhotoUpload from "../components/PhotoUpload";

export default function FormPelaporan() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // State terpusat untuk menampung SEMUA data form
  const [formData, setFormData] = useState({
    // Data Gardu
    garduInduk: "",
    penyulang: "",
    nomorGtt: "",
    alamat: "",
    // I. Data Gardu Trafo Tiang
    merk: "",
    daya: "",
    nomorSerie: "",
    phasa: "",
    teganganPrimer: "",
    teganganSekunder: "",
    arusPrimer: "",
    arusSekunder: "",
    impedansi: "",
    tahun: "",
    tapTrafo: "",
    teganganTap: "",
    konstruksiTrafo: "",
    hubunganBelitan: "",
    trafoEx: "",
    namaBengkel: "",
    tanggalOperasi: "",
    tanggalPemeriksaanMinyak: "",
    // II. Data Kerusakan
    tanggalKerusakan: "",
    tangkiRusak: "",
    tapCharger: "",
    bushingTM: "",
    minyakTrafo: "",
    bushingTR: "",
    stopKran: "",
    pengukuranPrimer: "",
    pengukuranSekunder: "",
    // III. Pengukuran Penahanan
    titikNetral: "",
    lightningArrester: "",
    // IV. Data Pembatas Trafo
    pembatasPrimerR: "",
    pembatasPrimerS: "",
    pembatasPrimerT: "",
    pembatasSekunderPertamaR: "",
    pembatasSekunderPertamaS: "",
    pembatasSekunderPertamaT: "",
    pembatasJurusanAR: "",
    pembatasJurusanAS: "",
    pembatasJurusanAT: "",
    pembatasJurusanBR: "",
    pembatasJurusanBS: "",
    pembatasJurusanBT: "",
    pembatasJurusanCR: "",
    pembatasJurusanCS: "",
    pembatasJurusanCT: "",
    pembatasJurusanDR: "",
    pembatasJurusanDS: "",
    pembatasJurusanDT: "",
    merkSaklarUtama: "",
    arusNominalSaklar: "",
    // V. Keterangan Kerusakan
    keteranganKerusakan: "",
  });

  // Fungsi generik untuk menangani semua perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  // Efek untuk mendapatkan geolokasi
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prevData => ({
            ...prevData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          setFormData(prevData => ({ ...prevData, latitude: "Gagal mendapatkan lokasi", longitude: "Gagal mendapatkan lokasi" }));
        }
      );
    }
  }, []);

  // FUNGSI HANDLE SUBMIT YANG DIIMPLEMENTASIKAN
  const handleSubmit = () => {
    console.log("Data Form yang Dikirim:", formData);

    // Ambil data lama dari localStorage
    const existingData = JSON.parse(localStorage.getItem("laporanData")) || [];

    // Buat data baru untuk tabel
    const newEntry = {
      no: existingData.length + 1,
      tanggal: formData.tanggalKerusakan || new Date().toLocaleDateString("id-ID"),
      gardu: formData.garduInduk,
      penyulang: formData.penyulang,
      alamat: formData.alamat,
      status: formData.keteranganKerusakan || "Rusak",
      color: "bg-red-400", // default warna status
    };

    // Simpan ke localStorage
    localStorage.setItem("laporanData", JSON.stringify([...existingData, newEntry]));

    // Arahkan ke halaman pelaporan
    navigate("/pelaporan");
  };

  return (
    <div className="flex w-screen h-screen bg-gray-100 text-gray-800">
      <aside className="hidden md:flex md:w-64 bg-gray-200 flex-col justify-between shadow-md">
        <Sidebar active="pelaporan" />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-gray-200 flex flex-col justify-between shadow-md">
            <Sidebar active="pelaporan" close={() => setSidebarOpen(false)} />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}

      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-bold">Form Pelaporan Kerusakan Trafo</h1>
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded hover:bg-gray-200 md:hidden">
            <HiOutlineBars3 className="text-2xl" />
          </button>
        </div>

        {/* ========================== FORM =========================== */}
        <Section title="DATA GARDU" color="bg-gray-200" open>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Gardu Induk" name="garduInduk" value={formData.garduInduk} onChange={handleInputChange} />
            <InputField label="Penyulang" name="penyulang" value={formData.penyulang} onChange={handleInputChange} />
            <InputField label="Nomor GTT" name="nomorGtt" value={formData.nomorGtt} onChange={handleInputChange} />
            <InputField label="Alamat" name="alamat" value={formData.alamat} onChange={handleInputChange} />
          </div>
        </Section>

        <CollapsibleSection title="I. DATA GARDU TRAFO TIANG" color="bg-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-4">
              <InputField label="Merk" name="merk" value={formData.merk} onChange={handleInputChange} />
              <InputField label="Daya" name="daya" value={formData.daya} onChange={handleInputChange} />
              <InputField label="Nomor Serie" name="nomorSerie" value={formData.nomorSerie} onChange={handleInputChange} />
              <InputField label="Phasa" name="phasa" value={formData.phasa} onChange={handleInputChange} />
              <InputField label="Tegangan Primer" name="teganganPrimer" value={formData.teganganPrimer} onChange={handleInputChange} />
              <InputField label="Tegangan Sekunder" name="teganganSekunder" value={formData.teganganSekunder} onChange={handleInputChange} />
              <InputField label="Arus Primer" name="arusPrimer" value={formData.arusPrimer} onChange={handleInputChange} />
              <InputField label="Arus Sekunder" name="arusSekunder" value={formData.arusSekunder} onChange={handleInputChange} />
              <InputField label="Impedansi" name="impedansi" value={formData.impedansi} onChange={handleInputChange} />
              <InputField label="Tahun" name="tahun" value={formData.tahun} onChange={handleInputChange} />
            </div>
            <div className="grid gap-4">
              <InputField label="Tap Trafo" name="tapTrafo" value={formData.tapTrafo} onChange={handleInputChange} />
              <InputField label="Tegangan Tap" name="teganganTap" value={formData.teganganTap} onChange={handleInputChange} />
              <InputField label="Konstruksi Trafo" name="konstruksiTrafo" value={formData.konstruksiTrafo} onChange={handleInputChange} />
              <InputField label="Hubungan Belitan / Vektor" name="hubunganBelitan" value={formData.hubunganBelitan} onChange={handleInputChange} />
              <InputField label="Trafo Ex." name="trafoEx" value={formData.trafoEx} onChange={handleInputChange} />
              <InputField label="Nama Bengkel Rekondisi/Preman" name="namaBengkel" value={formData.namaBengkel} onChange={handleInputChange} />
              <InputField label="Tanggal Operasi" name="tanggalOperasi" type="date" value={formData.tanggalOperasi} onChange={handleInputChange} />
              <InputField label="Tgl. Pemeriksaan Minyak Trf." name="tanggalPemeriksaanMinyak" type="date" value={formData.tanggalPemeriksaanMinyak} onChange={handleInputChange} />
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="II. DATA KERUSAKAN" color="bg-gray-200">
          <InputField label="Tanggal Kerusakan" name="tanggalKerusakan" type="date" value={formData.tanggalKerusakan} onChange={handleInputChange} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Tangki Rusak" name="tangkiRusak" value={formData.tangkiRusak} onChange={handleInputChange} />
            <InputField label="Tap Charger" name="tapCharger" value={formData.tapCharger} onChange={handleInputChange} />
            <InputField label="Bushing TM" name="bushingTM" value={formData.bushingTM} onChange={handleInputChange} />
            <InputField label="Minyak Trafo" name="minyakTrafo" value={formData.minyakTrafo} onChange={handleInputChange} />
            <InputField label="Bushing TR" name="bushingTR" value={formData.bushingTR} onChange={handleInputChange} />
            <InputField label="Stop Kran (In/Out)" name="stopKran" value={formData.stopKran} onChange={handleInputChange} />
          </div>
          <p className="font-semibold mt-4">Pengukuran Tahanan Isolasi Trafo (Megger 500 / 1000 V)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <Section title="Kumparan Primer (1000 V)" color="bg-blue-100">
              <InputField label="Hasil Pengukuran" name="pengukuranPrimer" value={formData.pengukuranPrimer} onChange={handleInputChange} />
            </Section>
            <Section title="Kumparan Sekunder (500 V)" color="bg-blue-100">
              <InputField label="Hasil Pengukuran" name="pengukuranSekunder" value={formData.pengukuranSekunder} onChange={handleInputChange} />
            </Section>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="III. PENGUKURAN PENAHANAN" color="bg-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Titik Netral" name="titikNetral" value={formData.titikNetral} onChange={handleInputChange} />
            <InputField label="Lightning Arrester" name="lightningArrester" value={formData.lightningArrester} onChange={handleInputChange} />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="IV. DATA PEMBATAS TRAFO" color="bg-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SubPembatas title="PENGAMAN PRIMER" namePrefix="pembatasPrimer" values={formData} onChange={handleInputChange} />
            <SubPembatas title="PEMBATAS SEKUNDER PERTAMA" namePrefix="pembatasSekunderPertama" values={formData} onChange={handleInputChange} />
            <SubPembatas title="PEMBATAS SEKUNDER JURUSAN A" namePrefix="pembatasJurusanA" values={formData} onChange={handleInputChange} />
            <SubPembatas title="PEMBATAS SEKUNDER JURUSAN B" namePrefix="pembatasJurusanB" values={formData} onChange={handleInputChange} />
            <SubPembatas title="PEMBATAS SEKUNDER JURUSAN C" namePrefix="pembatasJurusanC" values={formData} onChange={handleInputChange} />
            <SubPembatas title="PEMBATAS SEKUNDER JURUSAN D" namePrefix="pembatasJurusanD" values={formData} onChange={handleInputChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <InputField label="Merk Saklar Utama / HB" name="merkSaklarUtama" value={formData.merkSaklarUtama} onChange={handleInputChange} />
            <InputField label="Arus Nominal Saklar Utama" name="arusNominalSaklar" value={formData.arusNominalSaklar} onChange={handleInputChange} />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="V. KETERANGAN KERUSAKAN TRAFO" color="bg-gray-200">
          <textarea
            name="keteranganKerusakan"
            value={formData.keteranganKerusakan}
            onChange={handleInputChange}
            className="w-full border border-gray-300 text-[#263238] rounded-lg px-4 py-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
            placeholder="Tuliskan keterangan kerusakan..."
          />
        </CollapsibleSection>

        <Section title="Lampiran Foto / Dokumen" color="bg-gray-200" open>
          <PhotoUpload />
        </Section>

        <div className="flex justify-end mt-6">
          <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow">
            Submit
          </button>
        </div>
      </main>
    </div>
  );
}