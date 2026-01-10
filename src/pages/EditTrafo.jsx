import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { HiOutlineBars3 } from "react-icons/hi2";
import SidebarAdmin from "../components/SidebarAdmin";

// Komponen input text
function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
        required
      />
    </div>
  );
}

export default function EditTrafo() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { kodegardu } = useParams();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    kodegi: "",
    kodepenyul: "",
    alamatgardu: "",
  });
  const [loading, setLoading] = useState(true);

  // Ambil data trafo
  useEffect(() => {
    const fetchTrafo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/data-trafo/${kodegardu}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          kodegi: response.data.kodegi || "",
          kodepenyul: response.data.kodepenyul || "",
          alamatgardu: response.data.alamatgardu || "",
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Data trafo tidak ditemukan",
        }).then(() => navigate("/manajemen-trafo"));
      } finally {
        setLoading(false);
      }
    };
    fetchTrafo();
  }, [kodegardu, navigate, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/data-trafo/${kodegardu}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data trafo berhasil diperbarui!",
        showConfirmButton: true,
        timer: 1500,
      }).then(() => navigate("/manajemen-trafo"));
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat memperbarui data trafo.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="flex w-screen h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-white flex-col justify-between shadow-lg">
        <SidebarAdmin active="trafo" />
      </aside>

      {/* Sidebar Responsif */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-white flex-col justify-between shadow-lg">
            <SidebarAdmin active="trafo" close={() => setSidebarOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Edit Trafo</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded hover:bg-gray-200 md-hidden"
          >
            <HiOutlineBars3 className="text-2xl" />
          </button>
        </div>

        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Kode GI"
              name="kodegi"
              value={formData.kodegi}
              onChange={handleInputChange}
            />
            <InputField
              label="Kode Penyulang"
              name="kodepenyul"
              value={formData.kodepenyul}
              onChange={handleInputChange}
            />
            <InputField
              label="Alamat Gardu"
              name="alamatgardu"
              value={formData.alamatgardu}
              onChange={handleInputChange}
            />

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => navigate("/manajemen-trafo")}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 mr-2"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
