import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineBars3 } from "react-icons/hi2";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "../components/Sidebar";


// API Base URL
const API_URL = "http://localhost:5000/api";


// --- Komponen InputField ---
function InputField({ label, name, value, onChange, type = "text", placeholder = "", className = "" }) {
 return (
   <div className={`flex flex-col ${className}`}>
     <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">{label}</label>
     <input
       type={type}
       id={name}
       name={name}
       value={value || ""}
       onChange={onChange}
       placeholder={placeholder}
       className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
     />
   </div>
 );
}


// --- Komponen MeggerInput ---
function MeggerInput({ label, name, value, onChange }) {
 return (
   <div className="flex items-center justify-between gap-2 py-1">
     <label htmlFor={name} className="text-sm">{label}</label>
     <div className="flex items-center gap-1">
       <input
         type="number"
         step="0.1"
         id={name}
         name={name}
         value={value || ""}
         onChange={onChange}
         className="w-20 border-gray-300 rounded-md shadow-sm p-1 border text-sm"
       />
       <span className="text-sm font-medium">MΩ</span>
     </div>
   </div>
 );
}


// --- Komponen RekomendasiCheckbox ---




// --- Komponen utama ---
export default function EditInvestigasi() {
 const [sidebarOpen, setSidebarOpen] = useState(false);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const navigate = useNavigate();
 const { id } = useParams(); // Ambil ID investigasi dari route


 const [formData, setFormData] = useState({
   noSeri: "",
   daya: "",
   fasa: "",
   merk: "",
   kodeTrafo: "",
   tahunProduksi: "",
   tanggalKerusakan: "",
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
   // ... tambahkan semua field megger dan tegangan
   merggerR_S_Primer: "",
   merggerR_T_Primer: "",
   merggerS_T_Primer: "",
   // ... dst
   penyebabKerusakan: "",
   rekomendasi: "",
   supervisorOperasi: "",
   pemeriksaUP3: "",
   asmanJaringan: "",
 });


 // --- Fetch data investigasi saat mount ---
 useEffect(() => {
   if (!id) return;
   const fetchInvestigasi = async () => {
     setLoading(true);
     try {
       const response = await axios.get(`${API_URL}/investigasi/${id}`);
       setFormData(response.data); // asumsi API mengembalikan objek sesuai field formData
     } catch (err) {
       console.error(err);
       setError("Gagal mengambil data investigasi. Pastikan ID benar.");
       Swal.fire({
         icon: "error",
         title: "Gagal!",
         text: "Tidak dapat mengambil data investigasi",
         confirmButtonColor: "#ef4444",
       });
     } finally {
       setLoading(false);
     }
   };
   fetchInvestigasi();
 }, [id]);


 // --- Handle input ---
 const handleInputChange = (e) => {
   const { name, value, type, checked } = e.target;
   setFormData((prevData) => ({
     ...prevData,
     [name]: type === "checkbox" ? checked : value,
   }));
 };


 // --- Handle submit (update) ---
 const handleSubmit = async (e) => {
   e.preventDefault();
   setLoading(true);
   setError(null);


   try {
     const response = await axios.put(`${API_URL}/investigasi/${id}`, formData, {
       headers: {
         "Content-Type": "application/json",
       },
     });


     if (response.status === 200) {
       Swal.fire({
         icon: "success",
         title: "Berhasil!",
         text: "Data investigasi berhasil diperbarui",
         confirmButtonColor: "#3b82f6",
       });
       navigate("/investigasi");
     }
   } catch (err) {
     console.error(err);
     setError("Gagal memperbarui data investigasi");
     Swal.fire({
       icon: "error",
       title: "Gagal!",
       text: "Tidak dapat memperbarui data",
       confirmButtonColor: "#ef4444",
     });
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
         <h1 className="text-xl md:text-2xl font-bold">Edit Investigasi Trafo</h1>
         <button onClick={() => setSidebarOpen(true)} className="p-2 rounded hover:bg-gray-200 md:hidden">
           <HiOutlineBars3 className="text-2xl" />
         </button>
       </div>


       {error && (
         <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start">
           <span className="text-xl mr-2">⚠️</span>
           <div><strong>Error:</strong> {error}</div>
         </div>
       )}


       {loading ? (
         <div className="text-center mt-20">Loading...</div>
       ) : (
         <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
           {/* --- FORM FIELD IDENTITAS TRAFO (contoh) --- */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <InputField label="No. Seri" name="noSeri" value={formData.noSeri} onChange={handleInputChange} />
             <InputField label="Kode Trafo" name="kodeTrafo" value={formData.kodeTrafo} onChange={handleInputChange} />
             <InputField label="Merk" name="merk" value={formData.merk} onChange={handleInputChange} />
             <InputField label="Daya" name="daya" value={formData.daya} onChange={handleInputChange} />
             <InputField label="Tahun Produksi" name="tahunProduksi" value={formData.tahunProduksi} onChange={handleInputChange} />
            <InputField 
                label="Tanggal & Waktu Kerusakan" 
                name="tanggalKerusakan" 
                type="datetime-local" 
                value={formData.tanggalKerusakan} 
                onChange={handleInputChange} 
              />
           </div>


           {/* --- HASIL PEMERIKSAAN VISUAL --- */}
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
            
              {/* --- BARIS 1: TERMINASI BUSHING PRIMER --- */}
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


              {/* --- BARIS 2: TERMINASI BUSHING SEKUNDER --- */}
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


              {/* --- BARIS 3: BUSHING PRIMER --- */}
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


              {/* --- BARIS 4: BUSHING SEKUNDER --- */}
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




              {/* --- BARIS 5: SEAL BUSHING PRIMER --- */}
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




              {/* --- BARIS 6: SEAL BUSHING SEKUNDER --- */}
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




              {/* --- BARIS 7: TAP CHANGER --- */}
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




              {/* --- BARIS 8: KONSERVATOR (ADA/TIDAK)** --- */}
              <tr className="border-b">
                <td className="p-2 text-center">8</td>
                <td className="p-2">KONSERVATOR (ADA/TIDAK)**</td>
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




              {/* --- BARIS 9: SEAL BODY TRAFO --- */}
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




              {/* --- BARIS 10: TANGKI TRAFO --- */}
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




              {/* --- BARIS 11: CAT FISIK --- */}
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




              {/* --- BARIS 12: KRAN SALURAN KELUAR MINYAK --- */}
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




              {/* --- BARIS 13: ISOLASI KERTAS --- */}
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




              {/* --- BARIS 14: KUMPARAN PRIMER --- */}
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




              {/* --- BARIS 15: KUMPARAN SEKUNDER --- */}
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




              {/* --- BARIS 16: INTI BESI --- */}
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




              {/* --- BARIS 17: WARNA MINYAK --- */}
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




              {/* --- BARIS 18: KANDUNGAN AIR DALAM MINYAK --- */}
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




        {/* --- HASIL PENGUKURAN MEGGER --- */}
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
              <h4 className="font-medium text-xs text-center underline mt-2 mb-1">Seknder-Body</h4>
              <MeggerInput label="r - B" name="megger_r_B_Ground_SB" value={formData.megger_r_B_Ground_SB} onChange={handleInputChange} />
              <MeggerInput label="s - B" name="megger_s_B_Ground_SB" value={formData.megger_s_B_Ground_SB} onChange={handleInputChange} />
              <MeggerInput label="t - B" name="megger_t_B_Ground_SB" value={formData.megger_t_B_Ground_SB} onChange={handleInputChange} />
              <MeggerInput label="n - B" name="megger_n_B_Ground_SB" value={formData.megger_n_B_Ground_SB} onChange={handleInputChange} />
            </div>




          </div>
        </div>




        {/* --- TEGANGAN TEMBUS MINYAK --- */}
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




        {/* --- TTR --- */}
        <div className="border-b pb-4">
          <h2 className="font-semibold text-lg text-gray-800 mb-3">Turn Test Ratio (TTR)</h2>
          <div className="p-3 bg-gray-50 rounded-lg space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">POSISI TAP CHANGER</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <InputField label="1" name="posisiTapChanger1" value={formData.posisiTapChanger1} onChange={handleInputChange} />
              <InputField label="2" name="posisiTapChanger2" value={formData.posisiTapChanger2} onChange={handleInputChange} />
              <InputField label="3" name="posisiTapChanger3" value={formData.posisiTapChanger3} onChange={handleInputChange} />
               {/*<InputField label="4" name="ttr_4" value={formData.ttr_4} onChange={handleInputChange} />
              <InputField label="5" name="ttr_5" value={formData.ttr_5} onChange={handleInputChange} />*/}
            </div>
          </div>
        </div>




       {/* --- KESIMPULAN --- */}
<div className="border-b pb-4">
 <h2 className="font-semibold text-lg text-gray-800 mb-3">
   Kesimpulan Hasil Investigasi
 </h2>


 <div className="p-3 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">


   {/* Penyebab Kerusakan */}
   <div>
     <InputField
       label="Penyebab Kerusakan/Gangguan"
       name="penyebabKerusakan"
       value={formData.penyebabKerusakan}
       onChange={handleInputChange}
       className="w-full"
     />
   </div>


   {/* Rekomendasi */}
   <div>
     <label className="block text-sm font-medium text-gray-700 mb-2">
       Rekomendasi
     </label>


     <div className="space-y-2">


       {/* TRAFO GARANSI */}
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


       {/* TRAFO REKONDISI */}
       <label className="flex items-center gap-2 p-2 bg-white rounded-md border border-gray-300 hover:bg-gray-50 cursor-pointer">
         <input
           type="radio"
           name="rekomendasi"
           value="TRAFO DIREKONDISI"
           checked={formData.rekomendasi === "TRAFO DIREKONDISI"}
           onChange={handleInputChange}
           className="w-4 h-4 text-blue-600"
         />
         <span className="font-medium text-gray-700">TRAFO DIREKONDISI</span>
       </label>


       {/* TRAFO LIMBAH */}
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


             {/* --- TANDA TANGAN --- */}
        <div>
          <h2 className="font-semibold text-lg text-gray-800 mb-3">Penanggung Jawab</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField label="Supervisor Operasi" name="supervisorOperasi" value={formData.supervisorOperasi} onChange={handleInputChange} />
              <InputField label="Pengawas Pekerjaan" name="pemeriksaUP3" value={formData.pemeriksaUP3} onChange={handleInputChange} />
              <InputField label="Mengetahui (Asman Jaringan)" name="asmanJaringan" value={formData.asmanJaringan} onChange={handleInputChange} />
          </div>
        </div>


           {/* --- Tambahkan semua field megger, visual, kesimpulan, rekomendasi dsb --- */}


           <div className="flex justify-end mt-6 gap-4">
             <button type="button" onClick={() => navigate("/investigasi")} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-8 rounded-lg shadow-md">
               Batal
             </button>
             <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg shadow-md">
               {loading ? "Menyimpan..." : "Simpan"}
             </button>
           </div>
         </form>
       )}
     </main>
   </div>
 );
}



