import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HiOutlineBars3, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2";
import Swal from "sweetalert2";

import Sidebar from "../components/Sidebar";
import Section from "../components/Section";
import CollapsibleSection from "../components/CollapsibleSection";
import InputField from "../components/InputField";

// Helper component untuk input dengan unit
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
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
      />
      {unit && <span className="ml-2 text-gray-600 font-semibold">{unit}</span>}
    </div>
  </div>
);

export default function FormBeritaAcara() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    noBa: "",
    plnArea: "",
    namaPekerjaan: "",
    namaPelanggan: "",
    alamatLokasi: "",
    rayon: "",
    spkTanggal: "",
    spkSutm: "",
    spkSutr: "",
    spkGtt: "",
    pemeriksaanSutm: "",
    pemeriksaanSutr: "",
    pemeriksaanTrafo: "",
    petugasPLN: ["", ""],
    pelaksana: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePetugasChange = (index, event) => {
    const newPetugas = [...formData.petugasPLN];
    newPetugas[index] = event.target.value;
    setFormData({ ...formData, petugasPLN: newPetugas });
  };

  const addPetugas = () => {
    if (formData.petugasPLN.length < 5) {
      setFormData({ ...formData, petugasPLN: [...formData.petugasPLN, ""] });
    }
  };

  const removePetugas = (index) => {
    if (formData.petugasPLN.length > 1) {
      const newPetugas = [...formData.petugasPLN];
      newPetugas.splice(index, 1);
      setFormData({ ...formData, petugasPLN: newPetugas });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Ambil token dari localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token tidak ditemukan, silakan login terlebih dahulu.");
        return;
      }

      // Mapping formData ke field database
      const payload = {
        no_ba: formData.noBa,
        pln_area: formData.plnArea,
        nama_pekerjaan: formData.namaPekerjaan,
        nama_pelanggan: formData.namaPelanggan,
        alamat_lokasi: formData.alamatLokasi,
        rayon: formData.rayon,
        tanggal: formData.spkTanggal,
        spk_sutm: formData.spkSutm,
        spk_sutr: formData.spkSutr,
        spk_gtt: formData.spkGtt,
        sutm_as3c: formData.pemeriksaanSutm,
        sutr_bund_conductor: formData.pemeriksaanSutr,
        trafo_3ph: formData.pemeriksaanTrafo,
        petugas1: formData.petugasPLN[0] || null,
        petugas2: formData.petugasPLN[1] || null,
        petugas3: formData.petugasPLN[2] || null,
        petugas4: formData.petugasPLN[3] || null,
        petugas5: formData.petugasPLN[4] || null,
        pelaksana: formData.pelaksana,
      };

      console.log("Payload yang dikirim ke backend:", payload);

      const response = await axios.post(
        "http://localhost:5000/api/pemeriksaan",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response backend:", response.data);
        Swal.fire({
            title: "Berhasil!",
            text: "Data Terkirim ✅ ",
            icon: "success",
            confirmButtonText: "Lanjut",
            })
      navigate("/pemeriksaan-jaringan");

    } catch (error) {
      console.error("Error submit:", error.response || error.message);
      alert("Gagal menyimpan data. Cek console untuk detail error.");
    }
  };

  return (
    <div className="flex w-screen h-screen bg-gray-100 text-gray-800">
      <aside className="hidden md:flex md:w-64 bg-white flex-col justify-between shadow-lg">
        <Sidebar active="pemeriksaan" />
      </aside>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-white flex-col justify-between shadow-lg">
            <Sidebar active="pemeriksaan" close={() => setSidebarOpen(false)} />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Berita Acara Pemeriksaan Jaringan</h1>
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded hover:bg-gray-200 md:hidden">
            <HiOutlineBars3 className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* --- Bagian Informasi Umum --- */}
          <CollapsibleSection title="Informasi Umum" color="bg-white" open>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField label="No. BA" name="noBa" value={formData.noBa} onChange={handleInputChange} />
              <InputField label="PLN Area" name="plnArea" value={formData.plnArea} onChange={handleInputChange} />
              <InputField label="Rayon" name="rayon" value={formData.rayon} onChange={handleInputChange} />
              <InputField label="Nama Pekerjaan" name="namaPekerjaan" value={formData.namaPekerjaan} onChange={handleInputChange} className="md:col-span-2 lg:col-span-3" />
              <InputField label="Nama Pelanggan" name="namaPelanggan" value={formData.namaPelanggan} onChange={handleInputChange} />
              <InputField label="Alamat / Lokasi" name="alamatLokasi" value={formData.alamatLokasi} onChange={handleInputChange} className="md:col-span-2" />
            </div>
          </CollapsibleSection>

          {/* --- Detail Pelaksanaan --- */}
          <CollapsibleSection title="Detail Pelaksanaan" color="bg-white" open>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField label="Tanggal Pelaksanaan" name="spkTanggal" value={formData.spkTanggal} onChange={handleInputChange} type="date" />
              <InputField label="SPK / PK No. (SUTM)" name="spkSutm" value={formData.spkSutm} onChange={handleInputChange} />
              <InputField label="SPK / PK No. (SUTR)" name="spkSutr" value={formData.spkSutr} onChange={handleInputChange} />
              <InputField label="SPK / PK No. (GTT)" name="spkGtt" value={formData.spkGtt} onChange={handleInputChange} />
            </div>
          </CollapsibleSection>

          {/* --- Hasil Pemeriksaan --- */}
          <CollapsibleSection title="Hasil Pemeriksaan" color="bg-white" open>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputWithUnit label="SUTM A3C" name="pemeriksaanSutm" value={formData.pemeriksaanSutm} onChange={handleInputChange} unit="Kms" />
              <InputWithUnit label="SUTR Bund. Konduktor" name="pemeriksaanSutr" value={formData.pemeriksaanSutr} onChange={handleInputChange} unit="Kms" />
              <InputWithUnit label="Trafo Distribusi 20 KV 3 Ph" name="pemeriksaanTrafo" value={formData.pemeriksaanTrafo} onChange={handleInputChange} unit="kVA / Bh" />
            </div>
          </CollapsibleSection>

          {/* --- Petugas & Pelaksana --- */}
          <CollapsibleSection title="Penanggung Jawab" color="bg-white" open>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Petugas PLN</label>
                {formData.petugasPLN.map((petugas, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <InputField placeholder={`Petugas ${index + 1}`} value={petugas} onChange={(e) => handlePetugasChange(index, e)} />
                    {formData.petugasPLN.length > 1 && (
                      <button type="button" onClick={() => removePetugas(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full" aria-label="Hapus Petugas">
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                {formData.petugasPLN.length < 5 && (
                  <button type="button" onClick={addPetugas} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-semibold mt-2">
                    <HiOutlinePlus className="w-4 h-4" /> Tambah Petugas
                  </button>
                )}
              </div>
              <div>
                <InputField label="Pelaksana" name="pelaksana" value={formData.pelaksana} onChange={handleInputChange} />
              </div>
            </div>
          </CollapsibleSection>

          {/* --- Submit Button --- */}
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
