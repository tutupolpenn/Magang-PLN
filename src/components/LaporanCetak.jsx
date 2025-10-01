// src/components/LaporanCetak.js
import React from "react";

// Menggunakan React.forwardRef agar bisa menerima ref dari komponen induk
export const LaporanCetak = React.forwardRef(({ data }, ref) => {
  if (!data) {
    return null;
  }

  return (
    // 'ref' ditempatkan di sini
    <div ref={ref} className="p-8 font-sans">
      <div className="text-center border-b-2 border-black pb-4 mb-8">
        <h1 className="text-3xl font-bold">BERITA ACARA KERUSAKAN TRAFO</h1>
        <p className="text-lg">No. Dokumen: {data.no}/{data.gardu}/{new Date().getFullYear()}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Detail Laporan</h2>
        <table className="w-full text-left">
          <tbody>
            <tr>
              <td className="font-semibold pr-4 py-1 w-1/4">No Laporan</td>
              <td>: {data.no}</td>
            </tr>
            <tr>
              <td className="font-semibold pr-4 py-1">Tanggal Kerusakan</td>
              <td>: {data.tanggal}</td>
            </tr>
            <tr>
              <td className="font-semibold pr-4 py-1">Gardu Induk</td>
              <td>: {data.gardu}</td>
            </tr>
            <tr>
              <td className="font-semibold pr-4 py-1">Penyulang</td>
              <td>: {data.penyulang}</td>
            </tr>
            <tr>
              <td className="font-semibold pr-4 py-1">Alamat</td>
              <td>: {data.alamat}</td>
            </tr>
            <tr>
              <td className="font-semibold pr-4 py-1">Status</td>
              <td>: <span className="font-bold">{data.status}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-20">
        <p>Demikian Berita Acara ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
        <div className="flex justify-between mt-12">
            <div className="text-center">
                <p>Mengetahui,</p>
                <p className="mt-20">(______________________)</p>
                <p>Supervisor</p>
            </div>
            <div className="text-center">
                <p>Dibuat oleh,</p>
                <p className="mt-20">(______________________)</p>
                <p>Petugas Pelapor</p>
            </div>
        </div>
      </div>
    </div>
  );
});