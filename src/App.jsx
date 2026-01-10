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
import FormBeritaAcara from "./pages/FormPemeriksaan";
import ManajemenUser from "./pages/ManajemenUser";
import EditUser from "./pages/EditUser";
import Register from "./pages/AddUser";
import CetakBeritaAcara from "./pages/CetakBeritaAcara";
import EditPemeriksaan from "./pages/EditPemeriksaan";
import EditPengoperasian from "./pages/EditPengoprasian";
import EditPelaporan from "./pages/EditPelaporan";
import CetakLaporanKerusakan from "./pages/CetakLaporanKerusakan";
import Perbaikan from "./pages/Perbaikan";
import LoginAdmin from "./pages/Admin_Login";
import DashboardAdmin from "./pages/Admin_Dashboard";
import PelaporanAdmin from "./pages/Admin_Pelaporan";
import PerbaikanAdmin from "./pages/Admin_Perbaikan";
import PengoperasianJaringanAdmin from "./pages/Admin_PengoprasianJaringan";
import ManajemenTrafo from "./pages/ManajemenTrafo";
import AddTrafo from "./pages/AddTrafo";
import EditTrafo from "./pages/EditTrafo";
//import CetakHasilTest from "./pages/CetakHasilTest";
import Investigasi from "./pages/investigasi";
import FormInvestigasi from "./pages/FormInvestigasi";
import EditInvestigasi from "./pages/EditInvestigasi";
import EditPerbaikan from "./pages/EditPerbaikan";
import CetakInvestigasi from "./pages/Cetak_investigasi";
import CetakPengoperasian from "./pages/CetakPengoprasian";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login bebas diakses */}
        <Route path="/" element={<Login />} />
        <Route path="/login-admin" element={<LoginAdmin />} />

        {/* Semua route lain dilindungi */}
        <Route
          path="/dashboard-admin"
          element={
            <ProtectedRoute>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pelaporan-admin"
          element={
            <ProtectedRoute>
              <PelaporanAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perbaikan-admin"
          element={
            <ProtectedRoute>
              <PerbaikanAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pengoperasian-jaringan-admin"
          element={
            <ProtectedRoute>
              <PengoperasianJaringanAdmin />
            </ProtectedRoute>
          }
        />
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
          path="/cetak-laporan-kerusakan/:id"
          element={
            <ProtectedRoute>
              <CetakLaporanKerusakan />
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
          path="/edit-pengoperasian/:id"
          element={
            <ProtectedRoute>
              <EditPengoperasian />
            </ProtectedRoute>
          }
        />  
        <Route
          path="/cetak-pengoperasian/:id"
          element={
            <ProtectedRoute>
              <CetakPengoperasian />
            </ProtectedRoute>
          }
        />  
        <Route
          path="/investigasi"
          element={
            <ProtectedRoute>
              <Investigasi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/investigasi/input/:laporanId"
          element={
            <ProtectedRoute>
              <FormInvestigasi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-investigasi/:id"
          element={
            <ProtectedRoute>
              <EditInvestigasi />
            </ProtectedRoute>
          }
        />       
        <Route
          path="/cetak-investigasi/:id"
          element={
            <ProtectedRoute>
              <CetakInvestigasi />
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
        <Route
          path="/form-pemeriksaan"
          element={
            <ProtectedRoute>
              <FormBeritaAcara />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-pemeriksaan/:id"
          element={
            <ProtectedRoute>
              <EditPemeriksaan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manajemen-user-admin"
          element={
            <ProtectedRoute>
              <ManajemenUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-user/:id"
          element={
            <ProtectedRoute>
              <EditUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-user"
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manajemen-trafo"
          element={
            <ProtectedRoute>
              <ManajemenTrafo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-trafo"
          element={
            <ProtectedRoute>
              <AddTrafo  />
            </ProtectedRoute>
          }
        /> 
        <Route
          path="/edit-trafo/:kodegardu"
          element={
            <ProtectedRoute>
              <EditTrafo  />
            </ProtectedRoute>
          }
        />  
        <Route
          path="/cetak-berita-acara"
          element={
            <ProtectedRoute>
              <CetakBeritaAcara />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-pelaporan/:id"
          element={
            <ProtectedRoute>
              <EditPelaporan />
            </ProtectedRoute>
          }
        />               
        <Route
          path="/perbaikan"
          element={
            <ProtectedRoute>
              <Perbaikan />
            </ProtectedRoute>
          }
        />    
        <Route
          path="/pilihan-perbaikan/:id"
          element={
            <ProtectedRoute>
              <PilihanPerbaikan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-perbaikan/:perbaikanId"
          element={
            <ProtectedRoute>
              <EditPerbaikan />
            </ProtectedRoute>
          }
        />       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
