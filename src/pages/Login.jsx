import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import plnLogo from "../assets/plnLogo.png";
import bgLogin from "../assets/bgLogin.png";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");       // 👉 state email
  const [password, setPassword] = useState(""); // 👉 state password
  const [error, setError] = useState("");       // 👉 untuk pesan error
  const navigate = useNavigate();

  // Fungsi submit ke backend
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login gagal");
        return;
      }

      // Simpan token ke localStorage
      localStorage.setItem("token", data.token);

      // ✅ SweetAlert2 sukses
      Swal.fire({
        title: "Berhasil!",
        text: "Login berhasil, selamat datang 👋",
        icon: "success",
        confirmButtonText: "Lanjut",
      }).then(() => {
        // Redirect setelah klik tombol
        navigate("/dashboard");
      });

    } catch (err) {
      setError("Terjadi kesalahan koneksi ke server");
    }
  };

  return (
    <div
      className="relative w-screen h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Card Login */}
      <div
        className="
          relative z-10 w-[90%] max-w-md 
          bg-white/10 backdrop-blur-xl
          border border-white/30 
          rounded-2xl shadow-2xl
          p-8 flex flex-col items-center
        "
      >
        {/* Logo */}
        <img src={plnLogo} alt="PLN Logo" className="h-16 mb-2 drop-shadow-lg" />
        <p className="text-[#11ADE6] font-bold text-lg mb-6">UP3 PONOROGO</p>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-white drop-shadow mb-6">Log In</h2>

        {/* Error message */}
        {error && (
          <div className="w-full bg-red-500/70 text-white text-center p-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* Email Input */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@gmail.com"
          className="
            w-full px-4 py-3 mb-4
            bg-white/20 text-white placeholder-gray-200
            rounded-lg outline-none
            focus:ring-2 focus:ring-[#11ADE6]
            border border-white/30
          "
        />

        {/* Password Input */}
        <div className="relative w-full mb-6">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="************"
            className="
              w-full px-4 py-3
              bg-white/20 text-white placeholder-gray-200
              rounded-lg outline-none
              focus:ring-2 focus:ring-[#11ADE6]
              border border-white/30
            "
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-200 hover:text-white transition"
          >
            {showPassword ? (
              <HiOutlineEyeSlash className="text-xl" />
            ) : (
              <HiOutlineEye className="text-xl" />
            )}
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleLogin}
          className="
            w-full bg-[#11ADE6]/80 hover:bg-[#11ADE6]
            transition text-white font-medium py-3
            rounded-lg shadow-lg
          "
        >
          Continue
        </button>
      </div>
    </div>
  );
}
