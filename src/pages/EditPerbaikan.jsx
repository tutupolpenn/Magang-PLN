// EditPerbaikan.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { HiOutlineBars3, HiOutlinePlusCircle, HiOutlineTrash } from "react-icons/hi2";
import axios from "axios";
import Swal from "sweetalert2";

// ======================================================
// Helper decode JWT untuk ambil user_id
// ======================================================
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

export default function EditPerbaikan() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { perbaikanId } = useParams();
  const navigate = useNavigate();

  // ======================================================
  // State form
  // ======================================================
  const [jenisPerbaikan, setJenisPerbaikan] = useState("");
  const [gantiTrafoData, setGantiTrafoData] = useState({
    merk: "",
    kapasitas: "",
    tahun: "",
    noSeri: "",
    fotoNamePlate: null,
  });
  const [kapasitasMobile, setKapasitasMobile] = useState("");
  const [trafoList, setTrafoList] = useState([""]);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [existingFotoUrl, setExistingFotoUrl] = useState(null); // Track existing photo URL

  // ======================================================
  // Ambil data perbaikan berdasarkan ID
  // ======================================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const response = await axios.get(
          `http://localhost:5000/api/perbaikan/detail/${perbaikanId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = response.data;

        if (!data) {
          Swal.fire({
            icon: "error",
            title: "Data tidak ditemukan",
            text: "Perbaikan dengan ID ini tidak tersedia.",
          });
          return navigate("/perbaikan");
        }

        // Set state sesuai data
        setJenisPerbaikan(data.jenis_perbaikan || "");
        setGantiTrafoData({
          merk: data.merk || "",
          kapasitas: data.kapasitas || "",
          tahun: data.tahun || "",
          noSeri: data.noSeri || "",
          fotoNamePlate: null,
        });
        setKapasitasMobile(data.kapasitas || "");
        setTrafoList(Array.isArray(data.daftar_trafo) ? data.daftar_trafo : [""]);
        
        // Set existing photo
        if (data.fotoNamePlateUrl) {
          setExistingFotoUrl(data.fotoNamePlateUrl);
          setFotoPreview(data.fotoNamePlateUrl);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        Swal.fire({
          icon: "error",
          title: "Gagal mengambil data",
          text: "Cek koneksi atau ID perbaikan.",
        });
        navigate("/perbaikan");
      }
    };

    fetchData();
  }, [navigate, perbaikanId]);

  // ======================================================
  // Event handlers
  // ======================================================
  const handleJenisPerbaikanChange = (e) => {
    const value = e.target.value;
    setJenisPerbaikan(value);

    if (value !== "gantiTrafo") {
      setGantiTrafoData({ merk: "", kapasitas: "", tahun: "", noSeri: "", fotoNamePlate: null });
      setFotoPreview(null);
      setExistingFotoUrl(null);
    }
    if (value !== "gantiTrafoMobile") setKapasitasMobile("");
    if (value !== "kopelTrafoSebelah") setTrafoList([""]);
  };

  const handleGantiTrafoChange = (e) => {
    const { name, value } = e.target;
    setGantiTrafoData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setGantiTrafoData((prev) => ({ ...prev, fotoNamePlate: file }));
    
    // Create preview for new file
    if (file) {
      setFotoPreview(URL.createObjectURL(file));
      setExistingFotoUrl(null); // Clear existing URL when new file is selected
    }
  };

  const addTrafo = () => {
    if (trafoList.length < 5) setTrafoList([...trafoList, ""]);
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

  // ======================================================
  // Submit Update - FIXED
  // ======================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const decoded = parseJwt(token);
    const userId = decoded?.id;

    if (!userId) {
      Swal.fire({ icon: "error", title: "User tidak valid!", text: "Silakan login ulang." });
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("jenis_perbaikan", jenisPerbaikan);

    if (jenisPerbaikan === "gantiTrafo") {
      formData.append("merk", gantiTrafoData.merk);
      formData.append("noSeri", gantiTrafoData.noSeri);
      formData.append("tahun", gantiTrafoData.tahun);
      formData.append("kapasitas", gantiTrafoData.kapasitas);
      
      // ✅ FIXED: Kirim file baru jika ada, atau kirim existing URL
      if (gantiTrafoData.fotoNamePlate) {
        // User upload foto baru
        formData.append("fotoNamePlate", gantiTrafoData.fotoNamePlate);
      } else if (existingFotoUrl) {
        // Tidak ada foto baru, kirim URL lama agar backend tahu foto tidak berubah
        formData.append("existingFotoUrl", existingFotoUrl);
      }
    } else if (jenisPerbaikan === "gantiTrafoMobile") {
      formData.append("kapasitas", kapasitasMobile);
    } else if (jenisPerbaikan === "kopelTrafoSebelah") {
      formData.append("daftar_trafo", JSON.stringify(trafoList.filter((t) => t.trim() !== "")));
    }

    // 🔍 DEBUG: Log data yang dikirim
    console.log("=== DATA UPDATE YANG DIKIRIM ===");
    console.log("Perbaikan ID:", perbaikanId);
    console.log("User ID:", userId);
    console.log("Jenis Perbaikan:", jenisPerbaikan);
    
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(key, "=> File:", value.name, value.type, value.size, "bytes");
      } else {
        console.log(key, "=>", value);
      }
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/perbaikan/update/${perbaikanId}`, 
        formData, 
        {
          headers: { 
            Authorization: `Bearer ${token}`, 
            "Content-Type": "multipart/form-data" 
          },
        }
      );

      console.log("✅ Response berhasil:", response.data);

      await Swal.fire({ 
        icon: "success", 
        title: "Berhasil!", 
        text: "Perbaikan berhasil diupdate.",
        confirmButtonColor: "#3085d6",
      });
      
      navigate("/perbaikan");
    } catch (err) {
      console.error("❌ Error update:", err);
      console.error("❌ Error response:", err.response?.data);
      console.error("❌ Error status:", err.response?.status);
      
      Swal.fire({ 
        icon: "error", 
        title: "Gagal update", 
        text: err.response?.data?.message || err.response?.data?.error || "Terjadi kesalahan.",
        confirmButtonColor: "#d33",
      });
    }
  };

  // ======================================================
  // Render
  // ======================================================
  return (
    <div className="flex w-screen h-screen bg-gray-100 text-gray-800">
      <aside className="hidden md:flex md:w-64 bg-[#F4F7FE] flex-col justify-between shadow-md">
        <Sidebar active="perbaikan" />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-[#F4F7FE] shadow-md flex flex-col justify-between">
            <Sidebar active="perbaikan" close={() => setSidebarOpen(false)} />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}

      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-bold">Edit Perbaikan #{perbaikanId}</h1>
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded hover:bg-gray-200 md:hidden">
            <HiOutlineBars3 className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
          <fieldset>
            <legend className="block text-lg font-semibold mb-4">Pilih Jenis Perbaikan</legend>

            {/* ===================== OPTION 1: GANTI TRAFO ======================== */}
            <div className="flex items-center space-x-3">
              <input 
                type="radio" 
                id="gantiTrafo" 
                name="perbaikan" 
                value="gantiTrafo" 
                checked={jenisPerbaikan === "gantiTrafo"} 
                onChange={handleJenisPerbaikanChange} 
                className="w-5 h-5 text-blue-500" 
              />
              <label htmlFor="gantiTrafo" className="cursor-pointer">Ganti Trafo</label>
            </div>

            {jenisPerbaikan === "gantiTrafo" && (
              <div className="mt-3 ml-8 space-y-3 md:w-1/2">
                <input 
                  type="text" 
                  name="merk" 
                  placeholder="Merk Trafo" 
                  value={gantiTrafoData.merk} 
                  onChange={handleGantiTrafoChange} 
                  className="border p-2 rounded-md w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
                <input 
                  type="text" 
                  name="noSeri" 
                  placeholder="Nomor Seri" 
                  value={gantiTrafoData.noSeri} 
                  onChange={handleGantiTrafoChange} 
                  className="border p-2 rounded-md w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
                <input 
                  type="text" 
                  name="kapasitas" 
                  placeholder="Kapasitas (kVA)" 
                  value={gantiTrafoData.kapasitas} 
                  onChange={handleGantiTrafoChange} 
                  className="border p-2 rounded-md w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
                <input 
                  type="text" 
                  name="tahun" 
                  placeholder="Tahun Buat" 
                  value={gantiTrafoData.tahun} 
                  onChange={handleGantiTrafoChange} 
                  className="border p-2 rounded-md w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foto Name Plate {existingFotoUrl && !gantiTrafoData.fotoNamePlate && "(Foto tersimpan)"}
                  </label>
                  <input 
                    type="file" 
                    name="fotoNamePlate" 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="border p-2 rounded-md w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                  {gantiTrafoData.fotoNamePlate && (
                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                      ✓ File baru: {gantiTrafoData.fotoNamePlate.name}
                    </p>
                  )}
                  {fotoPreview && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <img 
                        src={fotoPreview} 
                        alt="Preview" 
                        className="w-48 h-32 object-cover rounded-md border shadow-sm" 
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ====================== OPTION 2: GANTI TRAFO MOBILE ======================= */}
            <div className="mt-4">
              <div className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  id="gantiTrafoMobile" 
                  name="perbaikan" 
                  value="gantiTrafoMobile" 
                  checked={jenisPerbaikan === "gantiTrafoMobile"} 
                  onChange={handleJenisPerbaikanChange} 
                  className="w-5 h-5 text-blue-500" 
                />
                <label htmlFor="gantiTrafoMobile" className="cursor-pointer">Ganti Trafo Mobile</label>
              </div>
              {jenisPerbaikan === "gantiTrafoMobile" && (
                <input 
                  type="text" 
                  placeholder="Kapasitas (kVA)" 
                  value={kapasitasMobile} 
                  onChange={(e) => setKapasitasMobile(e.target.value)} 
                  className="border p-2 rounded-md md:w-1/2 shadow-sm mt-3 ml-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
              )}
            </div>

            {/* ====================== OPTION 3: KOPEL TRAFO SEBELAH ======================= */}
            <div className="mt-4">
              <div className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  id="kopelTrafoSebelah" 
                  name="perbaikan" 
                  value="kopelTrafoSebelah" 
                  checked={jenisPerbaikan === "kopelTrafoSebelah"} 
                  onChange={handleJenisPerbaikanChange} 
                  className="w-5 h-5 text-blue-500" 
                />
                <label htmlFor="kopelTrafoSebelah" className="cursor-pointer">Kopel Trafo Sebelah</label>
              </div>
              {jenisPerbaikan === "kopelTrafoSebelah" && (
                <div className="space-y-3 mt-3 ml-8">
                  {trafoList.map((trafo, index) => (
                    <div key={index} className="flex items-center gap-2 w-full md:w-1/2">
                      <input 
                        type="text" 
                        placeholder={`Trafo ${index + 1}`} 
                        value={trafo} 
                        onChange={(e) => updateTrafo(index, e.target.value)} 
                        className="flex-1 border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        required 
                      />
                      {trafoList.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeTrafo(index)} 
                          className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                          title="Hapus trafo"
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
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 border transition-colors"
                    >
                      <HiOutlinePlusCircle className="text-xl" /> Tambah Trafo
                    </button>
                  )}
                </div>
              )}
            </div>
          </fieldset>

          <div className="flex justify-end pt-4 border-t">
            <button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed" 
              disabled={!jenisPerbaikan}
            >
              Update Perbaikan
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}