import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { HiOutlineBars3, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2";
import Swal from "sweetalert2";

import Sidebar from "../components/Sidebar";
import CollapsibleSection from "../components/CollapsibleSection";
import InputField from "../components/InputField";

// Helper input dengan satuan
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
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
      />
      {unit && <span className="ml-2 text-gray-600 font-semibold">{unit}</span>}
    </div>
  </div>
);

export default function FormPemeriksaan() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const navigate = useNavigate();
  const { id } = useParams(); // ambil ID dari URL
  const isEditMode = Boolean(id);

  // --- Ambil data lama kalau mode edit ---
  useEffect(() => {
    if (isEditMode) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`http://localhost:5000/api/pemeriksaan/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = response.data;

          // isi form dengan data yang diambil
          setFormData({
            noBa: data.no_ba || "",
            plnArea: data.pln_area || "",
            namaPekerjaan: data.nama_pekerjaan || "",
            namaPelanggan: data.nama_pelanggan || "",
            alamatLokasi: data.alamat_lokasi || "",
            rayon: data.rayon || "",
            spkTanggal: data.tanggal ? data.tanggal.split("T")[0] : "",
            spkSutm: data.spk_sutm || "",
            spkSutr: data.spk_sutr || "",
            spkGtt: data.spk_gtt || "",
            pemeriksaanSutm: data.sutm_as3c || "",
            pemeriksaanSutr: data.sutr_bund_conductor || "",
            pemeriksaanTrafo: data.trafo_3ph || "",
            petugasPLN: [
              data.petugas1 || "",
              data.petugas2 || "",
              data.petugas3 || "",
              data.petugas4 || "",
              data.petugas5 || "",
            ].filter((v) => v !== ""),
            pelaksana: data.pelaksana || "",
          });
        } catch (error) {
          console.error("Gagal ambil data pemeriksaan:", error);
          Swal.fire("Error", "Gagal mengambil data pemeriksaan!", "error");
        }
      };

      fetchData();
    }
  }, [id, isEditMode]);

  // --- Handler Input ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePetugasChange = (index, event) => {
    const newPetugas = [...formData.petugasPLN];
    newPetugas[index] = event.target.value;
    setFormData({ ...formData, petugasPLN: newPetugas });
  };

  const addPetugas = () => {
    if (formData.petugasPLN.length < 5)
      setFormData({ ...formData, petugasPLN: [...formData.petugasPLN, ""] });
  };

  const removePetugas = (index) => {
    if (formData.petugasPLN.length > 1) {
      const newPetugas = [...formData.petugasPLN];
      newPetugas.splice(index, 1);
      setFormData({ ...formData, petugasPLN: newPetugas });
    }
  };

  // --- Submit (Tambah / Edit) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return Swal.fire("Error", "Token tidak ditemukan. Silakan login.", "error");

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

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/pemeriksaan/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Berhasil", "Data berhasil diperbarui ✅", "success");
      } else {
        await axios.post(`http://localhost:5000/api/pemeriksaan`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Berhasil", "Data berhasil ditambahkan ✅", "success");
      }

      navigate("/pemeriksaan-jaringan");
    } catch (error) {
      console.error("Error submit:", error.response || error.message);
      Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan data", "error");
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
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            {isEditMode ? "Edit Berita Acara Pemeriksaan" : "Tambah Berita Acara Pemeriksaan"}
          </h1>
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded hover:bg-gray-200 md:hidden">
            <HiOutlineBars3 className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informasi Umum */}
          <CollapsibleSection title="Informasi Umum" open>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField label="No. BA" name="noBa" value={formData.noBa} onChange={handleInputChange} />
              <InputField label="PLN Area" name="plnArea" value={formData.plnArea} onChange={handleInputChange} />
              <InputField label="Rayon" name="rayon" value={formData.rayon} onChange={handleInputChange} />
              <InputField label="Nama Pekerjaan" name="namaPekerjaan" value={formData.namaPekerjaan} onChange={handleInputChange} />
              <InputField label="Nama Pelanggan" name="namaPelanggan" value={formData.namaPelanggan} onChange={handleInputChange} />
              <InputField label="Alamat / Lokasi" name="alamatLokasi" value={formData.alamatLokasi} onChange={handleInputChange} />
            </div>
          </CollapsibleSection>

          {/* Detail Pelaksanaan */}
          <CollapsibleSection title="Detail Pelaksanaan" open>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField type="date" label="Tanggal Pelaksanaan" name="spkTanggal" value={formData.spkTanggal} onChange={handleInputChange} />
              <InputField label="SPK / PK No. (SUTM)" name="spkSutm" value={formData.spkSutm} onChange={handleInputChange} />
              <InputField label="SPK / PK No. (SUTR)" name="spkSutr" value={formData.spkSutr} onChange={handleInputChange} />
              <InputField label="SPK / PK No. (GTT)" name="spkGtt" value={formData.spkGtt} onChange={handleInputChange} />
            </div>
          </CollapsibleSection>

          {/* Hasil Pemeriksaan */}
          <CollapsibleSection title="Hasil Pemeriksaan" open>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputWithUnit label="SUTM A3C" name="pemeriksaanSutm" value={formData.pemeriksaanSutm} onChange={handleInputChange} unit="Kms" />
              <InputWithUnit label="SUTR Bund. Konduktor" name="pemeriksaanSutr" value={formData.pemeriksaanSutr} onChange={handleInputChange} unit="Kms" />
              <InputWithUnit label="Trafo Distribusi 20 KV 3 Ph" name="pemeriksaanTrafo" value={formData.pemeriksaanTrafo} onChange={handleInputChange} unit="kVA / Bh" />
            </div>
          </CollapsibleSection>

          {/* Petugas */}
          <CollapsibleSection title="Penanggung Jawab" open>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Petugas PLN</label>
                {formData.petugasPLN.map((petugas, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <InputField placeholder={`Petugas ${i + 1}`} value={petugas} onChange={(e) => handlePetugasChange(i, e)} />
                    {formData.petugasPLN.length > 1 && (
                      <button type="button" onClick={() => removePetugas(i)} className="p-2 text-red-500 hover:bg-red-100 rounded-full">
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
              <InputField label="Pelaksana" name="pelaksana" value={formData.pelaksana} onChange={handleInputChange} />
            </div>
          </CollapsibleSection>

          {/* Tombol Submit */}
          <div className="flex justify-end mt-6">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg shadow-md transition duration-300">
              {isEditMode ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
