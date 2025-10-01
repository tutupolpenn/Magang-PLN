// src/components/Sidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import plnLogo from "../assets/plnLogo.png";
import {
  HiOutlineHome,
  HiOutlineDocumentText,
  HiOutlineWrench,
  HiOutlineCog6Tooth,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineSignal,
  HiOutlineUserGroup,
} from "react-icons/hi2";

export default function Sidebar({ close, active }) {
  const navigate = useNavigate();

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
            onClick={() => navigate("/dashboard")}
          />
          <MenuButton
            icon={<HiOutlineDocumentText />}
            label="Pelaporan Kerusakan"
            active={active === "pelaporan"}
            onClick={() => navigate("/pelaporan")}
          />
          <MenuButton
            icon={<HiOutlineWrench />}
            label="Perbaikan Trafo"
            active={active === "perbaikan"}
            onClick={() => navigate("/perbaikan-trafo")}
          />
          <MenuButton
            icon={<HiOutlineSignal />}
            label="Pengoperasian Jaringan"
            active={active === "pengoperasian"}
            onClick={() => navigate("/pengoperasian-jaringan")}
          />
          <MenuButton
            icon={<HiOutlineCog6Tooth />}
            label="Pemeriksaan Jaringan"
            active={active === "pemeriksaan"}
            onClick={() => navigate("/pemeriksaan-jaringan")}
          />
          <MenuButton
            icon={<HiOutlineUserGroup />}
            label="Manajemen User"
            active={active === "manajemen"}
            onClick={() => navigate("/manajemen-user")}
          />
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={close}
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
