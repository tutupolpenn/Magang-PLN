import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Pelaporan from "./pages/Pelaporan";
import Login from "./pages/Login";
import FormPelaporan from "./pages/FormPelaporan";
import PilihanPerbaikan from "./pages/PilihanPerbaikan";
import PengoperasianJaringan from "./pages/PengoperasianJaringan";
import FormPengoperasian from "./pages/FormPengoperasian";
import PemeriksaanJaringan from "./pages/PemeriksaanJaringan";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pelaporan" element={<Pelaporan />} />
        <Route path="/form-pelaporan" element={<FormPelaporan />} />
        <Route path="/pilihan-perbaikan" element={<PilihanPerbaikan />} />
        <Route path="/pengoperasian-jaringan" element={<PengoperasianJaringan />} />
        <Route path="/form-pengoperasian" element={<FormPengoperasian />} />
        <Route path="/pemeriksaan-jaringan" element={<PemeriksaanJaringan />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
