import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineBars3 } from "react-icons/hi2";

// Komponen-komponen yang mungkin Anda gunakan (pastikan path-nya benar)
import Sidebar from "../components/Sidebar";
import Section from "../components/Section";
import InputField from "../components/InputField";
import PhotoUpload from "../components/PhotoUpload";

// Helper component untuk input dengan satuan (Ohm, kVA, dll.)
const InputWithUnit = ({ label, name, value, onChange, unit, placeholder }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="flex items-center">
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
      />
      <span className="ml-2 text-gray-600 font-semibold">{unit}</span>
    </div>
  </div>
);


export default function FormPengoperasian() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // State untuk form (disesuaikan agar valid dan tanpa duplikat)
  const [formData, setFormData] = useState({
    // Data Umum
    plnUp3: "",
    namaPekerjaan: "",
    namaPelanggan: "",
    lokasiAlamat: "",
    ulp: "",
    garduInduk: "",
    tanggalTest: "",
    tanggalOperasi: "",
    pelaksana: "",
    spkSutm: "",
    spkSutr: "",
    spkGtt: "",
    penyulang: "",
    noGtt: "",

    // Jaringan SUTR - Jurusan 1
    sutrJenisConductor1: "", sutrUkuran1: "", sutrPanjang1: "", sutrJenisLine1: "",
    sutrRN1: "", sutrSN1: "", sutrTN1: "", sutrRS1: "", sutrRT1: "", sutrST1: "", sutrNBody1: "",
    // Jaringan SUTR - Jurusan 2
    sutrJenisConductor2: "", sutrUkuran2: "", sutrPanjang2: "", sutrJenisLine2: "",
    sutrRN2: "", sutrSN2: "", sutrTN2: "", sutrRS2: "", sutrRT2: "", sutrST2: "", sutrNBody2: "",
    // Jaringan SUTR - Jurusan 3
    sutrJenisConductor3: "", sutrUkuran3: "", sutrPanjang3: "", sutrJenisLine3: "",
    sutrRN3: "", sutrSN3: "", sutrTN3: "", sutrRS3: "", sutrRT3: "", sutrST3: "", sutrNBody3: "",

    // Jaringan SUTM
    sutmJenisConductor: "", sutmUkuran: "", sutmPanjang: "",
    sutmRG: "", sutmSG: "", sutmTG: "", sutmRS: "", sutmRT: "", sutmST: "",

    // Transformator
    putaranPhasa: "",
    pabrikMerk: "", dayaNominal: "", noSeri: "", hubungan: "", tegHubSingkat: "",
    tegPrimer: "", tegSekunder: "", arusPrimer: "", arusNom: "", frekuensi: "",
    tahunPembuatan: "", pendinginMinyak: "", beratMinyak: "", beratTotal: "", posSadapan: "",

    // Tahanan Isolasi Transformator
    tahananPrimerBody: "", tahananSekunderBody: "", tahananPrimerPrimer: "", tahananSekunderSekunder: "",
    
    // Tegangan Rendah
    teganganRN: "", teganganSN: "", teganganTN: "", teganganRS: "", teganganRT: "", teganganST: "",
    
    // Tahanan Isolasi Arrester & Pentanahan
    tahananArresterRG: "", tahananArresterSG: "", tahananArresterTG: "",
    pentanahanNetral: "", pentanahanArusBocorNetral: "", pentanahanArrester: "", pentanahanArusBocorArrester: "", pentanahanBody: "",

    catatan: "",
    petugasPLN: "",
    pelaksanaPetugas: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    navigate(""); // Kembali ke dashboard setelah submit
  };
  
  return (
    <div className="flex w-screen h-screen bg-gray-100 text-gray-800">
      {/* Sidebar untuk Desktop */}
      <aside className="hidden md:flex md:w-64 bg-white flex-col justify-between shadow-lg">
        <Sidebar active="pemeriksaan" />
      </aside>

      {/* Sidebar untuk Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-white flex flex-col justify-between shadow-lg">
            <Sidebar active="pemeriksaan" close={() => setSidebarOpen(false)} />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}

      {/* Konten Utama */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Pengoperasian Jaringan</h1>
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded hover:bg-gray-200 md:hidden">
            <HiOutlineBars3 className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* == Bagian Data Umum == */}
          <Section title="" color="bg-white" open>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <InputField label="PLN UP3" name="plnUp3" value={formData.plnUp3} onChange={handleInputChange} />
              <InputField label="Tanggal Test" name="tanggalTest" type="date" value={formData.tanggalTest} onChange={handleInputChange} />
              <InputField label="Nama Pekerjaan" name="namaPekerjaan" value={formData.namaPekerjaan} onChange={handleInputChange} />
              <InputField label="Tanggal Operasi" name="tanggalOperasi" type="date" value={formData.tanggalOperasi} onChange={handleInputChange} />
              <InputField label="Nama Pelanggan" name="namaPelanggan" value={formData.namaPelanggan} onChange={handleInputChange} />
              <InputField label="Pelaksana" name="pelaksana" value={formData.pelaksana} onChange={handleInputChange} />
              <InputField label="Lokasi / Alamat" name="lokasiAlamat" value={formData.lokasiAlamat} onChange={handleInputChange} />
              <InputField label="SPK / PK No. (SUTM)" name="spkSutm" value={formData.spkSutm} onChange={handleInputChange} />
              <InputField label="ULP" name="ulp" value={formData.ulp} onChange={handleInputChange} />
              <InputField label="SPK / PK No. (SUTR)" name="spkSutr" value={formData.spkSutr} onChange={handleInputChange} />
              <InputField label="Gardu Induk" name="garduInduk" value={formData.garduInduk} onChange={handleInputChange} />
              <InputField label="SPK / PK No. (GTT)" name="spkGtt" value={formData.spkGtt} onChange={handleInputChange} />
              <div/> {/* Spacer */}
              <InputField label="Penyulang" name="penyulang" value={formData.penyulang} onChange={handleInputChange} />
               <div/> {/* Spacer */}
              <InputField label="No. GTT" name="noGtt" value={formData.noGtt} onChange={handleInputChange} />
            </div>
          </Section>

          {/* == Jaringan SUTR == */}
          <Section title="Jaringan SUTR Test Tahanan Isolasi SUTR" color="bg-white" open>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                {/* Kolom 1 */}
                <div className="space-y-3 p-3 border rounded-lg">
                    <p className="font-semibold text-center">Jurusan 1</p>
                    <InputField label="Jenis Conductor" name="sutrJenisConductor1" value={formData.sutrJenisConductor1} onChange={handleInputChange} />
                    <InputWithUnit label="Ukuran" name="sutrUkuran1" value={formData.sutrUkuran1} onChange={handleInputChange} unit="mm2" />
                    <InputWithUnit label="Panjang" name="sutrPanjang1" value={formData.sutrPanjang1} onChange={handleInputChange} unit="kms" />
                    <div className="pt-2 border-t mt-3">
                        <InputWithUnit label="R - N" name="sutrRN1" value={formData.sutrRN1} onChange={handleInputChange} unit="M Ohm"/>
                        <InputWithUnit label="S - N" name="sutrSN1" value={formData.sutrSN1} onChange={handleInputChange} unit="M Ohm"/>
                        <InputWithUnit label="T - N" name="sutrTN1" value={formData.sutrTN1} onChange={handleInputChange} unit="M Ohm"/>
                        <InputWithUnit label="R - S" name="sutrRS1" value={formData.sutrRS1} onChange={handleInputChange} unit="M Ohm"/>
                        <InputWithUnit label="R - T" name="sutrRT1" value={formData.sutrRT1} onChange={handleInputChange} unit="M Ohm"/>
                        <InputWithUnit label="S - T" name="sutrST1" value={formData.sutrST1} onChange={handleInputChange} unit="M Ohm"/>
                        <InputWithUnit label="N - BODY" name="sutrNBody1" value={formData.sutrNBody1} onChange={handleInputChange} unit="M Ohm"/>
                    </div>
                </div>
                {/* Kolom 2 */}
                <div className="space-y-3 p-3 border rounded-lg">
                    <p className="font-semibold text-center">Jurusan 2</p>
                    <InputField label="Jenis Conductor" name="sutrJenisConductor2" value={formData.sutrJenisConductor2} onChange={handleInputChange} />
                    <InputWithUnit label="Ukuran" name="sutrUkuran2" value={formData.sutrUkuran2} onChange={handleInputChange} unit="mm2" />
                    <InputWithUnit label="Panjang" name="sutrPanjang2" value={formData.sutrPanjang2} onChange={handleInputChange} unit="kms" />
                    <div className="pt-2 border-t mt-3">
                        <InputWithUnit label="R - N" name="sutrRN2" value={formData.sutrRN2} onChange={handleInputChange} unit="M Ohm"/>
                        <InputWithUnit label="S - N" name="sutrSN2" value={formData.sutrSN2} onChange={handleInputChange} unit="M Ohm"/>
                        <InputWithUnit label="T - N" name="sutrTN2" value={formData.sutrTN2} onChange={handleInputChange} unit="M Ohm"/>
                        <InputWithUnit label="R - S" name="sutrRS2" value={formData.sutrRS2} onChange={handleInputChange} unit="M Ohm"/>
                        <InputWithUnit label="R - T" name="sutrRT2" value={formData.sutrRT2} onChange={handleInputChange} unit="M Ohm"/>
                        <InputWithUnit label="S - T" name="sutrST2" value={formData.sutrST2} onChange={handleInputChange} unit="M Ohm"/>
                        <InputWithUnit label="N - BODY" name="sutrNBody2" value={formData.sutrNBody2} onChange={handleInputChange} unit="M Ohm"/>
                    </div>
                </div>
                {/* Kolom 3 */}
                <div className="space-y-3 p-3 border rounded-lg">
                    <p className="font-semibold text-center">Jurusan 3</p>
                    <InputField label="Jenis Conductor" name="sutrJenisConductor3" value={formData.sutrJenisConductor3} onChange={handleInputChange} />
                    <InputWithUnit label="Ukuran" name="sutrUkuran3" value={formData.sutrUkuran3} onChange={handleInputChange} unit="mm2" />
                    <InputWithUnit label="Panjang" name="sutrPanjang3" value={formData.sutrPanjang3} onChange={handleInputChange} unit="kms" />
                    <div className="pt-2 border-t mt-3">
                        <InputWithUnit label="R - N" name="sutrRN3" value={formData.sutrRN3} onChange={handleInputChange} unit="M Ohm"/>
                        <InputWithUnit label="S - N" name="sutrSN3" value={formData.sutrSN3} onChange={handleInputChange} unit="M Ohm"/>
                        <InputWithUnit label="T - N" name="sutrTN3" value={formData.sutrTN3} onChange={handleInputChange} unit="M Ohm"/>
                        <InputWithUnit label="R - S" name="sutrRS3" value={formData.sutrRS3} onChange={handleInputChange} unit="M Ohm"/>
                        <InputWithUnit label="R - T" name="sutrRT3" value={formData.sutrRT3} onChange={handleInputChange} unit="M Ohm"/>
                        <InputWithUnit label="S - T" name="sutrST3" value={formData.sutrST3} onChange={handleInputChange} unit="M Ohm"/>
                        <InputWithUnit label="N - BODY" name="sutrNBody3" value={formData.sutrNBody3} onChange={handleInputChange} unit="M Ohm"/>
                    </div>
                </div>
                {/* Kolom 4 */}
                <div className="space-y-3 p-3 border rounded-lg">
                    <p className="font-semibold text-center">Line</p>
                    <InputField label="Jenis Conductor Line" name="sutrJenisLine1" value={formData.sutrJenisLine1} onChange={handleInputChange} />
                    <InputWithUnit label="Ukuran" name="sutrUkuran1" value={formData.sutrUkuran1} onChange={handleInputChange} unit="mm2" />
                    <InputWithUnit label="Panjang" name="sutrPanjang1" value={formData.sutrPanjang1} onChange={handleInputChange} unit="kms" />
                    <div className="pt-2 border-t mt-3">
                        <InputWithUnit label="R - N" name="sutrRN1" value={formData.sutrRN1} onChange={handleInputChange} unit="M Ohm"/>
                        <InputWithUnit label="S - N" name="sutrSN1" value={formData.sutrSN1} onChange={handleInputChange} unit="M Ohm"/>
                        <InputWithUnit label="T - N" name="sutrTN1" value={formData.sutrTN1} onChange={handleInputChange} unit="M Ohm"/>
                        
                    </div>
                </div>
            </div>
          </Section>

          {/* == Jaringan SUTM == */}
          <Section title="" color="bg-white" open>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">Jaringan SUTM</h3>
                  <div className="space-y-4">
                    <InputField label="Jenis Conductor" name="sutmJenisConductor" value={formData.sutmJenisConductor} onChange={handleInputChange} />
                    <InputWithUnit label="Ukuran" name="sutmUkuran" value={formData.sutmUkuran} onChange={handleInputChange} unit="mm2" />
                    <InputWithUnit label="Panjang" name="sutmPanjang" value={formData.sutmPanjang} onChange={handleInputChange} unit="kms" />
                  </div>
                </div>
                 <div>
                  <h3 className="font-semibold mb-4">Test Tahanan Isolasi SUTM</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <InputWithUnit label="R - G" name="sutmRG" value={formData.sutmRG} onChange={handleInputChange} unit="M Ohm"/>
                      <InputWithUnit label="R - S" name="sutmRS" value={formData.sutmRS} onChange={handleInputChange} unit="M Ohm"/>
                      <InputWithUnit label="S - G" name="sutmSG" value={formData.sutmSG} onChange={handleInputChange} unit="M Ohm"/>
                      <InputWithUnit label="R - T" name="sutmRT" value={formData.sutmRT} onChange={handleInputChange} unit="M Ohm"/>
                      <InputWithUnit label="T - G" name="sutmTG" value={formData.sutmTG} onChange={handleInputChange} unit="M Ohm"/>
                      <InputWithUnit label="S - T" name="sutmST" value={formData.sutmST} onChange={handleInputChange} unit="M Ohm"/>
                   </div>
                </div>
             </div>
          </Section>

          {/* == Transformator == */}
          <Section title="Transformator Distribusi 20 KV" color="bg-white" open>
            <div className="mb-4">
                <InputField label="Putaran Phasa" name="putaranPhasa" value={formData.putaranPhasa} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                <InputField label="Pabrik Merk" name="pabrikMerk" value={formData.pabrikMerk} onChange={handleInputChange} />
                <InputWithUnit label="Teg. Primer" name="tegPrimer" value={formData.tegPrimer} onChange={handleInputChange} unit="KV" />
                <InputField label="Tahun Pembuatan" name="tahunPembuatan" value={formData.tahunPembuatan} onChange={handleInputChange} />
                
                <InputWithUnit label="Daya Nominal Trafo" name="dayaNominal" value={formData.dayaNominal} onChange={handleInputChange} unit="kVA" />
                <InputWithUnit label="Teg. Sekunder" name="tegSekunder" value={formData.tegSekunder} onChange={handleInputChange} unit="V" />
                <InputField label="Pendingin Minyak" name="pendinginMinyak" value={formData.pendinginMinyak} onChange={handleInputChange} />

                <InputField label="No Seri" name="noSeri" value={formData.noSeri} onChange={handleInputChange} />
                <InputWithUnit label="Arus Primer" name="arusPrimer" value={formData.arusPrimer} onChange={handleInputChange} unit="A" />
                <InputWithUnit label="Berat Minyak" name="beratMinyak" value={formData.beratMinyak} onChange={handleInputChange} unit="kg" />
                
                <InputField label="Hubungan" name="hubungan" value={formData.hubungan} onChange={handleInputChange} />
                <InputWithUnit label="Arus Nom." name="arusNom" value={formData.arusNom} onChange={handleInputChange} unit="A" />
                <InputWithUnit label="Berat Total" name="beratTotal" value={formData.beratTotal} onChange={handleInputChange} unit="kg" />
                
                <InputWithUnit label="Teg. Hub. Singkat" name="tegHubSingkat" value={formData.tegHubSingkat} onChange={handleInputChange} unit="%" />
                <InputWithUnit label="Frekuensi" name="frekuensi" value={formData.frekuensi} onChange={handleInputChange} unit="Hz" />
                <InputWithUnit label="Pos Sadapan / Tap" name="posSadapan" value={formData.posSadapan} onChange={handleInputChange} unit="KV" />
            </div>
          </Section>

           {/* == Tahanan Isolasi & Tegangan Rendah == */}
          <Section title="" color="bg-white" open>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">Tahanan Isolasi Transformator</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputWithUnit label="Primer - Body" name="tahananPrimerBody" value={formData.tahananPrimerBody} onChange={handleInputChange} unit="M Ohm"/>
                    <InputWithUnit label="Sekunder - Body" name="tahananSekunderBody" value={formData.tahananSekunderBody} onChange={handleInputChange} unit="M Ohm"/>
                    <InputWithUnit label="Primer - Primer" name="tahananPrimerPrimer" value={formData.tahananPrimerPrimer} onChange={handleInputChange} unit="M Ohm"/>
                    <InputWithUnit label="Sekunder - Sekunder" name="tahananSekunderSekunder" value={formData.tahananSekunderSekunder} onChange={handleInputChange} unit="M Ohm"/>
                  </div>
                </div>
                 <div>
                  <h3 className="font-semibold mb-4">Tegangan Rendah</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <InputWithUnit label="R - N" name="teganganRN" value={formData.teganganRN} onChange={handleInputChange} unit="V"/>
                      <InputWithUnit label="R - S" name="teganganRS" value={formData.teganganRS} onChange={handleInputChange} unit="V"/>
                      <InputWithUnit label="S - N" name="teganganSN" value={formData.teganganSN} onChange={handleInputChange} unit="V"/>
                      <InputWithUnit label="R - T" name="teganganRT" value={formData.teganganRT} onChange={handleInputChange} unit="V"/>
                      <InputWithUnit label="T - N" name="teganganTN" value={formData.teganganTN} onChange={handleInputChange} unit="V"/>
                      <InputWithUnit label="S - T" name="teganganST" value={formData.teganganST} onChange={handleInputChange} unit="V"/>
                   </div>
                </div>
             </div>
          </Section>

          {/* == Tahanan Isolasi Arrester & Pentanahan == */}
          <Section title="" color="bg-white" open>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">Tahanan Isolasi Arrester</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <InputWithUnit label="R - G" name="tahananArresterRG" value={formData.tahananArresterRG} onChange={handleInputChange} unit="M Ohm"/>
                    <InputWithUnit label="S - G" name="tahananArresterSG" value={formData.tahananArresterSG} onChange={handleInputChange} unit="M Ohm"/>
                    <InputWithUnit label="T - G" name="tahananArresterTG" value={formData.tahananArresterTG} onChange={handleInputChange} unit="M Ohm"/>
                  </div>
                </div>
                 <div>
                  <h3 className="font-semibold mb-4">Pentanahan</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <InputWithUnit label="Netral" name="pentanahanNetral" value={formData.pentanahanNetral} onChange={handleInputChange} unit="Ohm"/>
                      <InputWithUnit label="Arus Bocor" name="pentanahanArusBocorNetral" value={formData.pentanahanArusBocorNetral} onChange={handleInputChange} unit="mA"/>
                      <InputWithUnit label="Arrester" name="pentanahanArrester" value={formData.pentanahanArrester} onChange={handleInputChange} unit="Ohm"/>
                      <InputWithUnit label="Arus Bocor" name="pentanahanArusBocorArrester" value={formData.pentanahanArusBocorArrester} onChange={handleInputChange} unit="mA"/>
                      <InputWithUnit label="Body" name="pentanahanBody" value={formData.pentanahanBody} onChange={handleInputChange} unit="Ohm"/>
                   </div>
                </div>
             </div>
          </Section>

          {/* == Catatan, Petugas, Lampiran == */}
          <Section title="" color="bg-white" open>
              <div>
                  <label htmlFor="catatan" className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                  <textarea 
                    id="catatan"
                    name="catatan" 
                    rows="4" 
                    value={formData.catatan} 
                    onChange={handleInputChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                  ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                <InputField label="Petugas PLN" name="petugasPLN" value={formData.petugasPLN} onChange={handleInputChange} />
                <InputField label="Pelaksana" name="pelaksanaPetugas" value={formData.pelaksanaPetugas} onChange={handleInputChange} />
              </div>
              <div className="mt-6">
                <h3 className="font-semibold mb-4">Lampiran Foto</h3>
                <PhotoUpload />
              </div>
          </Section>

          {/* == Tombol Submit == */}
          <div className="flex justify-end mt-6">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg shadow-md transition duration-300">
              Submit
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}