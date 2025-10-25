import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Pelaporan from "./pages/Pelaporan";
import Login from "./pages/Login";
import FormPelaporan from "./pages/FormPelaporan";
import PilihanPerbaikan from "./pages/PilihanPerbaikan";
import PengoperasianJaringan from "./pages/PengoperasianJaringan";
import FormPengoperasian from "./pages/FormPengoperasian";
import PemeriksaanJaringan from "./pages/PemeriksaanJaringan";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login bebas diakses */}
        <Route path="/" element={<Login />} />

        {/* Semua route lain dilindungi */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pelaporan"
          element={
            <ProtectedRoute>
              <Pelaporan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/form-pelaporan"
          element={
            <ProtectedRoute>
              <FormPelaporan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pilihan-perbaikan"
          element={
            <ProtectedRoute>
              <PilihanPerbaikan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pengoperasian-jaringan"
          element={
            <ProtectedRoute>
              <PengoperasianJaringan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/form-pengoperasian"
          element={
            <ProtectedRoute>
              <FormPengoperasian />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pemeriksaan-jaringan"
          element={
            <ProtectedRoute>
              <PemeriksaanJaringan />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
