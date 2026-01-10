import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// DIUBAH: Mengganti nama ikon yang salah
import { HiOutlineArrowDownTray, HiOutlineArrowLeft } from 'react-icons/hi2';


import Sidebar from '../components/Sidebar';
import BeritaAcaraDocument from '../components/BeritaAcaraDocument';


export default function CetakBeritaAcara() {
 const navigate = useNavigate();
 const location = useLocation();
 const dataToPrint = location.state?.recordToPrint;


 const componentRef = useRef();


 const handleDownloadPdf = async () => {
   const element = componentRef.current;
   if (!element) return;


   const canvas = await html2canvas(element, { scale: 2 });
   const imgData = canvas.toDataURL('image/png');
   const pdf = new jsPDF('p', 'mm', 'a4');
   const pdfWidth = pdf.internal.pageSize.getWidth();
   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;


   pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
   pdf.save(`Berita-Acara-${dataToPrint?.namaPekerjaan || 'dokumen'}.pdf`);
 };


 if (!dataToPrint) {
   return (
     <div className="flex h-screen items-center justify-center">
       <p className="text-red-500">Data tidak ditemukan.</p>
       <button onClick={() => navigate(-1)} className="ml-4 px-4 py-2 bg-gray-200 rounded">Kembali</button>
     </div>
   );
 }


 return (
   <div className="flex w-screen min-h-screen bg-gray-100 text-gray-800">
     <aside className="hidden md:flex md:w-64 bg-white flex-col justify-between shadow-lg print:hidden">
       <Sidebar active="pemeriksaan" />
     </aside>


     <main className="flex-1 p-4 md:p-6 overflow-auto">
       <div className="mb-6 flex justify-between items-center print:hidden">
           <div>
               <h1 className="text-2xl font-bold">Pratinjau Dokumen</h1>
               <p className="text-sm text-gray-500">Berita Acara Pemeriksaan Jaringan</p>
           </div>
           <div className="flex gap-2">
               <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">
                   <HiOutlineArrowLeft /> Kembali
               </button>
               <button onClick={handleDownloadPdf} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                   {/* DIUBAH: Menggunakan nama ikon yang benar */}
                   <HiOutlineArrowDownTray /> Unduh PDF
               </button>
           </div>
       </div>
      
       <div className="max-w-4xl mx-auto shadow-2xl">
           <BeritaAcaraDocument ref={componentRef} data={dataToPrint} />
       </div>
     </main>
   </div>
 );
}

