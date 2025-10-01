import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // PASTIKAN PATH INI BENAR
import {
  HiOutlineBars3,
  HiOutlinePlusCircle,
  HiOutlineTrash
} from "react-icons/hi2";

export default function PilihanPerbaikan() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jenisPerbaikan, setJenisPerbaikan] = useState("");
  const [kapasitas, setKapasitas] = useState("");
  const [trafoList, setTrafoList] = useState([""]);
  const navigate = useNavigate();

  // --- Logic Functions ---

  const handleJenisPerbaikanChange = (e) => {
    const newValue = e.target.value;
    setJenisPerbaikan(newValue);

    // PERBAIKAN: Reset state lain saat pilihan berubah
    if (newValue !== "gantiTrafoMobile") {
      setKapasitas("");
    }
    if (newValue !== "kopelTrafoSebelah") {
      setTrafoList([""]);
    }
  };

  const addTrafo = () => {
    if (trafoList.length < 5) {
      setTrafoList([...trafoList, ""]);
    }
  };

  const updateTrafo = (index, value) => {
    const newList = [...trafoList];
    newList[index] = value;
    setTrafoList(newList);
  };

  const removeTrafo = (index) => {
    const newList = [...trafoList];
    newList.splice(index, 1);
    setTrafoList(newList.length > 0 ? newList : [""]);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah refresh halaman
    let dataToSubmit = {
      jenisPerbaikan,
    };

    if (jenisPerbaikan === "gantiTrafoMobile") {
      dataToSubmit.kapasitas = kapasitas;
    } else if (jenisPerbaikan === "kopelTrafoSebelah") {
      dataToSubmit.trafoList = trafoList.filter(t => t.trim() !== ""); // Hanya kirim yang terisi
    }
    
    console.log("Data yang akan disimpan:", dataToSubmit);
    alert("Data perbaikan tersimpan! Cek console untuk detail.");
    // navigate('/halaman-selanjutnya');
  };

  // --- Render Component ---

  return (
    <div className="flex w-screen h-screen bg-gray-100 text-gray-800">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:w-64 bg-[#F4F7FE] flex-col justify-between shadow-md">
        <Sidebar active="pelaporan" />
      </aside>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-[#F4F7FE] shadow-md flex flex-col justify-between">
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
        {/* PERBAIKAN: Header yang disatukan */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-bold">Pilihan Perbaikan Trafo</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded hover:bg-gray-200 md:hidden"
          >
            <HiOutlineBars3 className="text-2xl" />
          </button>
        </div>

        {/* PERBAIKAN: Menggunakan tag <form> */}
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
          <fieldset>
            <legend className="block text-lg font-semibold mb-4">Pilih Jenis Perbaikan</legend>
            
            {/* Opsi 1: Ganti Trafo */}
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="gantiTrafo"
                name="perbaikan"
                value="gantiTrafo"
                checked={jenisPerbaikan === "gantiTrafo"}
                onChange={handleJenisPerbaikanChange}
                className="w-5 h-5 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="gantiTrafo">Ganti Trafo</label>
            </div>

            {/* Opsi 2: Ganti Trafo Mobile */}
            <div className="mt-4">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="gantiTrafoMobile"
                  name="perbaikan"
                  value="gantiTrafoMobile"
                  checked={jenisPerbaikan === "gantiTrafoMobile"}
                  onChange={handleJenisPerbaikanChange}
                  className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="gantiTrafoMobile">Ganti Trafo Mobile</label>
              </div>
              {jenisPerbaikan === "gantiTrafoMobile" && (
                <div className="mt-3 ml-8">
                  <input
                    type="text"
                    placeholder="Masukkan Kapasitas (kVA)"
                    value={kapasitas}
                    onChange={(e) => setKapasitas(e.target.value)}
                    className="border p-2 rounded-md w-full md:w-1/2 shadow-sm"
                    required
                  />
                </div>
              )}
            </div>

            {/* Opsi 3: Kopel Trafo Sebelah */}
            <div className="mt-4">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="kopelTrafoSebelah"
                  name="perbaikan"
                  value="kopelTrafoSebelah"
                  checked={jenisPerbaikan === "kopelTrafoSebelah"}
                  onChange={handleJenisPerbaikanChange}
                  className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="kopelTrafoSebelah">Kopel Trafo Sebelah</label>
              </div>
              {jenisPerbaikan === "kopelTrafoSebelah" && (
                <div className="space-y-3 mt-3 ml-8">
                  {trafoList.map((trafo, index) => (
                    <div key={index} className="flex items-center gap-2 w-full md:w-1/2">
                      <input
                        type="text"
                        placeholder={`Nama Trafo Kopelan ${index + 1}`}
                        value={trafo}
                        onChange={(e) => updateTrafo(index, e.target.value)}
                        className="flex-1 border p-2 rounded-md shadow-sm"
                        required
                      />
                      {trafoList.length > 1 && (
                         <button
                           type="button"
                           onClick={() => removeTrafo(index)}
                           className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                           title="Hapus Trafo"
                         >
                           <HiOutlineTrash className="text-xl" />
                         </button>
                      )}
                    </div>
                  ))}
                  {trafoList.length < 5 && (
                    <button
                      type="button"
                      onClick={addTrafo}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 border"
                    >
                      <HiOutlinePlusCircle className="text-xl" />
                      Tambah Trafo
                    </button>
                  )}
                </div>
              )}
            </div>
          </fieldset>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow disabled:bg-gray-400"
              disabled={!jenisPerbaikan} // Tombol disable jika belum ada pilihan
              onClick={() => navigate("/pelaporan")}
            >
              Simpan Perbaikan
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}