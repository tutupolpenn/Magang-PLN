import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  HiOutlineBars3,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import SidebarAdmin from "../components/SidebarAdmin";

// Komponen untuk satu baris data di tabel
function UserRow({ user, onEdit, onHapus }) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3 font-medium text-gray-800">{user.name}</td>
      <td className="p-3 text-gray-600">{user.email}</td>
      <td className="p-3 text-gray-600 capitalize">{user.role}</td>
      <td className="p-3 flex items-center justify-end gap-2">
        <button
          onClick={() => onEdit(user.id)}
          className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
          title="Edit"
        >
          <HiOutlinePencil className="w-5 h-5" />
        </button>
        <button
          onClick={() => onHapus(user.id)}
          className="p-2 text-red-600 hover:bg-red-100 rounded-full"
          title="Hapus"
        >
          <HiOutlineTrash className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
}

export default function ManajemenUser() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Ambil data user dari backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        Swal.fire({
          icon: "warning",
          title: "Sesi Habis",
          text: "Sesi login habis, silakan login ulang.",
          confirmButtonText: "OK",
        }).then(() => navigate("/login"));
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat",
          text: "Terjadi kesalahan saat memuat data pengguna.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => navigate("/add-user");
  const handleEdit = (id) => navigate(`/edit-user/${id}`);

  const handleHapus = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin Hapus User?",
      text: "Data user yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "User berhasil dihapus.",
          timer: 1500,
          showConfirmButton: true,
        });
        fetchUsers(); // refresh data
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Gagal menghapus user. Silakan coba lagi.",
        });
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex w-screen h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-white flex-col justify-between shadow-lg">
        <SidebarAdmin active="manajemen" />
      </aside>

      {/* Sidebar responsif */}
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

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold">Manajemen User</h2>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded hover:bg-gray-200 md:hidden"
            >
              <HiOutlineBars3 className="text-2xl" />
            </button>
          </div>
          <button
            onClick={handleAddUser}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2 justify-center w-full sm:w-auto"
          >
            <HiOutlinePlus className="text-lg" /> Tambah User
          </button>
        </div>

        {/* Search bar */}
        <div className="relative w-full max-w-md mb-6">
          <HiOutlineMagnifyingGlass
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tabel User */}
        <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 uppercase">
                <th className="p-3 font-semibold">Nama</th>
                <th className="p-3 font-semibold">Email</th>
                <th className="p-3 font-semibold">Role</th>
                <th className="p-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onEdit={handleEdit}
                    onHapus={handleHapus}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-gray-500">
                    Tidak ada data user.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
