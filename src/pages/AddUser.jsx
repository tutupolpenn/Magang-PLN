import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import plnLogo from "../assets/plnLogo.png";
import bgLogin from "../assets/bgLogin.png";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function InputField({ type, placeholder, value, onChange, name, children }) {
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
      {children}
    </div>
  );
}

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

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
      // API register user
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);

      Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil!",
        text: `User "${response.data.user.name}" berhasil diregistrasi.`,
        showConfirmButton: true,
        timer: 2000,
      });

      // redirect setelah sukses
      setTimeout(() => navigate("/manajemen-user-admin"), 2000);
    } catch (error) {
      console.error(error);
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Registrasi Gagal",
          text: error.response.data.message || "Silakan periksa kembali data Anda.",
          confirmButtonColor: "#11ADE6",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Terjadi Kesalahan Server",
          text: "Tidak dapat terhubung ke server. Coba lagi nanti.",
          confirmButtonColor: "#11ADE6",
        });
      }
    }
  };

  return (
    <div
      className="relative w-screen h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      <div className="absolute inset-0 bg-black/20" />

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
          Register Akun Baru
        </h2>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <InputField
            type="text"
            name="name"
            placeholder="Nama Lengkap"
            value={formData.name}
            onChange={handleInputChange}
          />

          <InputField
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
          />

          <InputField
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          >
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-200 hover:text-white transition"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? (
                <HiOutlineEyeSlash className="text-xl" />
              ) : (
                <HiOutlineEye className="text-xl" />
              )}
            </button>
          </InputField>

          <button
            type="submit"
            className="
              w-full mt-4 bg-[#11ADE6]/80 hover:bg-[#11ADE6]
              text-white font-medium py-3 rounded-lg shadow-lg
              transition
            "
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
