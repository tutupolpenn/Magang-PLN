import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { HiOutlineArrowLeft, HiOutlineDocumentArrowDown } from "react-icons/hi2";

const API_URL = "http://localhost:5000/api";

export default function CetakInvestigasi() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil ID dari params URL atau dari state
        const investigasiId = id || location.state?.recordToPrint?.id;
        
        if (!investigasiId) {
          alert("ID investigasi tidak ditemukan");
          navigate("/investigasi");
          return;
        }

        const response = await axios.get(`${API_URL}/investigasi/${investigasiId}`);
        setData(response.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        alert("Gagal mengambil data investigasi");
        navigate("/investigasi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, location, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const generatePDF = () => {
    if (!data) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    let yPos = 15;

    // Helper functions
    const centerText = (text, y, fontSize = 10, fontStyle = "normal") => {
      doc.setFontSize(fontSize);
      doc.setFont(undefined, fontStyle);
      const textWidth = doc.getTextWidth(text);
      doc.text(text, (pageWidth - textWidth) / 2, y);
    };

    const checkNewPage = (requiredSpace) => {
      if (yPos + requiredSpace > pageHeight - 20) {
        doc.addPage();
        yPos = 15;
        return true;
      }
      return false;
    };

    // ========== HEADER ==========
    doc.setFillColor(173, 216, 230);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 20, "F");
    
    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    doc.text("PT PLN (PERSERO)", margin + 3, yPos + 5);
    doc.text("UNIT INDUK DIS. JATIM", margin + 3, yPos + 9);
    doc.text("UP3 PONOROGO", margin + 3, yPos + 13);
    
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    centerText("FORM INVESTIGASI GANGGUAN TRAFO", yPos + 10, 12, "bold");
    
    doc.setFontSize(8);
    doc.setFont(undefined, "normal");
    doc.text("form 7/ER - 3.01", pageWidth - margin - 30, yPos + 5);
    
    // Logo ISO placeholder
    doc.setFillColor(100, 149, 237);
    doc.rect(pageWidth - margin - 20, yPos + 8, 15, 8, "F");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, "bold");
    doc.text("ISO", pageWidth - margin - 14.5, yPos + 13);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");

    yPos += 25;

    // ========== IDENTITAS TRAFO ==========
    doc.setFillColor(173, 216, 230);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "F");
    doc.setFontSize(10);
    centerText("IDENTITAS TRAFO", yPos + 4, 10, "bold");
    yPos += 8;

    doc.autoTable({
      startY: yPos,
      head: [],
      body: [
        ["1", "NO. SERI", data.noSeri || "-", "4", "KODE TRAFO/ULP", data.kodeTrafo || "-"],
        ["2", "DAYA", data.daya || "-", "5", "THN PRODUKSI/MERK", `${data.tahunProduksi || "-"}/${data.merk || "-"}`],
        ["3", "FASA", data.fasa || "-", "6", "TGL KERUSAKAN", formatDate(data.tanggalKerusakan)]
      ],
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 8, halign: "center" },
        1: { cellWidth: 35, fillColor: [240, 240, 240] },
        2: { cellWidth: 45 },
        3: { cellWidth: 8, halign: "center" },
        4: { cellWidth: 40, fillColor: [240, 240, 240] },
        5: { cellWidth: 45 }
      },
      margin: { left: margin, right: margin }
    });

    yPos = doc.lastAutoTable.finalY + 5;
    checkNewPage(60);

    // ========== HASIL INVESTIGASI VISUAL ==========
    doc.setFillColor(173, 216, 230);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "F");
    centerText("HASIL INVESTIGASI VISUAL", yPos + 4, 10, "bold");
    yPos += 8;

    const getVisualStatus = (status, options) => {
      const result = ["", "", ""];
      if (!status) return result;
      
      options.forEach((opt, idx) => {
        if (status === opt) {
          result[idx] = opt.toUpperCase() + (idx > 0 ? " ⊘" : "");
        }
      });
      return result;
    };

    const visualData = [
      ["1", "TERMINASI BUSHING PRIMER", "V", "BAIK", ...getVisualStatus(data.terminasiBushingPrimer, ["Baik", "Bengkok", "Leleh"]).slice(1)],
      ["2", "TERMINASI BUSHING SEKUNDER", "V", "BAIK", ...getVisualStatus(data.terminasiBushingSekunder, ["Baik", "Bengkok", "Leleh"]).slice(1)],
      ["3", "BUSHING PRIMER", "V", "BAIK", ...getVisualStatus(data.bushingPrimer, ["Baik", "Retak", "Pecah"]).slice(1)],
      ["4", "BUSHING SEKUNDER", "V", "BAIK", ...getVisualStatus(data.bushingSekunder, ["Baik", "Retak", "Pecah"]).slice(1)],
      ["5", "SEAL BUSHING PRIMER", "V", "BAIK", ...getVisualStatus(data.sealBushingPrimer, ["Baik", "Retak", "Bocor"]).slice(1)],
      ["6", "SEAL BUSHING SEKUNDER", "V", "BAIK", ...getVisualStatus(data.sealBushingSekunder, ["Baik", "Retak", "Bocor"]).slice(1)],
      ["7", "TAP CHANGER", "V", "BAIK", data.tapChanger === "Retak" ? "RETAK" : "", data.tapChanger === "Rusak" ? "RUSAK" : ""],
      ["8", "KONEKTOR (ADA/TIDAK)**", "V", "BAIK", ...getVisualStatus(data.konektorBushing, ["Baik", "Karatan", "Bocor"]).slice(1)],
      ["9", "SEAL BODY TRAFO", "V", "BAIK", ...getVisualStatus(data.sealBodyTrafo, ["Baik", "Retak", "Bocor"]).slice(1)],
      ["10", "TANGKI TRAFO", "V", "BAIK", data.tangkiTrafo === "Membung" ? "MEMBUNG" : "", data.tangkiTrafo === "Bocor/Rembes" ? "BOCOR/REMBES" : ""],
      ["11", "CAT FISIK", "V", "BAIK", ...getVisualStatus(data.catFisik, ["Baik", "Kotor", "Karatan"]).slice(1)],
      ["12", "KRAN SALURAN KELUAR MINYAK", "V", "BAIK", ...getVisualStatus(data.kranSaluranKeluarMinyak, ["Baik", "Macet", "Bocor"]).slice(1)],
      ["13", "ISOLASI KERTAS", "V", "BAIK", ...getVisualStatus(data.isolasiKertas, ["Baik", "Terbakar", "Robek"]).slice(1)],
      ["14", "KUMPARAN PRIMER", "V", "BAIK", ...getVisualStatus(data.kumparanPrimer, ["Baik", "Putus", "Terkurai"]).slice(1)],
      ["15", "KUMPARAN SEKUNDER", "", "BAIK", "V", data.kumparanSekunder === "Putus" ? "PUTUS" : "", data.kumparanSekunder === "Terkurai" ? "TERKURAI" : ""],
      ["16", "INTI BESI", "V", "BAIK", ...getVisualStatus(data.intiBesi, ["Baik", "Rusak", "Terkurai"]).slice(1)],
      ["17", "WARNA MINYAK", "V", data.warnaMinyak === "Jernih" ? "JERNIH" : "", data.warnaMinyak === "Kuning" ? "KUNING" : "", data.warnaMinyak === "Coklat" ? "COKLAT" : ""],
      ["18", "KANDUNGAN AIR DALAM MINYAK", "V", data.kandunganAirDalamMinyak === "Tidak Ada" ? "TIDAK ADA" : "", data.kandunganAirDalamMinyak === "Ada" ? "ADA" : "", ""]
    ];

    doc.autoTable({
      startY: yPos,
      body: visualData,
      theme: "grid",
      styles: { fontSize: 7, cellPadding: 1.5 },
      columnStyles: {
        0: { cellWidth: 8, halign: "center" },
        1: { cellWidth: 60, fillColor: [240, 240, 240] },
        2: { cellWidth: 8, halign: "center" },
        3: { cellWidth: 30, halign: "center" },
        4: { cellWidth: 30, halign: "center" },
        5: { cellWidth: 35, halign: "center" }
      },
      margin: { left: margin, right: margin }
    });

    yPos = doc.lastAutoTable.finalY + 5;

    // Check if we need a new page for next section
    if (yPos > pageHeight - 80) {
      doc.addPage();
      yPos = 15;
    }

    // ========== HASIL PENGUKURAN MEGGER ==========
    doc.setFillColor(173, 216, 230);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "F");
    centerText("HASIL PENGUKURAN MEGGER (MΩ)", yPos + 4, 10, "bold");
    yPos += 8;

    const meggerHead = [
      [
        { content: "MEGGER (5000 V)", colSpan: 3, styles: { halign: "center", fillColor: [173, 216, 230], fontStyle: "bold" } },
        { content: "TT - GROUND", colSpan: 3, styles: { halign: "center", fillColor: [173, 216, 230], fontStyle: "bold" } },
        { content: "TR - GROUND", colSpan: 3, styles: { halign: "center", fillColor: [173, 216, 230], fontStyle: "bold" } },
        { content: "TT - TR", colSpan: 3, styles: { halign: "center", fillColor: [173, 216, 230], fontStyle: "bold" } },
        { content: "TEGANGAN TEMBUS\nMINYAK (KV/2.5 mm)", rowSpan: 2, styles: { halign: "center", fillColor: [173, 216, 230], fontStyle: "bold", valign: "middle" } }
      ],
      [
        { content: "Primer - Primer", colSpan: 3, styles: { halign: "center", fillColor: [220, 230, 240] } },
        { content: "Sekunder - Sekunder", colSpan: 3, styles: { halign: "center", fillColor: [220, 230, 240] } },
        { content: "Primer - Skunder", colSpan: 3, styles: { halign: "center", fillColor: [220, 230, 240] } },
        { content: "Primer - Body", colSpan: 3, styles: { halign: "center", fillColor: [220, 230, 240] } }
      ]
    ];

    const meggerBody = [
      ["R-S", data.merggerR_S_Primer || "0", "MΩ", "r-s", data.meggerR_S_Ground_SS || "0", "MΩ", "R-r", "2000", "MΩ", "R-B", data.meggerR_B_Ground_PB || "0", "MΩ", data.teganganTembus_RT || ""],
      ["R-T", data.merggerR_T_Primer || "0", "MΩ", "r-t", data.meggerR_T_Ground_SS || "0", "MΩ", "R-s", "2000", "MΩ", "S-B", data.meggerS_B_Ground_PB || "0", "MΩ", ""],
      ["S-T", data.merggerS_T_Primer || "0", "MΩ", "s-t", data.meggerS_T_Ground_SS || "0", "MΩ", "R-t", "2000", "MΩ", "T-B", data.meggerT_B_Ground_PB || "0", "MΩ", data.teganganTembus_ST || ""],
      ["", "", "", "r-n", data.meggerR_N_Ground_SS || "0", "MΩ", "S-r", "2000", "MΩ", { content: "Sekunder - Body", colSpan: 3, styles: { halign: "center", fillColor: [220, 230, 240] } }, "RATA-RATA"],
      ["", "", "", "s-n", data.meggerS_N_Ground_SS || "0", "MΩ", "S-s", "2000", "MΩ", "r-B", data.megger_r_B_Ground_SB || "2000", "MΩ", data.teganganTembus_TR || ""],
      ["", "", "", "t-n", data.meggerT_N_Ground_SS || "0", "MΩ", "S-t", "2000", "MΩ", "s-B", data.megger_s_B_Ground_SB || "2000", "MΩ", ""],
      ["", "", "", "", "", "", "T-r", "2000", "MΩ", "t-B", data.megger_t_B_Ground_SB || "2000", "MΩ", ""],
      ["", "", "", "", "", "", "T-s", "2000", "MΩ", "n-B", data.megger_n_B_Ground_SB || "2000", "MΩ", ""],
      ["", "", "", "", "", "", "T-t", "2000", "MΩ", "", "", "", data.teganganTembus_RataRata || ""]
    ];

    doc.autoTable({
      startY: yPos,
      head: meggerHead,
      body: meggerBody,
      theme: "grid",
      styles: { fontSize: 7, cellPadding: 1.5, halign: "center" },
      columnStyles: {
        0: { cellWidth: 13 },
        1: { cellWidth: 11 },
        2: { cellWidth: 9 },
        3: { cellWidth: 13 },
        4: { cellWidth: 11 },
        5: { cellWidth: 9 },
        6: { cellWidth: 13 },
        7: { cellWidth: 11 },
        8: { cellWidth: 9 },
        9: { cellWidth: 13 },
        10: { cellWidth: 11 },
        11: { cellWidth: 9 },
        12: { cellWidth: 28 }
      },
      margin: { left: margin, right: margin }
    });

    yPos = doc.lastAutoTable.finalY + 5;
    checkNewPage(40);

    // ========== TURN TEST RATIO ==========
    doc.setFillColor(173, 216, 230);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "F");
    centerText("TURN TEST RATIO (TTR)", yPos + 4, 10, "bold");
    yPos += 8;

    doc.autoTable({
      startY: yPos,
      head: [[
        { content: "POSISI TAP CHANGER", styles: { fillColor: [220, 230, 240], halign: "center" } },
        { content: "1", styles: { fillColor: [220, 230, 240], halign: "center" } },
        { content: "2", styles: { fillColor: [220, 230, 240], halign: "center" } },
        { content: "3", styles: { fillColor: [220, 230, 240], halign: "center" } }
      ]],
      body: [
        ["", data.posisiTapChanger1 || "", "", ""],
        ["", "", data.posisiTapChanger2 || "", ""],
        ["", "", "", data.posisiTapChanger3 || ""]
      ],
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 3, halign: "center", minCellHeight: 8 },
      columnStyles: {
        0: { cellWidth: 50, fillColor: [240, 240, 240] },
        1: { cellWidth: 43 },
        2: { cellWidth: 43 },
        3: { cellWidth: 43 }
      },
      margin: { left: margin, right: margin }
    });

    yPos = doc.lastAutoTable.finalY + 5;
    checkNewPage(50);

    // ========== KESIMPULAN ==========
    doc.setFillColor(173, 216, 230);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "F");
    centerText("KESIMPULAN HASIL INVESTIGASI", yPos + 4, 10, "bold");
    yPos += 8;

    doc.autoTable({
      startY: yPos,
      body: [
        [{ content: "PENYEBAB KERUSAKAN/GANGGUAN", styles: { fillColor: [220, 230, 240], fontStyle: "bold" } }],
        [{ content: data.penyebabKerusakan || "FCG putus phasa S T, Hasil ukur tegangan isolasi jelek (Kumparan sekunder putus)", styles: { minCellHeight: 15 } }],
        [{ content: "REKOMENDASI", styles: { fillColor: [220, 230, 240], fontStyle: "bold" } }],
        [{
          content: 
            `${data.rekomendasi === "Trafo Garansi" ? "☑" : "☐"} TRAFO GARANSI\n` +
            `${data.rekomendasi === "Trafo Direkondisi" ? "☑" : "☐"} TRAFO DIREKONDISI\n` +
            `${data.rekomendasi === "Trafo Dinyatakan Limbah" ? "☑" : "☐"} TRAFO DINYATAKAN LIMBAH`,
          styles: { minCellHeight: 15 }
        }]
      ],
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 3 },
      margin: { left: margin, right: margin }
    });

    yPos = doc.lastAutoTable.finalY + 5;
    checkNewPage(50);

    // ========== TIM INVESTIGASI ==========
    doc.setFillColor(173, 216, 230);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 6, "F");
    centerText("TIM INVESTIGASI", yPos + 4, 10, "bold");
    yPos += 8;

    doc.autoTable({
      startY: yPos,
      body: [
        [
          { content: "SUPERVISOR OPERASI", styles: { halign: "center", fillColor: [240, 240, 240], fontStyle: "bold" } },
          { content: "PEMERIKSA UP3", styles: { halign: "center", fillColor: [240, 240, 240], fontStyle: "bold" } }
        ],
        [
          { content: "\n\n\n", styles: { halign: "center", minCellHeight: 20 } },
          { content: "\n\n\n", styles: { halign: "center", minCellHeight: 20 } }
        ],
        [
          { content: data.supervisorOperasi || "ISMAIL ARI K", styles: { halign: "center", fontStyle: "bold" } },
          { content: data.pemeriksaUP3 || "DWI ROCHMAD N", styles: { halign: "center", fontStyle: "bold" } }
        ],
        [
          { 
            content: "MENGETAHUI,\nASMAN JARINGAN\n\n\n\n" + (data.asmanJaringan || "AGUS WIDODO"),
            colSpan: 2,
            styles: { halign: "center", fontStyle: "bold", minCellHeight: 25, fillColor: [240, 240, 240] }
          }
        ]
      ],
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 3 },
      margin: { left: margin, right: margin }
    });

    // Simpan PDF
    const fileName = `Form_Investigasi_${data.noSeri || data.kodeTrafo || data.id}_${new Date().getTime()}.pdf`;
    doc.save(fileName);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat data investigasi...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Data Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">Data investigasi yang Anda cari tidak ditemukan.</p>
          <button
            onClick={() => navigate("/investigasi")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
          >
            <HiOutlineArrowLeft className="text-xl" />
            Kembali ke Daftar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/investigasi")}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
            >
              <HiOutlineArrowLeft className="text-xl" />
              <span className="font-medium">Kembali</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Preview & Cetak PDF
            </h1>
            <div className="w-32"></div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Informasi Trafo</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 font-semibold mb-1">No. Seri</p>
              <p className="text-lg font-bold text-gray-800">{data.noSeri || "-"}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-600 font-semibold mb-1">Kode Trafo</p>
              <p className="text-lg font-bold text-gray-800">{data.kodeTrafo || "-"}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-600 font-semibold mb-1">Merk</p>
              <p className="text-lg font-bold text-gray-800">{data.merk || "-"}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-600 font-semibold mb-1">Daya</p>
              <p className="text-lg font-bold text-gray-800">{data.daya || "-"}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-red-600 font-semibold mb-1">Tanggal Kerusakan</p>
              <p className="text-lg font-bold text-gray-800">{formatDate(data.tanggalKerusakan)}</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
              <p className="text-sm text-indigo-600 font-semibold mb-1">Rekomendasi</p>
              <p className="text-base font-bold text-indigo-800">{data.rekomendasi || "-"}</p>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <button
            onClick={generatePDF}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-5 px-8 rounded-xl shadow-lg flex items-center justify-center gap-4 transition-all transform hover:scale-105 active:scale-95"
          >
            <HiOutlineDocumentArrowDown className="text-3xl" />
            <span className="text-xl">Download Form Investigasi PDF</span>
          </button>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-center text-blue-800 text-sm">
              📄 Klik tombol di atas untuk mengunduh form investigasi dalam format PDF
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}