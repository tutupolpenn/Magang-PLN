// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Jika belum login, arahkan ke halaman login
    return <Navigate to="/" replace />;
  }

  // Jika ada token, tampilkan halaman yang diminta
  return children;
}
