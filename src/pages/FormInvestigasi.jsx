
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineBars3 } from "react-icons/hi2";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "../components/Sidebar";

// API Base URL
const API_URL = "http://localhost:5000/api";

// --- KOMPONEN INPUT ---
function InputField({ label, name, value, onChange, type = "text", placeholder = "", className = "" }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
      />
    </div>
  );
}

function MeggerInput({ label, name, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <label htmlFor={name} className="text-sm">{label}</label>
      <div className="flex items-center gap-1">
        <input
          type="number"
          step="0.01"
          id={name}
          name={name}
          value={value || ''}
          onChange={onChange}
          className="w-20 border-gray-300 rounded-md shadow-sm p-1 border text-sm"
        />
        <span className="text-sm font-medium">MΩ</span>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function FormInvestigasi() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const navigate = useNavigate();

  // 1. Ambil parameter laporanId dari URL
  const { laporanId } = useParams();

  // 2. State Form Data
  const [formData, setFormData] = useState({
    laporan_id: laporanId || null,
    
    // Identitas Trafo (Akan diisi otomatis)
    noSeri: "",
    daya: "",
    fasa: "",
    merk: "",
    kodeTrafo: "",
    tahunProduksi: "",
    tanggalKerusakan: "",

    // Hasil Pemeriksaan Visual
    terminasiBushingPrimer: "",
    terminasiBushingSekunder: "",
    bushingPrimer: "",
    bushingSekunder: "",
    sealBushingPrimer: "",
    sealBushingSekunder: "",
    tapChanger: "",
    konektorBushing: "",
    sealBodyTrafo: "",
    tangkiTrafo: "",
    catFisik: "",
    kranSaluranKeluarMinyak: "",
    isolasiKertas: "",
    kumparanPrimer: "",
    kumparanSekunder: "",
    intiBesi: "",
    warnaMinyak: "",
    kandunganAirDalamMinyak: "",
    
    // Hasil Megger
    merggerR_S_Primer: "", merggerR_T_Primer: "", merggerS_T_Primer: "",
    meggerR_S_Ground_SS: "", meggerR_T_Ground_SS: "", meggerS_T_Ground_SS: "",
    meggerR_N_Ground_SS: "", meggerS_N_Ground_SS: "", meggerT_N_Ground_SS: "",
    meggerR_r_Ground_PS: "", meggerR_s_Ground_PS: "", meggerR_t_Ground_PS: "",
    meggerS_r_Ground_PS: "", meggerS_s_Ground_PS: "", meggerS_t_Ground_PS: "",
    meggerT_r_Ground_PS: "", meggerT_s_Ground_PS: "", meggerT_t_Ground_PS: "",
    meggerR_B_Ground_PB: "", meggerS_B_Ground_PB: "", meggerT_B_Ground_PB: "",
    megger_r_B_Ground_SB: "", megger_s_B_Ground_SB: "", megger_t_B_Ground_SB: "", megger_n_B_Ground_SB: "",
    
    // Tegangan Tembus
    teganganTembus_RT: "", teganganTembus_ST: "", teganganTembus_TR: "", teganganTembus_RataRata: "",
    
    // TTR
    posisiTapChanger1: "", posisiTapChanger2: "", posisiTapChanger3: "",
    
    // Kesimpulan
    penyebabKerusakan: "",
    rekomendasi: "",
    
    // TTD
    supervisorOperasi: "",
    pemeriksaUP3: "",
    asmanJaringan: "",
  });

// 3. FUNGSI HELPER UNTUK FORMAT TANGGAL DAN WAKTU
const formatDateTime = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    // Format: YYYY-MM-DDTHH:mm (sesuai datetime-local)
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (e) {
    console.error("Error formatting datetime:", e);
    return "";
  }
};

  // 4. FUNGSI UNTUK EXTRACT DATA DARI BERBAGAI FORMAT RESPONSE
  const extractLaporanData = (responseData) => {
    console.log("🔍 Extracting data from:", responseData);
    
    // Coba berbagai kemungkinan struktur response
    let data = null;
    
    if (responseData.data) {
      data = responseData.data;
    } else if (responseData.laporan) {
      data = responseData.laporan;
    } else if (responseData.result) {
      data = responseData.result;
    } else {
      data = responseData;
    }

    console.log("📦 Extracted data object:", data);
    return data;
  };

  // 5. FUNGSI UNTUK MAPPING FIELD NAMES
  const getFieldValue = (data, ...possibleKeys) => {
    for (let key of possibleKeys) {
      if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
        return data[key];
      }
    }
    return "";
  };

  // 6. EFFECT: AUTO-FILL IDENTITAS TRAFO
  useEffect(() => {
    const fetchLaporanData = async () => {
      if (!laporanId) {
        console.warn("⚠️ No laporanId provided");
        return;
      }

      console.log("🚀 Starting fetch for laporanId:", laporanId);
      
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("Token tidak ditemukan. Silakan login kembali.");
        }

        console.log("🔑 Token found, making API request...");

        // Request dengan error handling yang lebih baik
        const response = await axios.get(`${API_URL}/laporan/${laporanId}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 detik timeout
        });

        console.log("✅ API Response received:", response.data);
        console.log("📊 Response status:", response.status);

        // Extract data dari response
        const src = extractLaporanData(response.data);
        
        if (!src) {
          throw new Error("Data laporan kosong atau tidak valid");
        }

        // Simpan debug info
        setDebugInfo({
          responseStructure: Object.keys(response.data),
          extractedData: src,
          availableFields: Object.keys(src)
        });

        console.log("🗂️ Available fields in data:", Object.keys(src));

        // Mapping data dengan prioritas field name yang berbeda
        const mappedData = {
          laporan_id: laporanId,
          
          // Kode Trafo - coba berbagai kemungkinan nama field
          kodeTrafo: getFieldValue(src, 
            'kodeTrafo', 'kode_trafo', 
            'kodegardu', 'kode_gardu', 
            'kodeGardu', 'gardu_code', 
            'trafo_code', 'code'
          ),
          
          // No Seri
          noSeri: getFieldValue(src,
            'noSeri', 'no_seri',
            'nomorSerie', 'nomor_serie',
            'nomorSeri', 'nomor_seri',
            'serialNumber', 'serial_number'
          ),
          
          // Merk
          merk: getFieldValue(src,
            'merk', 'brand',
            'merkTrafo', 'merk_trafo',
            'trafo_brand'
          ),
          
          // Daya
          daya: (() => {
            const dayaValue = getFieldValue(src,
              'daya', 'power',
              'dayaTrafo', 'daya_trafo',
              'capacity', 'kva'
            );
            return dayaValue ? String(dayaValue).replace(/[^\d]/g, '') : "";
          })(),
          
          // Fasa
          fasa: (() => {
            const fasaValue = getFieldValue(src,
              'fasa', 'phase',
              'fasaTrafo', 'fasa_trafo',
              'phases'
            );
            return fasaValue ? String(fasaValue) : "";
          })(),
          
          // Tahun Produksi
          tahunProduksi: getFieldValue(src,
            'tahunProduksi', 'tahun_produksi',
            'tahun', 'year',
            'tahunPembuatan', 'tahun_pembuatan',
            'productionYear', 'production_year'
          ),
          

      // Tanggal Kerusakan
      tanggalKerusakan: (() => {
        const tanggalValue = getFieldValue(src,
          'tanggalKerusakan', 'tanggal_kerusakan',
          'tanggalGangguan', 'tanggal_gangguan',
          'damageDate', 'damage_date',
          'failureDate', 'failure_date'
        );
        return formatDateTime(tanggalValue); // ✅ Ubah dari formatDate ke formatDateTime
      })(),
        };

        console.log("📝 Mapped data to form:", mappedData);

        // Update form data
        setFormData(prev => ({
          ...prev,
          ...mappedData
        }));

        console.log("✅ Form data updated successfully");

        // Tampilkan notifikasi sukses
        Swal.fire({
          icon: "success",
          title: "Data Berhasil Dimuat",
          text: "Identitas trafo telah diisi otomatis",
          timer: 2000,
          showConfirmButton: false
        });

      } catch (err) {
        console.error("❌ Error fetching laporan data:", err);
        console.error("Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        
        const errorMessage = err.response?.data?.message 
          || err.message 
          || "Gagal mengambil data laporan";
        
        setError(errorMessage);
        
        Swal.fire({
          icon: "warning",
          title: "Gagal Auto-Fill",
          text: errorMessage + ". Silakan isi manual.",
          confirmButtonText: "OK"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLaporanData();
  }, [laporanId]);

  // Handler Input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handler Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem('userId') || 1;
      const payload = { ...formData };

      // Bersihkan string kosong -> null
      Object.keys(payload).forEach(key => {
        if (payload[key] === "") payload[key] = null;
      });

      // Bersihkan format Daya (jika ada teks 'kVA')
      if (payload.daya && typeof payload.daya === 'string') {
        const numericDaya = payload.daya.replace(/\D/g, '');
        payload.daya = numericDaya ? parseInt(numericDaya) : null;
      }

      // Pastikan ID Integer
      if (laporanId) payload.laporan_id = parseInt(laporanId);
      payload.userId = parseInt(userId);

      console.log("📤 Mengirim Payload:", payload);

      const response = await axios.post(`${API_URL}/investigasi`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 200 || response.status === 201) {
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Data Investigasi berhasil disimpan!',
          timer: 1500
        });
        navigate("/investigasi");
      }

    } catch (error) {
      console.error("❌ Error submit:", error);
      const msg = error.response?.data?.message || "Gagal menyimpan data.";
      setError(msg);
      Swal.fire('Gagal', msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-screen h-screen bg-gray-100 text-gray-800">
      <aside className="hidden md:flex md:w-64 bg-white flex-col justify-between shadow-lg">
        <Sidebar active="investigasi" />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-white flex-col justify-between shadow-lg">
            <Sidebar active="investigasi" close={() => setSidebarOpen(false)} />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}

      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-bold">
            Form Investigasi {laporanId ? `(Ref: #${laporanId})` : ''}
          </h1>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ backgroundColor: "transparent", border: "none" }}
            className="p-2 rounded hover:bg-gray-200 md:hidden"
          >
            <HiOutlineBars3 className="text-2xl text-gray-700" />
          </button>
        </div>

        {/* Debug Info - Hapus setelah testing 
        {debugInfo && process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-300 rounded-lg text-xs">
            <strong>🔧 Debug Info:</strong>
            <pre className="mt-2 overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}*/}

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start">
            <span className="text-xl mr-2">⚠️</span>
            <div><strong>Error:</strong> {error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
          
          {/* IDENTITAS TRAFO */}
          <div className="border-b pb-4">
            <h2 className="font-semibold text-lg text-gray-800 mb-3">Identitas Trafo (Dari Laporan Awal)</h2>
            
            {loading ? (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-300 rounded-lg flex items-center gap-3">
                <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-blue-700 font-medium">Sedang mengambil data laporan...</span>
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <InputField 
                label="Kode Trafo/ULP (GTT)" 
                name="kodeTrafo" 
                value={formData.kodeTrafo} 
                onChange={handleInputChange}
                placeholder="Contoh: GTT-001"
              />
              <InputField 
                label="No. Seri" 
                name="noSeri" 
                value={formData.noSeri} 
                onChange={handleInputChange}
                placeholder="Contoh: ABC123456"
              />
              <InputField 
                label="Daya (kVA)" 
                name="daya" 
                value={formData.daya} 
                onChange={handleInputChange}
                placeholder="Contoh: 50"
              />
              <InputField 
                label="Merk" 
                name="merk" 
                value={formData.merk} 
                onChange={handleInputChange}
                placeholder="Contoh: Schneider"
              />
              <InputField 
                label="Tahun Produksi" 
                name="tahunProduksi" 
                value={formData.tahunProduksi} 
                onChange={handleInputChange}
                placeholder="Contoh: 2020"
              />
              <InputField 
                label="Fasa" 
                name="fasa" 
                value={formData.fasa} 
                onChange={handleInputChange}
                placeholder="Contoh: 3"
              />
            <InputField 
              label="Tanggal Kerusakan" 
              name="tanggalKerusakan" 
              type="datetime-local" 
              value={formData.tanggalKerusakan} 
              onChange={handleInputChange} 
              placeholder="Contoh: 3"
            />
            </div>
          </div>

        {/* HASIL PEMERIKSAAN VISUAL */}
        <div className="border-b pb-4">
          <h2 className="font-semibold text-lg text-center text-gray-800 mb-3">Hasil Pemeriksaan Visual</h2>
          <table className="w-full">
            <thead className="bg-gray-100 text-left text-xs uppercase text-gray-600">
              <tr>
                <th className="p-2 w-10">No</th>
                <th className="p-2 w-1/2">Uraian</th>
                <th className="p-2 w-1/3">Kondisi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
            
              <tr className="border-b">
                <td className="p-2 text-center">1</td>
                <td className="p-2">TERMINASI BUSHING PRIMER</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <label className="flex items-center gap-1">
                      <input type="radio" name="terminasiBushingPrimer" value="Baik" checked={formData.terminasiBushingPrimer === "Baik"} onChange={handleInputChange} /> <span>BAIK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="terminasiBushingPrimer" value="Bengkok" checked={formData.terminasiBushingPrimer === "Bengkok"} onChange={handleInputChange} /> <span>BENGKOK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="terminasiBushingPrimer" value="Leleh" checked={formData.terminasiBushingPrimer === "Leleh"} onChange={handleInputChange} /> <span>LELEH</span>
                    </label>
                  </div>
                </td>
              </tr>


              <tr className="border-b">
                <td className="p-2 text-center">2</td>
                <td className="p-2">TERMINASI BUSHING SEKUNDER</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <label className="flex items-center gap-1">
                      <input type="radio" name="terminasiBushingSekunder" value="Baik" checked={formData.terminasiBushingSekunder === "Baik"} onChange={handleInputChange} /> <span>BAIK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="terminasiBushingSekunder" value="Bengkok" checked={formData.terminasiBushingSekunder === "Bengkok"} onChange={handleInputChange} /> <span>BENGKOK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="terminasiBushingSekunder" value="Leleh" checked={formData.terminasiBushingSekunder === "Leleh"} onChange={handleInputChange} /> <span>LELEH</span>
                    </label>
                  </div>
                </td>
              </tr>


              <tr className="border-b">
                <td className="p-2 text-center">3</td>
                <td className="p-2">BUSHING PRIMER</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <label className="flex items-center gap-1">
                      <input type="radio" name="bushingPrimer" value="Baik" checked={formData.bushingPrimer === "Baik"} onChange={handleInputChange} /> <span>BAIK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="bushingPrimer" value="Retak" checked={formData.bushingPrimer === "Retak"} onChange={handleInputChange} /> <span>RETAK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="bushingPrimer" value="Pecah" checked={formData.bushingPrimer === "Pecah"} onChange={handleInputChange} /> <span>PECAH</span>
                    </label>
                  </div>
                </td>
              </tr>


              <tr className="border-b">
                <td className="p-2 text-center">4</td>
                <td className="p-2">BUSHING SEKUNDER</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <label className="flex items-center gap-1">
                      <input type="radio" name="bushingSekunder" value="Baik" checked={formData.bushingSekunder === "Baik"} onChange={handleInputChange} /> <span>BAIK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="bushingSekunder" value="Retak" checked={formData.bushingSekunder === "Retak"} onChange={handleInputChange} /> <span>RETAK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="bushingSekunder" value="Pecah" checked={formData.bushingSekunder === "Pecah"} onChange={handleInputChange} /> <span>PECAH</span>
                    </label>
                  </div>
                </td>
              </tr>


              <tr className="border-b">
                <td className="p-2 text-center">5</td>
                <td className="p-2">SEAL BUSHING PRIMER</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <label className="flex items-center gap-1">
                      <input type="radio" name="sealBushingPrimer" value="Baik" checked={formData.sealBushingPrimer === "Baik"} onChange={handleInputChange} /> <span>BAIK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="sealBushingPrimer" value="Retak" checked={formData.sealBushingPrimer === "Retak"} onChange={handleInputChange} /> <span>RETAK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="sealBushingPrimer" value="Bocor" checked={formData.sealBushingPrimer === "Bocor"} onChange={handleInputChange} /> <span>BOCOR</span>
                    </label>
                  </div>
                </td>
              </tr>


              <tr className="border-b">
                <td className="p-2 text-center">6</td>
                <td className="p-2">SEAL BUSHING SEKUNDER</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <label className="flex items-center gap-1">
                      <input type="radio" name="sealBushingSekunder" value="Baik" checked={formData.sealBushingSekunder === "Baik"} onChange={handleInputChange} /> <span>BAIK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="sealBushingSekunder" value="Retak" checked={formData.sealBushingSekunder === "Retak"} onChange={handleInputChange} /> <span>RETAK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="sealBushingSekunder" value="Bocor" checked={formData.sealBushingSekunder === "Bocor"} onChange={handleInputChange} /> <span>BOCOR</span>
                    </label>
                  </div>
                </td>
              </tr>


              <tr className="border-b">
                <td className="p-2 text-center">7</td>
                <td className="p-2">TAP CHANGER</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <label className="flex items-center gap-1">
                      <input type="radio" name="tapChanger" value="Baik" checked={formData.tapChanger === "Baik"} onChange={handleInputChange} /> <span>BAIK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="tapChanger" value="Retak" checked={formData.tapChanger === "Retak"} onChange={handleInputChange} /> <span>RETAK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="tapChanger" value="Rusak" checked={formData.tapChanger === "Rusak"} onChange={handleInputChange} /> <span>RUSAK</span>
                    </label>
                  </div>
                </td>
              </tr>


              <tr className="border-b">
                <td className="p-2 text-center">8</td>
                <td className="p-2">KONSERVATOR (ADA/TIDAK)</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <label className="flex items-center gap-1">
                      <input type="radio" name="konektorBushing" value="Baik" checked={formData.konektorBushing === "Baik"} onChange={handleInputChange} /> <span>BAIK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="konektorBushing" value="Karatan" checked={formData.konektorBushing === "Karatan"} onChange={handleInputChange} /> <span>KARATAN</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="konektorBushing" value="Bocor" checked={formData.konektorBushing === "Bocor"} onChange={handleInputChange} /> <span>BOCOR</span>
                    </label>
                  </div>
                </td>
              </tr>


              <tr className="border-b">
                <td className="p-2 text-center">9</td>
                <td className="p-2">SEAL BODY TRAFO</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <label className="flex items-center gap-1">
                      <input type="radio" name="sealBodyTrafo" value="Baik" checked={formData.sealBodyTrafo === "Baik"} onChange={handleInputChange} /> <span>BAIK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="sealBodyTrafo" value="Retak" checked={formData.sealBodyTrafo === "Retak"} onChange={handleInputChange} /> <span>RETAK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="sealBodyTrafo" value="Bocor" checked={formData.sealBodyTrafo === "Bocor"} onChange={handleInputChange} /> <span>BOCOR</span>
                    </label>
                  </div>
                </td>
              </tr>


              <tr className="border-b">
                <td className="p-2 text-center">10</td>
                <td className="p-2">TANGKI TRAFO</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <label className="flex items-center gap-1">
                      <input type="radio" name="tangkiTrafo" value="Baik" checked={formData.tangkiTrafo === "Baik"} onChange={handleInputChange} /> <span>BAIK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="tangkiTrafo" value="Kembung" checked={formData.tangkiTrafo === "Kembung"} onChange={handleInputChange} /> <span>KEMBUNG</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="tangkiTrafo" value="Bocor/Rembes" checked={formData.tangkiTrafo === "Bocor/Rembes"} onChange={handleInputChange} /> <span>BOCOR/REMBES</span>
                    </label>
                  </div>
                </td>
              </tr>


              <tr className="border-b">
                <td className="p-2 text-center">11</td>
                <td className="p-2">CAT FISIK</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <label className="flex items-center gap-1">
                      <input type="radio" name="catFisik" value="Baik" checked={formData.catFisik === "Baik"} onChange={handleInputChange} /> <span>BAIK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="catFisik" value="Kotor" checked={formData.catFisik === "Kotor"} onChange={handleInputChange} /> <span>KOTOR</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="catFisik" value="Karatan" checked={formData.catFisik === "Karatan"} onChange={handleInputChange} /> <span>KARATAN</span>
                    </label>
                  </div>
                </td>
              </tr>


              <tr className="border-b">
                <td className="p-2 text-center">12</td>
                <td className="p-2">KRAN SALURAN KELUAR MINYAK</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <label className="flex items-center gap-1">
                      <input type="radio" name="kranSaluranKeluarMinyak" value="Baik" checked={formData.kranSaluranKeluarMinyak === "Baik"} onChange={handleInputChange} /> <span>BAIK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="kranSaluranKeluarMinyak" value="Macet" checked={formData.kranSaluranKeluarMinyak === "Macet"} onChange={handleInputChange} /> <span>MACET</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="kranSaluranKeluarMinyak" value="Bocor" checked={formData.kranSaluranKeluarMinyak === "Bocor"} onChange={handleInputChange} /> <span>BOCOR</span>
                    </label>
                  </div>
                </td>
              </tr>


              <tr className="border-b">
                <td className="p-2 text-center">13</td>
                <td className="p-2">ISOLASI KERTAS</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <label className="flex items-center gap-1">
                      <input type="radio" name="isolasiKertas" value="Baik" checked={formData.isolasiKertas === "Baik"} onChange={handleInputChange} /> <span>BAIK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="isolasiKertas" value="Terbakar" checked={formData.isolasiKertas === "Terbakar"} onChange={handleInputChange} /> <span>TERBAKAR</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="isolasiKertas" value="Robek" checked={formData.isolasiKertas === "Robek"} onChange={handleInputChange} /> <span>ROBEK</span>
                    </label>
                  </div>
                </td>
              </tr>


              <tr className="border-b">
                <td className="p-2 text-center">14</td>
                <td className="p-2">KUMPARAN PRIMER</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <label className="flex items-center gap-1">
                      <input type="radio" name="kumparanPrimer" value="Baik" checked={formData.kumparanPrimer === "Baik"} onChange={handleInputChange} /> <span>BAIK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="kumparanPrimer" value="Putus" checked={formData.kumparanPrimer === "Putus"} onChange={handleInputChange} /> <span>PUTUS</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="kumparanPrimer" value="Terkurai" checked={formData.kumparanPrimer === "Terkurai"} onChange={handleInputChange} /> <span>TERKURAI</span>
                    </label>
                  </div>
                </td>
              </tr>


              <tr className="border-b">
                <td className="p-2 text-center">15</td>
                <td className="p-2">KUMPARAN SEKUNDER</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <label className="flex items-center gap-1">
                      <input type="radio" name="kumparanSekunder" value="Baik" checked={formData.kumparanSekunder === "Baik"} onChange={handleInputChange} /> <span>BAIK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="kumparanSekunder" value="Putus" checked={formData.kumparanSekunder === "Putus"} onChange={handleInputChange} /> <span>PUTUS</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="kumparanSekunder" value="Terkurai" checked={formData.kumparanSekunder === "Terkurai"} onChange={handleInputChange} /> <span>TERKURAI</span>
                    </label>
                  </div>
                </td>
              </tr>


              <tr className="border-b">
                <td className="p-2 text-center">16</td>
                <td className="p-2">INTI BESI</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <label className="flex items-center gap-1">
                      <input type="radio" name="intiBesi" value="Baik" checked={formData.intiBesi === "Baik"} onChange={handleInputChange} /> <span>BAIK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="intiBesi" value="Rusak" checked={formData.intiBesi === "Rusak"} onChange={handleInputChange} /> <span>RUSAK</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="intiBesi" value="Terkurai" checked={formData.intiBesi === "Terkurai"} onChange={handleInputChange} /> <span>TERKURAI</span>
                    </label>
                  </div>
                </td>
              </tr>


              <tr className="border-b">
                <td className="p-2 text-center">17</td>
                <td className="p-2">WARNA MINYAK</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <label className="flex items-center gap-1">
                      <input type="radio" name="warnaMinyak" value="Jernih" checked={formData.warnaMinyak === "Jernih"} onChange={handleInputChange} /> <span>JERNIH</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="warnaMinyak" value="Kuning" checked={formData.warnaMinyak === "Kuning"} onChange={handleInputChange} /> <span>KUNING</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="warnaMinyak" value="Coklat" checked={formData.warnaMinyak === "Coklat"} onChange={handleInputChange} /> <span>COKLAT</span>
                    </label>
                  </div>
                </td>
              </tr>


              <tr className="border-b">
                <td className="p-2 text-center">18</td>
                <td className="p-2">KANDUNGAN AIR DALAM MINYAK</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <label className="flex items-center gap-1">
                      <input type="radio" name="kandunganAirDalamMinyak" value="Ada" checked={formData.kandunganAirDalamMinyak === "Ada"} onChange={handleInputChange} /> <span>ADA</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="kandunganAirDalamMinyak" value="Tidak ada" checked={formData.kandunganAirDalamMinyak === "Tidak ada"} onChange={handleInputChange} /> <span>TIDAK ADA</span>
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>


        {/* HASIL PENGUKURAN MEGGER */}
        <div className="border-b pb-4">
          <h2 className="font-semibold text-lg text-gray-800 mb-3">Hasil Pengukuran Megger (MΩ)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
            <div className="p-3 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-center mb-2">MEGGER (5050 V)</h3>
              <MeggerInput label="R - S" name="merggerR_S_Primer" value={formData.merggerR_S_Primer} onChange={handleInputChange} />
              <MeggerInput label="R - T" name="merggerR_T_Primer" value={formData.merggerR_T_Primer} onChange={handleInputChange} />
              <MeggerInput label="S - T" name="merggerS_T_Primer" value={formData.merggerS_T_Primer} onChange={handleInputChange} />
            </div>
          
            <div className="p-3 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-center mb-2">TT - GROUND</h3>
              <h4 className="font-medium text-xs text-center underline mb-1">Sekunder-Sekunder</h4>
              <MeggerInput label="r - s" name="meggerR_S_Ground_SS" value={formData.meggerR_S_Ground_SS} onChange={handleInputChange} />
              <MeggerInput label="s - t" name="meggerS_T_Ground_SS" value={formData.meggerS_T_Ground_SS} onChange={handleInputChange} />
              <MeggerInput label="r - n" name="meggerR_N_Ground_SS" value={formData.meggerR_N_Ground_SS} onChange={handleInputChange} />
              <MeggerInput label="s - n" name="meggerS_N_Ground_SS" value={formData.meggerS_N_Ground_SS} onChange={handleInputChange} />
              <MeggerInput label="t - n" name="meggerT_N_Ground_SS" value={formData.meggerT_N_Ground_SS} onChange={handleInputChange} />
            </div>


            <div className="p-3 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-center mb-2">TR - GROUND</h3>
              <h4 className="font-medium text-xs text-center underline mb-1">Primer-Sekunder</h4>
              <MeggerInput label="R - r" name="meggerR_r_Ground_PS" value={formData.meggerR_r_Ground_PS} onChange={handleInputChange} />
              <MeggerInput label="R - s" name="meggerR_s_Ground_PS" value={formData.meggerR_s_Ground_PS} onChange={handleInputChange} />
              <MeggerInput label="R - t" name="meggerR_t_Ground_PS" value={formData.meggerR_t_Ground_PS} onChange={handleInputChange} />
              <MeggerInput label="S - r" name="meggerS_r_Ground_PS" value={formData.meggerS_r_Ground_PS} onChange={handleInputChange} />
              <MeggerInput label="S - s" name="meggerS_s_Ground_PS" value={formData.meggerS_s_Ground_PS} onChange={handleInputChange} />
              <MeggerInput label="S - t" name="meggerS_t_Ground_PS" value={formData.meggerS_t_Ground_PS} onChange={handleInputChange} />
              <MeggerInput label="T - r" name="meggerT_r_Ground_PS" value={formData.meggerT_r_Ground_PS} onChange={handleInputChange} />
              <MeggerInput label="T - s" name="meggerT_s_Ground_PS" value={formData.meggerT_s_Ground_PS} onChange={handleInputChange} />
              <MeggerInput label="T - t" name="meggerT_t_Ground_PS" value={formData.meggerT_t_Ground_PS} onChange={handleInputChange} />
            </div>


            <div className="p-3 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-center mb-2">TT - TR</h3>
              <h4 className="font-medium text-xs text-center underline mb-1">Primer-Body</h4>
              <MeggerInput label="R - B" name="meggerR_B_Ground_PB" value={formData.meggerR_B_Ground_PB} onChange={handleInputChange} />
              <MeggerInput label="S - B" name="meggerS_B_Ground_PB" value={formData.meggerS_B_Ground_PB} onChange={handleInputChange} />
              <MeggerInput label="T - B" name="meggerT_B_Ground_PB" value={formData.meggerT_B_Ground_PB} onChange={handleInputChange} />
              <h4 className="font-medium text-xs text-center underline mt-2 mb-1">Sekunder-Body</h4>
              <MeggerInput label="r - B" name="megger_r_B_Ground_SB" value={formData.megger_r_B_Ground_SB} onChange={handleInputChange} />
              <MeggerInput label="s - B" name="megger_s_B_Ground_SB" value={formData.megger_s_B_Ground_SB} onChange={handleInputChange} />
              <MeggerInput label="t - B" name="megger_t_B_Ground_SB" value={formData.megger_t_B_Ground_SB} onChange={handleInputChange} />
              <MeggerInput label="n - B" name="megger_n_B_Ground_SB" value={formData.megger_n_B_Ground_SB} onChange={handleInputChange} />
            </div>


          </div>
        </div>


        {/* TEGANGAN TEMBUS MINYAK */}
        <div className="border-b pb-4">
          <h2 className="font-semibold text-lg text-gray-800 mb-3">Tegangan Tembus Minyak (KV/2,5 mm)</h2>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField
                label="RT"
                name="teganganTembus_RT"
                value={formData.teganganTembus_RT}
                onChange={handleInputChange}
                type="number"
              />
              <InputField
                label="ST"
                name="teganganTembus_ST"
                value={formData.teganganTembus_ST}
                onChange={handleInputChange}
                type="number"
              />
              <InputField
                label="TR"
                name="teganganTembus_TR"
                value={formData.teganganTembus_TR}
                onChange={handleInputChange}
                type="number"
              />
              <InputField
                label="Rata-Rata"
                name="teganganTembus_RataRata"
                value={formData.teganganTembus_RataRata}
                onChange={handleInputChange}
                type="number"
              />
            </div>
          </div>
        </div>


        {/* TTR */}
        <div className="border-b pb-4">
          <h2 className="font-semibold text-lg text-gray-800 mb-3">Turn Test Ratio (TTR)</h2>
          <div className="p-3 bg-gray-50 rounded-lg space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">POSISI TAP CHANGER</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
              <InputField label="1" name="posisiTapChanger1" value={formData.posisiTapChanger1} onChange={handleInputChange} />
              <InputField label="2" name="posisiTapChanger2" value={formData.posisiTapChanger2} onChange={handleInputChange} />
              <InputField label="3" name="posisiTapChanger3" value={formData.posisiTapChanger3} onChange={handleInputChange} />
            </div>
          </div>
        </div>


        {/* KESIMPULAN */}
        <div className="border-b pb-4">
          <h2 className="font-semibold text-lg text-gray-800 mb-3">Kesimpulan Hasil Investigasi</h2>
          <div className="p-3 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <InputField
                label="Penyebab Kerusakan/Gangguan"
                name="penyebabKerusakan"
                value={formData.penyebabKerusakan}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rekomendasi</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 p-2 bg-white rounded-md border border-gray-300 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="rekomendasi"
                    value="TRAFO GARANSI"
                    checked={formData.rekomendasi === "TRAFO GARANSI"}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="font-medium text-gray-700">TRAFO GARANSI</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-white rounded-md border border-gray-300 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="rekomendasi"
                    value="TRAFO REKONDISI"
                    checked={formData.rekomendasi === "TRAFO REKONDISI"}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="font-medium text-gray-700">TRAFO REKONDISI</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-white rounded-md border border-gray-300 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="rekomendasi"
                    value="TRAFO DINYATAKAN LIMBAH"
                    checked={formData.rekomendasi === "TRAFO DINYATAKAN LIMBAH"}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="font-medium text-gray-700">TRAFO DINYATAKAN LIMBAH</span>
                </label>
              </div>
            </div>
          </div>
        </div>


        {/* TANDA TANGAN */}
        <div>
          <h2 className="font-semibold text-lg text-gray-800 mb-3">Penanggung Jawab</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField label="Supervisor Operasi" name="supervisorOperasi" value={formData.supervisorOperasi} onChange={handleInputChange} />
            <InputField label="Pengawas Pekerjaan" name="pemeriksaUP3" value={formData.pemeriksaUP3} onChange={handleInputChange} />
            <InputField label="Mengetahui (Asman Jaringan)" name="asmanJaringan" value={formData.asmanJaringan} onChange={handleInputChange} />
          </div>
        </div>
       
         {/* SUBMIT BUTTONS */}
         <div className="flex justify-end mt-6 gap-4">
           <button
             type="button"
             onClick={() => window.history.back()}
             className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-8 rounded-lg shadow-md transition duration-300"
             style={{ backgroundColor: "#6b7280", color: "white", border: "none" }} // Force Gray
             disabled={loading}
           >
             Batal
           </button>
           <button
             type="submit"
             disabled={loading}
             className={`${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-2 px-8 rounded-lg shadow-md transition duration-300 flex items-center gap-2`}
             style={{
               backgroundColor: loading ? "#60a5fa" : "#2563eb", // Force Blue
               color: "white",
               border: "none",
               cursor: loading ? "not-allowed" : "pointer"
             }}
           >
             {loading ? (
               <>
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 <span>Menyimpan...</span>
               </>
             ) : (
               'Submit'
             )}
           </button>
         </div>
       </form>
     </main>
   </div>
 );
}

