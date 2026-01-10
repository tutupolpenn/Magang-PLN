import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineBars3, HiOutlinePlus, HiOutlineTrash, HiXMark, HiChevronDown, HiChevronUp } from "react-icons/hi2";
import axios from "axios";
import Swal from "sweetalert2";

// Import components
import Sidebar from "../components/Sidebar";
import InputField from "../components/InputField";

// Collapsible Section Component
const Section = ({ title, children, color = "bg-white", defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`${color} rounded-lg shadow-md mb-6 overflow-hidden`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h2>
        {isOpen ? (
          <HiChevronUp className="w-6 h-6 text-gray-600" />
        ) : (
          <HiChevronDown className="w-6 h-6 text-gray-600" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-6 border-t border-gray-200">
          <div className="pt-6">{children}</div>
        </div>
      )}
    </div>
  );
};

// Helper component untuk input dengan satuan
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

// SUTR Column Component
const SutrColumn = ({ title, jurusanNum, formData, onChange }) => {
  const resistanceFields = ['RN', 'SN', 'TN', 'RS', 'RT', 'ST', 'NBody'];

  return (
    <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
      <InputField
        label={title}
        name={`sutrJenisConductor${jurusanNum}`}
        value={formData[`sutrJenisConductor${jurusanNum}`]}
        onChange={onChange}
      />
      <InputWithUnit
        label="Ukuran"
        name={`sutrUkuran${jurusanNum}`}
        value={formData[`sutrUkuran${jurusanNum}`]}
        onChange={onChange}
        unit="mm2"
      />
      <InputWithUnit
        label="Panjang"
        name={`sutrPanjang${jurusanNum}`}
        value={formData[`sutrPanjang${jurusanNum}`]}
        onChange={onChange}
        unit="kms"
      />
      <div className="pt-3 border-t border-gray-200 space-y-3">
        {resistanceFields.map(field => (
          <InputWithUnit
            key={field}
            label={field.replace('NBody', 'N - BODY').replace(/(R|S|T)/g, '$&-').slice(0, 3)}
            name={`sutr${field}${jurusanNum}`}
            value={formData[`sutr${field}${jurusanNum}`]}
            onChange={onChange}
            unit="M Ohm"
          />
        ))}
      </div>
    </div>
  );
};

