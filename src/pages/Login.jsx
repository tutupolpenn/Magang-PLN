import { useState } from "react";
import { useNavigate } from "react-router-dom";   // 👉 Tambahkan ini
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import plnLogo from "../assets/plnLogo.png";
import bgLogin from "../assets/bgLogin.png";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // 👉 Hook untuk pindah halaman

  // Fungsi submit
  const handleLogin = () => {
    // 👉 Di sini bisa tambahkan validasi login bila perlu
    navigate("/dashboard"); // pindah ke halaman dashboard
  };

  return (
    <div
      className="relative w-screen h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      {/* Overlay gelap */}
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

        {/* Email Input */}
        <input
          type="email"
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
          onClick={handleLogin} // 👉 Klik untuk pindah halaman
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
