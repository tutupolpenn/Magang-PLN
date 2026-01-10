//pages cetakhasiltest
import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { HiOutlineArrowDownTray, HiOutlineArrowLeft } from 'react-icons/hi2';


import Sidebar from '../components/Sidebar';
import HasilTestCetak from '../components/HasilTestCetak';


export default function CetakHasilTest() {
 const navigate = useNavigate();
 const location = useLocation();
 const dataToPrint = location.state?.recordToPrint;


 const componentRef = useRef();


 const handleDownloadPdf = async () => {
   const element = componentRef.current;
   if (!element || !dataToPrint) return;


   const canvas = await html2canvas(element, { scale: 2, useCORS: true });
   const imgData = canvas.toDataURL('image/png');
   const pdf = new jsPDF('p', 'mm', 'a4'); // Ukuran A4
   const pdfWidth = pdf.internal.pageSize.getWidth();
   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;


   let heightLeft = pdfHeight;
   let position = 0;
   const pageHeight = pdf.internal.pageSize.getHeight();


   pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
   heightLeft -= pageHeight;


   while (heightLeft > 0) {
     position = heightLeft - pdfHeight;
     pdf.addPage();
     pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
     heightLeft -= pageHeight;
   }
  
   pdf.save(`Hasil-Test-${dataToPrint?.namaPekerjaan || 'dokumen'}.pdf`);
 };


 if (!dataToPrint) {
   return (
     <div className="flex h-screen flex-col items-center justify-center gap-4">
       <p className="text-xl text-red-500">Gagal memuat data untuk dicetak.</p>
       <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
           Kembali
       </button>
     </div>
   );
 }


 return (
   <div className="flex w-screen min-h-screen bg-gray-100 text-gray-800">
     <aside className="hidden md:flex md:w-64 bg-white flex-col justify-between shadow-lg print:hidden">
       <Sidebar active="pengoperasian" />
     </aside>


     <main className="flex-1 p-4 md:p-6 overflow-auto">
       <div className="mb-6 flex justify-between items-center print:hidden">
           <div>
               <h1 className="text-2xl font-bold">Pratinjau Cetak Dokumen</h1>
               <p className="text-sm text-gray-500">Hasil Test Jaringan Distribusi</p>
           </div>
           <div className="flex gap-2">
               <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">
                   <HiOutlineArrowLeft /> Kembali
               </button>
               <button onClick={handleDownloadPdf} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                   <HiOutlineArrowDownTray /> Unduh PDF
               </button>
           </div>
       </div>
      
       <div className="max-w-4xl mx-auto shadow-2xl">
           <HasilTestCetak ref={componentRef} data={{ fullData: dataToPrint }} />
       </div>
     </main>
   </div>
 );
}