// Photo Upload Component
const PhotoUploadComponent = ({ files, setFiles, existingPhotos = [] }) => {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const newPreviews = files.map(file => {
      if (file instanceof File) {
        return {
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          isNew: true
        };
      }
      return null;
    }).filter(Boolean);

    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, [files]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      const isValidType = /\.(jpg|jpeg|png|pdf|doc|docx)$/i.test(file.name);
      const isValidSize = file.size <= 5 * 1024 * 1024;
      
      if (!isValidType) {
        Swal.fire({
          icon: 'warning',
          title: 'File Tidak Valid',
          text: `File ${file.name} tidak valid. Hanya jpg, png, pdf, doc, docx yang diperbolehkan.`,
          confirmButtonColor: '#3b82f6'
        });
        return false;
      }
      if (!isValidSize) {
        Swal.fire({
          icon: 'warning',
          title: 'File Terlalu Besar',
          text: `File ${file.name} terlalu besar. Maksimal 5MB.`,
          confirmButtonColor: '#3b82f6'
        });
        return false;
      }
      return true;
    });

    if (files.length + validFiles.length + existingPhotos.length > 5) {
      Swal.fire({
        icon: 'warning',
        title: 'Terlalu Banyak File',
        text: 'Maksimal 5 file!',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          id="file-upload"
          multiple
          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <HiOutlinePlus className="w-12 h-12 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600">
            Klik untuk upload foto/dokumen
          </span>
          <span className="text-xs text-gray-500 mt-1">
            JPG, PNG, PDF, DOC, DOCX (Max 5MB, Max 5 files)
          </span>
        </label>
      </div>

      {/* Display existing photos */}
      {existingPhotos.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Foto yang sudah ada:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {existingPhotos.map((photo, index) => (
              <div key={`existing-${index}`} className="relative border rounded-lg p-2 bg-white shadow-sm">
                <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  Tersimpan
                </div>
                {/\.(jpg|jpeg|png)$/i.test(photo) ? (
                  <img
                    src={`http://localhost:5000/uploads/${photo}`}
                    alt={photo}
                    className="w-full h-32 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded">
                    <div className="text-center">
                      <div className="text-3xl mb-1">📄</div>
                      <div className="text-xs text-gray-600 px-2 truncate">
                        {photo.split('.').pop().toUpperCase()}
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-2 text-xs text-gray-600 truncate" title={photo}>
                  {photo}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Display new photos */}
      {previews.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">File baru yang akan diupload:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative border rounded-lg p-2 bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                >
                  <HiXMark className="w-4 h-4" />
                </button>
                
                {/\.(jpg|jpeg|png)$/i.test(preview.name) ? (
                  <img
                    src={preview.url}
                    alt={preview.name}
                    className="w-full h-32 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded">
                    <div className="text-center">
                      <div className="text-3xl mb-1">📄</div>
                      <div className="text-xs text-gray-600 px-2 truncate">
                        {preview.name.split('.').pop().toUpperCase()}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-2 text-xs text-gray-600 truncate" title={preview.name}>
                  {preview.name}
                </div>
                <div className="text-xs text-gray-500">
                  {formatFileSize(preview.size)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function EditPengoperasian() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // Data Umum Pekerjaan
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

    // Jaringan SUTR
    sutrJenisLine1: "",
    sutrJenisConductor1: "", sutrUkuran1: "", sutrPanjang1: "",
    sutrRN1: "", sutrSN1: "", sutrTN1: "", sutrRS1: "", sutrRT1: "", sutrST1: "", sutrNBody1: "",
    sutrJenisConductor2: "", sutrUkuran2: "", sutrPanjang2: "",
    sutrRN2: "", sutrSN2: "", sutrTN2: "", sutrRS2: "", sutrRT2: "", sutrST2: "", sutrNBody2: "",
    sutrJenisConductor3: "", sutrUkuran3: "", sutrPanjang3: "",
    sutrRN3: "", sutrSN3: "", sutrTN3: "", sutrRS3: "", sutrRT3: "", sutrST3: "", sutrNBody3: "",
    
    // Jaringan SUTM
    sutmJenisConductor: "", sutmUkuran: "", sutmPanjang: "",
    sutmRG: "", sutmSG: "", sutmTG: "",
    sutmRS: "", sutmRT: "", sutmST: "",

    // Transformator Distribusi 20 KV
    putaranPhasa: "",
    pabrikMerk: "",
    dayaNominal: "",
    noSeri: "",
    hubungan: "",
    tegHubSingkat: "",
    tegPrimer: "",
    tegSekunder: "",
    arusPrimer: "",
    arusNom: "",
    frekuensi: "",
    tahunPembuatan: "",
    pendinginMinyak: "",
    beratMinyak: "",
    beratTotal: "",
    posSadapan: "",

    // Tahanan Isolasi & Tegangan Rendah
    tahananPrimerBody: "",
    tahananSekunderBody: "",
    tahananPrimerPrimer: "",
    tahananSekunderSekunder: "",
    teganganRN: "", teganganSN: "", teganganTN: "",
    teganganRS: "", teganganRT: "", teganganST: "",
    
    // Arrester & Pentanahan
    tahananArresterRG: "", tahananArresterSG: "", tahananArresterTG: "",
    pentanahanNetral: "",
    pentanahanArusBocorNetral: "",
    pentanahanArrester: "",
    pentanahanArusBocorArrester: "",
    pentanahanBody: "",

    // Pengoperasian
    pemeriksaanSutm: "",
    pemeriksaanSutr: "",
    pemeriksaanTrafo: "",

    // Catatan & Petugas
    catatan: "",
    petugasPLN: [""],
    pelaksanaPetugas: "",
  });

  // Fetch data saat komponen dimount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          Swal.fire({
            icon: 'error',
            title: 'Sesi Berakhir',
            text: 'Silakan login kembali',
            confirmButtonColor: '#3b82f6'
          });
          navigate('/login');
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/test-jaringan/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = response.data;

        // Format tanggal untuk input datetime-local
        if (data.tanggalTest) {
          data.tanggalTest = new Date(data.tanggalTest).toISOString().slice(0, 16);
        }
        if (data.tanggalOperasi) {
          data.tanggalOperasi = new Date(data.tanggalOperasi).toISOString().slice(0, 16);
        }

        // Mapping data SUTR dari nested object jika ada
        if (data.sutr) {
          data.sutrJenisConductor1 = data.sutr.jenisConductor || "";
          data.sutrUkuran1 = data.sutr.ukuran || "";
          data.sutrPanjang1 = data.sutr.panjang || "";
          data.sutrRN1 = data.sutr.RN || "";
          data.sutrSN1 = data.sutr.SN || "";
          data.sutrTN1 = data.sutr.TN || "";
          data.sutrRS1 = data.sutr.RS || "";
          data.sutrRT1 = data.sutr.RT || "";
          data.sutrST1 = data.sutr.ST || "";
          data.sutrNBody1 = data.sutr.NBody || "";

          data.sutrJenisConductor2 = data.sutr.jenisConductor2 || "";
          data.sutrUkuran2 = data.sutr.ukuran2 || "";
          data.sutrPanjang2 = data.sutr.panjang2 || "";
          data.sutrRN2 = data.sutr.RN2 || "";
          data.sutrSN2 = data.sutr.SN2 || "";
          data.sutrTN2 = data.sutr.TN2 || "";
          data.sutrRS2 = data.sutr.RS2 || "";
          data.sutrRT2 = data.sutr.RT2 || "";
          data.sutrST2 = data.sutr.ST2 || "";
          data.sutrNBody2 = data.sutr.NBody2 || "";

          data.sutrJenisConductor3 = data.sutr.jenisConductor3 || "";
          data.sutrUkuran3 = data.sutr.ukuran3 || "";
          data.sutrPanjang3 = data.sutr.panjang3 || "";
          data.sutrRN3 = data.sutr.RN3 || "";
          data.sutrSN3 = data.sutr.SN3 || "";
          data.sutrTN3 = data.sutr.TN3 || "";
          data.sutrRS3 = data.sutr.RS3 || "";
          data.sutrRT3 = data.sutr.RT3 || "";
          data.sutrST3 = data.sutr.ST3 || "";
          data.sutrNBody3 = data.sutr.NBody3 || "";
        }

        // Handle petugasPLN array
        if (!Array.isArray(data.petugasPLN)) {
          data.petugasPLN = data.petugasPLN ? [data.petugasPLN] : [""];
        }
        if (data.petugasPLN.length === 0) {
          data.petugasPLN = [""];
        }

        // Handle existing photos
        if (data.lampiran && Array.isArray(data.lampiran)) {
          setExistingPhotos(data.lampiran);
        }

        setFormData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Data',
          text: 'Terjadi kesalahan saat memuat data',
          confirmButtonColor: '#ef4444'
        });
        
        if (error.response && error.response.status === 401) {
          setTimeout(() => {
            localStorage.removeItem('token');
            navigate('/login');
          }, 2000);
        }
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    
    // Validasi form
    if (!formData.namaPekerjaan || !formData.namaPelanggan) {
      Swal.fire({
        icon: 'warning',
        title: 'Data Tidak Lengkap',
        text: 'Mohon isi Nama Pekerjaan dan Nama Pelanggan',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    // Show loading alert
    Swal.fire({
      title: 'Menyimpan Perubahan...',
      text: 'Mohon tunggu sebentar',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    setLoading(true);

    try {
      // Prepare FormData for multipart/form-data
      const submitData = new FormData();

      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'petugasPLN') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key !== 'lampiran' && formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });

      // Append new files only
      uploadedFiles.forEach((file) => {
        submitData.append('lampiran', file);
      });

      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Sesi Berakhir',
          text: 'Silakan login kembali',
          confirmButtonColor: '#3b82f6'
        });
        navigate('/login');
        return;
      }

      // Send to backend
      const response = await axios.put(
        `http://localhost:5000/api/test-jaringan/${id}`,
        submitData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        // Success alert with SweetAlert2
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Data berhasil diperbarui',
          confirmButtonColor: '#10b981',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/pengoperasian-jaringan');
          }
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      
      if (error.response) {
        // Server responded with error
        const errorMsg = error.response.data.message || 'Gagal memperbarui data';
        
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: errorMsg,
          confirmButtonColor: '#ef4444'
        });
        
        if (error.response.status === 401) {
          // Unauthorized - redirect to login
          setTimeout(() => {
            localStorage.removeItem('token');
            navigate('/login');
          }, 2000);
        }
      } else if (error.request) {
        // Request made but no response
        Swal.fire({
          icon: 'error',
          title: 'Koneksi Gagal',
          text: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
          confirmButtonColor: '#ef4444'
        });
      } else {
        // Something else happened
        Swal.fire({
          icon: 'error',
          title: 'Terjadi Kesalahan',
          text: 'Silakan coba lagi',
          confirmButtonColor: '#ef4444'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-screen h-screen bg-gray-100 text-gray-800">
      <aside className="hidden md:flex md:w-64 bg-white flex-col justify-between shadow-lg">
        <Sidebar active="pengoperasian" />
      </aside>
      
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-white flex-col justify-between shadow-lg">
            <Sidebar active="pengoperasian" close={() => setSidebarOpen(false)} />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}
      
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Edit Pengoperasian Jaringan</h1>
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded hover:bg-gray-200 md:hidden">
            <HiOutlineBars3 className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <Section title="Data Umum" color="bg-white" defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <InputField label="PLN UP3" name="plnUp3" value={formData.plnUp3} onChange={handleInputChange} />
              <InputField label="Tanggal Test" name="tanggalTest" type="datetime-local" value={formData.tanggalTest} onChange={handleInputChange} />
              <InputField label="Nama Pekerjaan" name="namaPekerjaan" value={formData.namaPekerjaan} onChange={handleInputChange} />
              <InputField label="Tanggal Operasi" name="tanggalOperasi" type="datetime-local" value={formData.tanggalOperasi} onChange={handleInputChange} />
              <InputField label="Nama Pelanggan" name="namaPelanggan" value={formData.namaPelanggan} onChange={handleInputChange} />
              <InputField label="Pelaksana" name="pelaksana" value={formData.pelaksana} onChange={handleInputChange} />
              <InputField label="Lokasi / Alamat" name="lokasiAlamat" value={formData.lokasiAlamat} onChange={handleInputChange} />
              <InputField label="SPK / PK No. (SUTM)" name="spkSutm" value={formData.spkSutm} onChange={handleInputChange} />
              <InputField label="ULP" name="ulp" value={formData.ulp} onChange={handleInputChange} />
              <InputField label="SPK / PK No. (SUTR)" name="spkSutr" value={formData.spkSutr} onChange={handleInputChange} />
              <InputField label="Gardu Induk" name="garduInduk" value={formData.garduInduk} onChange={handleInputChange} />
              <InputField label="SPK / PK No. (GTT)" name="spkGtt" value={formData.spkGtt} onChange={handleInputChange} />
              <div/>
              <InputField label="Penyulang" name="penyulang" value={formData.penyulang} onChange={handleInputChange} />
              <div/>
              <InputField label="No. GTT" name="noGtt" value={formData.noGtt} onChange={handleInputChange} />
            </div>
          </Section>

          <Section title="Jaringan SUTM test tahanan" color="bg-white" defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 mb-2">
              <h3 className="font-semibold text-gray-800 text-base md:text-lg">Jaringan SUTM</h3>
              <h3 className="font-semibold text-gray-800 text-base md:text-lg md:col-span-2">Test Tahanan Isolasi SUTM</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="p-4 border border-gray-300 rounded-lg space-y-4 bg-white shadow-sm">
                <InputField label="Jenis Conductor" name="sutmJenisConductor" value={formData.sutmJenisConductor} onChange={handleInputChange} />
                <InputWithUnit label="Ukuran" name="sutmUkuran" value={formData.sutmUkuran} onChange={handleInputChange} unit="mm2" />
                <InputWithUnit label="Panjang" name="sutmPanjang" value={formData.sutmPanjang} onChange={handleInputChange} unit="kms" />
              </div>
              <div className="p-4 border border-gray-300 rounded-lg space-y-4 bg-white shadow-sm">
                <InputWithUnit label="R - G" name="sutmRG" value={formData.sutmRG} onChange={handleInputChange} unit="M Ohm"/>
                <InputWithUnit label="S - G" name="sutmSG" value={formData.sutmSG} onChange={handleInputChange} unit="M Ohm"/>
                <InputWithUnit label="T - G" name="sutmTG" value={formData.sutmTG} onChange={handleInputChange} unit="M Ohm"/>
              </div>
              <div className="p-4 border border-gray-300 rounded-lg space-y-4 bg-white shadow-sm">
                <InputWithUnit label="R - S" name="sutmRS" value={formData.sutmRS} onChange={handleInputChange} unit="M Ohm"/>
                <InputWithUnit label="R - T" name="sutmRT" value={formData.sutmRT} onChange={handleInputChange} unit="M Ohm"/>
                <InputWithUnit label="S - T" name="sutmST" value={formData.sutmST} onChange={handleInputChange} unit="M Ohm"/>
              </div>
            </div>
          </Section>

          <Section title="Transformator Distribusi 20 KV" color="bg-white" defaultOpen={true}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-4">
              <h2 className="text-base md:text-lg font-semibold text-gray-800">Transformator Distribusi 20 KV</h2>
              <div className="w-full md:w-1/2">
                <InputField label="Putaran Phasa" name="putaranPhasa" value={formData.putaranPhasa} onChange={handleInputChange} />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="p-4 border border-gray-300 rounded-lg space-y-4 bg-white shadow-sm">
                <InputField label="Pabrik / Merk" name="pabrikMerk" value={formData.pabrikMerk} onChange={handleInputChange} />
                <InputWithUnit label="Daya Nominal Trafo" name="dayaNominal" value={formData.dayaNominal} onChange={handleInputChange} unit="kVA" />
                <InputField label="No Seri" name="noSeri" value={formData.noSeri} onChange={handleInputChange} />
                <InputField label="Hubungan" name="hubungan" value={formData.hubungan} onChange={handleInputChange} />
                <InputWithUnit label="Teg. Hub. Singkat" name="tegHubSingkat" value={formData.tegHubSingkat} onChange={handleInputChange} unit="%" />
              </div>
              <div className="p-4 border border-gray-300 rounded-lg space-y-4 bg-white shadow-sm">
                <InputWithUnit label="Teg. Primer" name="tegPrimer" value={formData.tegPrimer} onChange={handleInputChange} unit="KV" />
                <InputWithUnit label="Teg. Sekunder" name="tegSekunder" value={formData.tegSekunder} onChange={handleInputChange} unit="V" />
                <InputWithUnit label="Arus Nom TM" name="arusPrimer" value={formData.arusPrimer} onChange={handleInputChange} unit="A" />
                <InputWithUnit label="Arus Nom TR" name="arusNom" value={formData.arusNom} onChange={handleInputChange} unit="A" />
                <InputWithUnit label="Frekuensi" name="frekuensi" value={formData.frekuensi} onChange={handleInputChange} />
              </div>
              <div className="p-4 border border-gray-300 rounded-lg space-y-4 bg-white shadow-sm">
                <InputField label="Tahun Pembuatan" name="tahunPembuatan" value={formData.tahunPembuatan} onChange={handleInputChange} />
                <InputField label="Pendingin / Minyak" name="pendinginMinyak" value={formData.pendinginMinyak} onChange={handleInputChange} />
                <InputWithUnit label="Berat Minyak" name="beratMinyak" value={formData.beratMinyak} onChange={handleInputChange} unit="kg/lt" />
                <InputWithUnit label="Berat Total" name="beratTotal" value={formData.beratTotal} onChange={handleInputChange} unit="kg" />
                <InputWithUnit label="Pos Sadapan / Tap" name="posSadapan" value={formData.posSadapan} onChange={handleInputChange} unit="KV" />
              </div>
            </div>
          </Section>

          <Section title="Tahanan isolasi & Tegangan Rendah" color="bg-white" defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-2">
              <h3 className="font-semibold text-gray-800 text-base md:text-lg">Tahanan Isolasi Transformator</h3>
              <h3 className="font-semibold text-gray-800 text-base md:text-lg">Tegangan Rendah</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="p-4 border border-gray-300 rounded-lg space-y-4 bg-white shadow-sm">
                <InputWithUnit label="Primer - Body" name="tahananPrimerBody" value={formData.tahananPrimerBody} onChange={handleInputChange} unit="M Ohm"/>
                <InputWithUnit label="Sekunder - Body" name="tahananSekunderBody" value={formData.tahananSekunderBody} onChange={handleInputChange} unit="M Ohm"/>
                <InputWithUnit label="Primer - Primer" name="tahananPrimerPrimer" value={formData.tahananPrimerPrimer} onChange={handleInputChange} unit="M Ohm"/>
                <InputWithUnit label="Sekunder - Sekunder" name="tahananSekunderSekunder" value={formData.tahananSekunderSekunder} onChange={handleInputChange} unit="M Ohm"/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="p-4 border border-gray-300 rounded-lg space-y-4 bg-white shadow-sm">
                  <InputWithUnit label="R - N" name="teganganRN" value={formData.teganganRN} onChange={handleInputChange} unit="M Ohm"/>
                  <InputWithUnit label="S - N" name="teganganSN" value={formData.teganganSN} onChange={handleInputChange} unit="M Ohm"/>
                  <InputWithUnit label="T - N" name="teganganTN" value={formData.teganganTN} onChange={handleInputChange} unit="M Ohm"/>
                </div>
                <div className="p-4 border border-gray-300 rounded-lg space-y-4 bg-white shadow-sm">
                  <InputWithUnit label="R - S" name="teganganRS" value={formData.teganganRS} onChange={handleInputChange} unit="M Ohm"/>
                  <InputWithUnit label="R - T" name="teganganRT" value={formData.teganganRT} onChange={handleInputChange} unit="M Ohm"/>
                  <InputWithUnit label="S - T" name="teganganST" value={formData.teganganST} onChange={handleInputChange} unit="M Ohm"/>
                </div>
              </div>
            </div>
          </Section>
        
          <Section title="Arrester & Pertanahan" color="bg-white" defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 mb-2">
              <h3 className="font-semibold text-gray-800 text-base md:text-lg">Arrester</h3>
              <h3 className="font-semibold text-gray-800 text-base md:text-lg md:col-span-2">Pentanahan</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="p-4 border border-gray-300 rounded-lg space-y-4 bg-white shadow-sm">
                <InputWithUnit label="R - G" name="tahananArresterRG" value={formData.tahananArresterRG} onChange={handleInputChange} unit="M Ohm"/>
                <InputWithUnit label="S - G" name="tahananArresterSG" value={formData.tahananArresterSG} onChange={handleInputChange} unit="M Ohm"/>
                <InputWithUnit label="T - G" name="tahananArresterTG" value={formData.tahananArresterTG} onChange={handleInputChange} unit="M Ohm"/>
              </div>
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="p-4 border border-gray-300 rounded-lg space-y-4 bg-white shadow-sm">
                  <InputWithUnit label="Netral" name="pentanahanNetral" value={formData.pentanahanNetral} onChange={handleInputChange} unit="Ohm"/>
                  <InputWithUnit label="Arus Bocor" name="pentanahanArusBocorNetral" value={formData.pentanahanArusBocorNetral} onChange={handleInputChange} unit="mA"/>
                  <InputWithUnit label="Arrester" name="pentanahanArrester" value={formData.pentanahanArrester} onChange={handleInputChange} unit="Ohm"/>
                </div>
                <div className="p-4 border border-gray-300 rounded-lg space-y-4 bg-white shadow-sm">
                  <InputWithUnit label="Arus Bocor" name="pentanahanArusBocorArrester" value={formData.pentanahanArusBocorArrester} onChange={handleInputChange} unit="mA"/>
                  <InputWithUnit label="Body" name="pentanahanBody" value={formData.pentanahanBody} onChange={handleInputChange} unit="Ohm"/>
                </div>
              </div>
            </div>
          </Section>

          <Section title="Hasil Pemeriksaan" color="bg-white" defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputWithUnit label="SUTM A3C" name="pemeriksaanSutm" value={formData.pemeriksaanSutm} onChange={handleInputChange} unit="Kms" />
              <InputWithUnit label="SUTR Bund. Konduktor" name="pemeriksaanSutr" value={formData.pemeriksaanSutr} onChange={handleInputChange} unit="Kms" />
              <InputWithUnit label="Trafo Distribusi 20 KV 3 Ph" name="pemeriksaanTrafo" value={formData.pemeriksaanTrafo} onChange={handleInputChange} unit="kVA / Bh" />
            </div>
          </Section>

          <Section title="Catatan & Petugas" color="bg-white" defaultOpen={true}>
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
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Petugas PLN</label>
                {formData.petugasPLN.map((petugas, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Petugas ${index + 1}`}
                      value={petugas}
                      onChange={(e) => handlePetugasChange(index, e)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                    />
                    {formData.petugasPLN.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePetugas(index)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                        aria-label="Hapus Petugas"
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                {formData.petugasPLN.length < 5 && (
                  <button
                    type="button"
                    onClick={addPetugas}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-semibold mt-2"
                  >
                    <HiOutlinePlus className="w-4 h-4" />
                    Tambah Petugas
                  </button>
                )}
              </div>
              <div>
                <InputField label="Pelaksana" name="pelaksanaPetugas" value={formData.pelaksanaPetugas} onChange={handleInputChange} />
              </div>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold mb-4">Lampiran Foto</h3>
              <PhotoUploadComponent files={uploadedFiles} setFiles={setUploadedFiles} existingPhotos={existingPhotos} />
            </div>
          </Section>

          <div className="flex justify-end mt-6">
            <button 
              type="submit"
              disabled={loading}
              className={`${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-bold py-2 px-8 rounded-lg shadow-md transition duration-300`}
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}