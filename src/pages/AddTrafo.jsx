import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import plnLogo from "../assets/plnLogo.png";
import bgLogin from "../assets/bgLogin.png";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function InputField({ type, name, placeholder, value, onChange }) {
  return (
    <div className="relative w-full mb-4">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="
          w-full px-4 py-3
          bg-white/20 text-white placeholder-gray-200
          border border-white/30 rounded-lg
          outline-none focus:ring-2 focus:ring-[#11ADE6]
          transition
        "
      />
    </div>
  );
}

export default function AddTrafo() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    kodegi: "",
    kodepenyul: "",
    kodegardu: "",
    alamatgardu: "",
  });

  const token = localStorage.getItem("token");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/data-trafo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: `Data trafo ${response.data.kodegardu || ""} berhasil ditambahkan.`,
        showConfirmButton: false,
        timer: 2000,
      });

      setTimeout(() => navigate("/manajemen-trafo"), 2000);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data.",
        confirmButtonColor: "#11ADE6",
      });
    }
  };

  return (
    <div
      className="relative w-screen h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      <div className="absolute inset-0 bg-black/30" />

      <div
        className="
          relative z-10 w-[90%] max-w-md
          bg-white/10 backdrop-blur-xl
          border border-white/30 rounded-2xl shadow-2xl
          p-8 flex flex-col items-center
        "
      >
        <img src={plnLogo} alt="PLN Logo" className="h-16 mb-2 drop-shadow-lg" />
        <p className="text-[#11ADE6] font-bold text-lg mb-6">UP3 PONOROGO</p>
        <h2 className="text-2xl font-semibold text-white drop-shadow mb-6">
          Tambah Data Trafo
        </h2>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <InputField
            type="text"
            name="kodegi"
            placeholder="Kode GI"
            value={formData.kodegi}
            onChange={handleInputChange}
          />
          <InputField
            type="text"
            name="kodepenyul"
            placeholder="Kode Penyulang"
            value={formData.kodepenyul}
            onChange={handleInputChange}
          />
          <InputField
            type="text"
            name="kodegardu"
            placeholder="Kode Gardu"
            value={formData.kodegardu}
            onChange={handleInputChange}
          />
          <InputField
            type="text"
            name="alamatgardu"
            placeholder="Alamat Gardu"
            value={formData.alamatgardu}
            onChange={handleInputChange}
          />

          <button
            type="submit"
            className="
              w-full mt-4 bg-[#11ADE6]/80 hover:bg-[#11ADE6]
              text-white font-medium py-3 rounded-lg shadow-lg
              transition
            "
          >
            Simpan
          </button>

          <button
            type="button"
            onClick={() => navigate("/manajemen-trafo-admin")}
            className="
              w-full mt-3 bg-gray-400/50 hover:bg-gray-500/70
              text-white font-medium py-3 rounded-lg shadow
              transition
            "
          >
            Batal
          </button>
        </form>
      </div>
    </div>
  );
}
