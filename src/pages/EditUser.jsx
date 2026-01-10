import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import { HiOutlineBars3 } from "react-icons/hi2";
import SidebarAdmin from "../components/SidebarAdmin";

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

function SelectField({ label, name, value, onChange, children }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
        required
      >
        {children}
      </select>
    </div>
  );
}

export default function EditUser() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({ name: "", email: "", role: "User" });

  const token = localStorage.getItem("token");

  // Ambil data user dari API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "User tidak ditemukan",
        }).then(() => navigate("/manajemen-user"));
      }
    };
    fetchUser();
  }, [id, navigate, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "User berhasil diperbarui!",
        showConfirmButton: true,
        timer: 1500,
      }).then(() => navigate("/manajemen-user"));
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat memperbarui user.",
      });
    }
  };

  return (
    <div className="flex w-screen h-screen bg-gray-100 text-gray-800">
      <aside className="hidden md:flex md:w-64 bg-white flex-col justify-between shadow-lg">
        <SidebarAdmin active="manajemen" />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-white flex-col justify-between shadow-lg">
            <SidebarAdmin active="manajemen" close={() => setSidebarOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}

      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Edit User</h1>
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
              label="Nama Lengkap"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <InputField
              label="Alamat Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <SelectField
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </SelectField>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => navigate("/manajemen-user")}
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
