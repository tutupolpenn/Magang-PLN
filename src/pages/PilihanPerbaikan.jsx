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
    console.error("Error parsing JWT:", e);
    return null;
  }
}

export default function PilihanPerbaikan() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams(); // ID Laporan dari URL
  const [jenisPerbaikan, setJenisPerbaikan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // ======================================================
  // Validasi laporan_id saat component mount
  // ======================================================
  useEffect(() => {
    if (!id || isNaN(id)) {
      Swal.fire({
        icon: "error",
        title: "ID Laporan Tidak Valid",
        text: "Silakan kembali ke halaman perbaikan.",
      }).then(() => navigate("/perbaikan"));
    }
  }, [id, navigate]);

  // ======================================================
  // State form
  // ======================================================
  const [gantiTrafoData, setGantiTrafoData] = useState({
    merk: "",
    kapasitas: "",
    tahun: "",
    noSeri: "",
    fotoNamePlate: null,
  });

  const [kapasitasMobile, setKapasitasMobile] = useState("");
  const [trafoList, setTrafoList] = useState([""]);

  // ======================================================
  // Event Handlers
  // ======================================================
  const handleJenisPerbaikanChange = (e) => {
    const value = e.target.value;
    setJenisPerbaikan(value);

    // Reset data form lain
    if (value !== "gantiTrafo") {
      setGantiTrafoData({ 
        merk: "", 
        kapasitas: "", 
        tahun: "", 
        noSeri: "", 
        fotoNamePlate: null 
      });
    }

    if (value !== "gantiTrafoMobile") {
      setKapasitasMobile("");
    }
    
    if (value !== "kopelTrafoSebelah") {
      setTrafoList([""]);
    }
  };

  const handleGantiTrafoChange = (e) => {
    const { name, value } = e.target;
    setGantiTrafoData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    // Validasi file
    if (file) {
      // Cek tipe file
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        Swal.fire({
          icon: "warning",
          title: "Format File Tidak Valid",
          text: "Hanya file gambar (JPG, PNG, GIF) yang diperbolehkan.",
        });
        e.target.value = "";
        return;
      }

      // Cek ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "warning",
          title: "File Terlalu Besar",
          text: "Ukuran file maksimal 5MB.",
        });
        e.target.value = "";
        return;
      }

      setGantiTrafoData((prev) => ({ ...prev, fotoNamePlate: file }));
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

  // ======================================================
  // VALIDASI DATA SEBELUM SUBMIT
  // ======================================================
  const validateData = () => {
    if (!jenisPerbaikan) {
      Swal.fire({
        icon: "warning",
        title: "Pilih Jenis Perbaikan",
        text: "Silakan pilih jenis perbaikan terlebih dahulu.",
      });
      return false;
    }

    if (jenisPerbaikan === "gantiTrafo") {
      if (!gantiTrafoData.merk || !gantiTrafoData.noSeri || 
          !gantiTrafoData.kapasitas || !gantiTrafoData.tahun) {
        Swal.fire({
          icon: "warning",
          title: "Data Tidak Lengkap",
          text: "Mohon lengkapi semua data trafo.",
        });
        return false;
      }

      // Validasi tahun (4 digit, antara 1900-2100)
      const tahun = parseInt(gantiTrafoData.tahun);
      if (isNaN(tahun) || tahun < 1900 || tahun > 2100) {
        Swal.fire({
          icon: "warning",
          title: "Tahun Tidak Valid",
          text: "Mohon masukkan tahun yang valid (1900-2100).",
        });
        return false;
      }

      // Validasi kapasitas (harus angka)
      if (isNaN(parseFloat(gantiTrafoData.kapasitas))) {
        Swal.fire({
          icon: "warning",
          title: "Kapasitas Tidak Valid",
          text: "Mohon masukkan kapasitas dalam angka.",
        });
        return false;
      }
    }

    if (jenisPerbaikan === "gantiTrafoMobile") {
      if (!kapasitasMobile) {
        Swal.fire({
          icon: "warning",
          title: "Kapasitas Kosong",
          text: "Mohon isi kapasitas trafo mobile.",
        });
        return false;
      }

      if (isNaN(parseFloat(kapasitasMobile))) {
        Swal.fire({
          icon: "warning",
          title: "Kapasitas Tidak Valid",
          text: "Mohon masukkan kapasitas dalam angka.",
        });
        return false;
      }
    }

    if (jenisPerbaikan === "kopelTrafoSebelah") {
      const validTrafoList = trafoList.filter((t) => t.trim() !== "");
      if (validTrafoList.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Daftar Trafo Kosong",
          text: "Mohon isi minimal 1 trafo.",
        });
        return false;
      }
    }

    return true;
  };

  // ======================================================
  // HANDLE SUBMIT - IMPROVED VERSION
  // ======================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi data
    if (!validateData()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Token Tidak Ditemukan",
          text: "Silakan login ulang.",
        });
        navigate("/login");
        return;
      }

      // Ambil user_id dari token JWT
      const decoded = parseJwt(token);
      const userId = decoded?.id;

      if (!userId) {
        Swal.fire({
          icon: "error",
          title: "User Tidak Valid",
          text: "Token tidak valid. Silakan login ulang.",
        });
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("laporan_id", id);
      formData.append("user_id", userId);
      formData.append("jenis_perbaikan", jenisPerbaikan);

      // Tambahkan data sesuai jenis perbaikan
      if (jenisPerbaikan === "gantiTrafo") {
        formData.append("merk", gantiTrafoData.merk.trim());
        formData.append("noSeri", gantiTrafoData.noSeri.trim());
        formData.append("tahun", gantiTrafoData.tahun.trim());
        formData.append("kapasitas", gantiTrafoData.kapasitas.trim());
        
        if (gantiTrafoData.fotoNamePlate) {
          formData.append("fotoNamePlate", gantiTrafoData.fotoNamePlate);
        }
      } else if (jenisPerbaikan === "gantiTrafoMobile") {
        formData.append("kapasitas", kapasitasMobile.trim());
      } else if (jenisPerbaikan === "kopelTrafoSebelah") {
        const validTrafoList = trafoList.filter((t) => t.trim() !== "");
        validTrafoList.forEach((trafo, index) => {
        formData.append(`daftar_trafo[${index}]`, trafo);
        });
      }

      // 🔍 DEBUG: Log semua data yang akan dikirim
      console.log("=== DATA YANG DIKIRIM ===");
      console.log("Laporan ID:", id);
      console.log("User ID:", userId);
      console.log("Jenis Perbaikan:", jenisPerbaikan);
      
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, "=> File:", value.name, value.type, value.size, "bytes");
        } else {
          console.log(key, "=>", value);
        }
      }

      // Kirim request
      const response = await axios.post(
        "http://localhost:5000/api/perbaikan", 
        formData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Response berhasil:", response.data);

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Perbaikan berhasil disimpan.",
        confirmButtonColor: "#3085d6",
      });

      navigate("/perbaikan");

    } catch (err) {
      console.error("❌ Error submit:", err);
      console.error("❌ Error response:", err.response?.data);
      console.error("❌ Error status:", err.response?.status);
      console.error("❌ Error headers:", err.response?.headers);

      let errorMessage = "Terjadi kesalahan saat menyimpan data.";

      if (err.response) {
        // Server merespons dengan error
        if (err.response.status === 500) {
          errorMessage = "Server error. Mohon hubungi administrator atau coba lagi nanti.";
          
          // Tampilkan detail error jika ada
          if (err.response.data?.message) {
            errorMessage += `\n\nDetail: ${err.response.data.message}`;
          } else if (err.response.data?.error) {
            errorMessage += `\n\nDetail: ${err.response.data.error}`;
          }
        } else if (err.response.status === 401) {
          errorMessage = "Sesi login Anda telah berakhir. Silakan login ulang.";
          localStorage.removeItem("token");
          setTimeout(() => navigate("/login"), 2000);
        } else if (err.response.status === 422) {
          errorMessage = "Data yang dikirim tidak valid. Periksa kembali input Anda.";
          
          if (err.response.data?.errors) {
            const errors = Object.values(err.response.data.errors).flat();
            errorMessage += `\n\n${errors.join("\n")}`;
          }
        } else if (err.response.status === 404) {
          errorMessage = "Endpoint API tidak ditemukan. Hubungi administrator.";
        } else {
          errorMessage = err.response.data?.message || 
                        err.response.data?.error || 
                        `Error ${err.response.status}: Terjadi kesalahan.`;
        }
      } else if (err.request) {
        // Request dikirim tapi tidak ada response
        errorMessage = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
      } else {
        // Error lainnya
        errorMessage = err.message || "Terjadi kesalahan yang tidak diketahui.";
      }
      
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan!",
        text: errorMessage,
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ======================================================
  // RENDER
  // ======================================================
  return (
    <div className="flex w-screen h-screen bg-gray-100 text-gray-800">
      {/* SIDEBAR */}
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

      {/* MAIN */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-bold">
            Pilihan Perbaikan untuk Laporan #{id}
          </h1>

          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded hover:bg-gray-200 md:hidden"
          >
            <HiOutlineBars3 className="text-2xl" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
          <fieldset disabled={isSubmitting}>
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
                  placeholder="Merk Trafo *" 
                  value={gantiTrafoData.merk} 
                  onChange={handleGantiTrafoChange} 
                  className="border p-2 rounded-md w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
                <input 
                  type="text" 
                  name="noSeri" 
                  placeholder="Nomor Seri *" 
                  value={gantiTrafoData.noSeri} 
                  onChange={handleGantiTrafoChange} 
                  className="border p-2 rounded-md w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
                <input 
                  type="text" 
                  name="kapasitas" 
                  placeholder="Kapasitas (kVA) *" 
                  value={gantiTrafoData.kapasitas} 
                  onChange={handleGantiTrafoChange} 
                  className="border p-2 rounded-md w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
                <input 
                  type="text" 
                  name="tahun" 
                  placeholder="Tahun Buat (contoh: 2024) *" 
                  value={gantiTrafoData.tahun} 
                  onChange={handleGantiTrafoChange} 
                  className="border p-2 rounded-md w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  required 
                  maxLength="4"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foto Name Plate (Opsional)
                  </label>
                  <input 
                    type="file" 
                    name="fotoNamePlate" 
                    onChange={handleFileChange} 
                    accept="image/jpeg,image/jpg,image/png,image/gif" 
                    className="border p-2 rounded-md w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"  
                  />
                  {gantiTrafoData.fotoNamePlate && (
                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                      ✓ File: {gantiTrafoData.fotoNamePlate.name} ({(gantiTrafoData.fotoNamePlate.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Format: JPG, PNG, GIF • Maksimal 5MB
                  </p>
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
                  placeholder="Kapasitas (kVA) *" 
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
                        placeholder={`Nomor Trafo ${index + 1} *`} 
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
                      <HiOutlinePlusCircle className="text-xl" />
                      Tambah Trafo (Maksimal 5)
                    </button>
                  )}
                </div>
              )}
            </div>
          </fieldset>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              type="button"
              onClick={() => navigate("/perbaikan")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg shadow transition-colors"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2" 
              disabled={!jenisPerbaikan || isSubmitting}
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {isSubmitting ? "Menyimpan..." : "Simpan Perbaikan"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
