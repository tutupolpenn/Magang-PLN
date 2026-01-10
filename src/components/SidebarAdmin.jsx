// src/components/Sidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import plnLogo from "../assets/plnLogo.png";
import {
  HiOutlineHome,
  HiOutlineDocumentText,
  HiOutlineWrench,
  HiOutlineCog6Tooth,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineSignal,
  HiOutlineUserGroup,
  HiOutlineCube,
} from "react-icons/hi2";

export default function SidebarAdmin({ close, active }) {
  const navigate = useNavigate();

  // 👉 Fungsi logout
  const handleLogout = () => {
    Swal.fire({
      title: "Konfirmasi Logout",
      text: "Apakah Anda yakin ingin keluar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        // Hapus token
        localStorage.removeItem("token");

        // Tutup sidebar jika ada fungsi close
        if (close) close();

        // Alert sukses
        Swal.fire({
          title: "Berhasil Logout",
          text: "Anda telah keluar dari aplikasi.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          // Redirect ke halaman utama setelah OK ditekan
          navigate("/");
        });
      }
    });
  };

  return (
    <>
      <div>
        {/* Logo PLN */}
        <div className="p-6 flex flex-col items-center gap-2">
          <img
            src={plnLogo}
            alt="PLN Logo"
            className="h-14 w-auto object-contain"
          />
          <p className="font-bold text-[20px]" style={{ color: "#11ADE6" }}>
            UP3 PONOROGO
          </p>
        </div>

        {/* Menu */}
        <nav className="mt-6 space-y-3 px-4">
          <MenuButton
            icon={<HiOutlineHome />}
            label="Dashboard"
            active={active === "dashboard"}
            onClick={() => navigate("/dashboard-admin")}
          />
           {/*<MenuButton
            icon={<HiOutlineDocumentText />}
            label="Pelaporan Kerusakan"
            active={active === "pelaporan"}
            onClick={() => navigate("/pelaporan-admin")}
          />
          <MenuButton
            icon={<HiOutlineWrench />}
            label="Perbaikan Trafo"
            active={active === "perbaikan"}
            onClick={() => navigate("/perbaikan-admin")}
          />
          <MenuButton
            icon={<HiOutlineSignal />}
            label="Pengoperasian Jaringan"
            active={active === "pengoperasian"}
            onClick={() => navigate("/pengoperasian-jaringan-admin")}
          />
         <MenuButton
            icon={<HiOutlineCog6Tooth />}
            label="Pemeriksaan Jaringan"
            active={active === "pemeriksaan"}
            onClick={() => navigate("/pemeriksaan-jaringan-admin")}
          />*/}
        {/* 🔧 Menu baru: Manajemen Trafo */}
          <MenuButton
            icon={<HiOutlineCube />}
            label="Manajemen Trafo"
            active={active === "trafo"}
            onClick={() => navigate("/manajemen-trafo")}
          />
          <MenuButton
            icon={<HiOutlineUserGroup />}
            label="Manajemen User"
            active={active === "manajemen"}
            onClick={() => navigate("/manajemen-user-admin")}
          />
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          <HiOutlineArrowLeftOnRectangle className="text-xl" />
          Logout
        </button>
      </div>
    </>
  );
}

function MenuButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full gap-3 px-4 py-2 rounded-lg transition 
        ${
          active
            ? "bg-blue-500 text-white shadow"
            : "hover:bg-gray-300 text-gray-700"
        }`}
    >
      <span className="text-xl">{icon}</span>
      {label}
    </button>
  );
}
