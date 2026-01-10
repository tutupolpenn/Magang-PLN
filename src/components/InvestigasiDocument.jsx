import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";

// Register font yang mendukung simbol Omega
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf' },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf', fontWeight: 'bold' },
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 15,
    fontSize: 7,
    fontFamily: "Helvetica",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    border: "2px solid #000",
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    borderRight: "2px solid #000",
    padding: 8,
    width: "33.33%",
  },
  logo: {
    width: 30,
    height: 35,
    marginRight: 6,
  },
  headerText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    lineHeight: 1.3,
  },
  headerCenter: {
    width: "33.33%",
    borderRight: "2px solid #000",
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRight: {
    width: "33.33%",
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  formCode: {
    fontSize: 7,
    marginBottom: 4,
  },
  isoBox: {
    border: "1px solid #000",
    backgroundColor: "#60a5fa",
    color: "#fff",
    padding: "2px 6px",
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
  },
  sectionTitle: {
    backgroundColor: "#bfdbfe",
    textAlign: "center",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    padding: 2,
    border: "1px solid #000",
    marginTop: 6,
    marginBottom: 2,
  },
  table: {
    border: "1px solid #000",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    border: "1px solid #000",
    padding: 2,
    fontSize: 6,
    textAlign: "center",
  },
  tableCellLeft: {
    border: "1px solid #000",
    padding: 2,
    fontSize: 6,
    textAlign: "left",
  },
  tableCellBold: {
    border: "1px solid #000",
    padding: 2,
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  tableCellGray: {
    border: "1px solid #000",
    padding: 2,
    fontSize: 6,
    backgroundColor: "#d1d5db",
  },
  meggerHeader: {
    backgroundColor: "#fef08a",
    fontFamily: "Helvetica-Bold",
    padding: 2,
    fontSize: 6,
    textAlign: "center",
    border: "1px solid #000",
  },
  meggerSubHeader: {
    backgroundColor: "#dbeafe",
    padding: 2,
    fontSize: 5.5,
    textAlign: "center",
    border: "1px solid #000",
  },
  signatureSection: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "space-between",
  },
  signatureBox: {
    width: "30%",
    textAlign: "center",
  },
  signatureName: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    marginTop: 8,
  },
  signatureLine: {
    borderTop: "2px solid #000",
    marginTop: 30,
    paddingTop: 2,
  },
  checkboxRow: {
    flexDirection: "row",
    marginBottom: 3,
    alignItems: "center",
  },
  checkbox: {
    width: 10,
    height: 10,
    border: "2px solid #000",
    marginRight: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    width: 10,
    height: 10,
    border: "2px solid #000",
    marginRight: 4,
    backgroundColor: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    fontSize: 8,
    color: "#fff",
    fontFamily: "Helvetica-Bold",
  },
});

const InvestigasiPDFDocument = ({ data }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleDateString("id-ID", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Helper function untuk mengecek rekomendasi
  const isRekomendasiChecked = (option) => {
    if (!data?.rekomendasi) return false;
    const rekomendasi = String(data.rekomendasi).trim().toLowerCase();
    const optionLower = option.toLowerCase();
    return rekomendasi === optionLower;
  };

  // Simbol Omega yang benar
  const OMEGA = "Ω";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image src="/Logo_PLN.png" style={styles.logo} />
            <View>
              <Text style={styles.headerText}>PT PLN (PERSERO)</Text>
              <Text style={styles.headerText}>UNIT INDUK DIS. JATIM</Text>
              <Text style={styles.headerText}>UP3 PONOROGO</Text>
            </View>
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>FORM INVESTIGASI{"\n"}GANGGUAN TRAFO</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.formCode}>form 7/ER - 3.01</Text>
            <View style={styles.isoBox}>
              <Text>ISO</Text>
            </View>
          </View>
        </View>

        {/* IDENTITAS TRAFO */}
        <Text style={styles.sectionTitle}>IDENTITAS TRAFO</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "4%" }]}>1</Text>
            <Text style={[styles.tableCellLeft, { width: "18%" }]}>NO. SERI</Text>
            <Text style={[styles.tableCellLeft, { width: "28%" }]}>{data?.noSeri || "-"}</Text>
            <Text style={[styles.tableCell, { width: "4%" }]}>4</Text>
            <Text style={[styles.tableCellLeft, { width: "18%" }]}>KODE TRAFO/ULP</Text>
            <Text style={[styles.tableCellLeft, { width: "28%" }]}>{data?.kodeTrafo || "-"}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "4%" }]}>2</Text>
            <Text style={[styles.tableCellLeft, { width: "18%" }]}>DAYA</Text>
            <Text style={[styles.tableCellLeft, { width: "28%" }]}>{data?.daya || "-"}</Text>
            <Text style={[styles.tableCell, { width: "4%" }]}>5</Text>
            <Text style={[styles.tableCellLeft, { width: "18%" }]}>THN PRODUKSI/MERK</Text>
            <Text style={[styles.tableCellLeft, { width: "28%" }]}>{data?.tahunProduksi || "-"}/{data?.merk || "-"}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "4%" }]}>3</Text>
            <Text style={[styles.tableCellLeft, { width: "18%" }]}>FASA</Text>
            <Text style={[styles.tableCellLeft, { width: "28%" }]}>{data?.fasa || "-"}</Text>
            <Text style={[styles.tableCell, { width: "4%" }]}>6</Text>
            <Text style={[styles.tableCellLeft, { width: "18%" }]}>TGL KERUSAKAN</Text>
            <Text style={[styles.tableCellLeft, { width: "28%" }]}>{formatDate(data?.tanggalKerusakan)}</Text>
          </View>
        </View>

        {/* HASIL INVESTIGASI VISUAL */}
        <Text style={styles.sectionTitle}>HASIL INVESTIGASI VISUAL</Text>
        <View style={styles.table}>
          {[
            { no: 1, label: "TERMINASI BUSHING PRIMER", field: "terminasiBushingPrimer", opts: ["Baik", "Bengkok", "Leleh"] },
            { no: 2, label: "TERMINASI BUSHING SEKUNDER", field: "terminasiBushingSekunder", opts: ["Baik", "Bengkok", "Leleh"] },
            { no: 3, label: "BUSHING PRIMER", field: "bushingPrimer", opts: ["Baik", "Retak", "Pecah"] },
            { no: 4, label: "BUSHING SEKUNDER", field: "bushingSekunder", opts: ["Baik", "Retak", "Pecah"] },
            { no: 5, label: "SEAL BUSHING PRIMER", field: "sealBushingPrimer", opts: ["Baik", "Retak", "Bocor"] },
            { no: 6, label: "SEAL BUSHING SEKUNDER", field: "sealBushingSekunder", opts: ["Baik", "Retak", "Bocor"] },
            { no: 7, label: "TAP CHANGER", field: "tapChanger", opts: ["Baik", "Retak", "Rusak"] },
            { no: 8, label: "KONSERVATOR (ADA/TIDAK)**", field: "konektorBushing", opts: ["Baik", "Karatan", "Bocor"] },
            { no: 9, label: "SEAL BODY TRAFO", field: "sealBodyTrafo", opts: ["Baik", "Retak", "Bocor"] },
            { no: 10, label: "TANGKI TRAFO", field: "tangkiTrafo", opts: ["Baik", "Kembung", "Bocor/Rembes"] },
            { no: 11, label: "CAT FISIK", field: "catFisik", opts: ["Baik", "Kotor", "Karatan"] },
            { no: 12, label: "KRAN SALURAN KELUAR MINYAK", field: "kranSaluranKeluarMinyak", opts: ["Baik", "Macet", "Bocor"] },
            { no: 13, label: "ISOLASI KERTAS", field: "isolasiKertas", opts: ["Baik", "Terbakar", "Robek"] },
            { no: 14, label: "KUMPARAN PRIMER", field: "kumparanPrimer", opts: ["Baik", "Putus", "Terkurai"] },
            { no: 15, label: "KUMPARAN SEKUNDER", field: "kumparanSekunder", opts: ["Baik", "Putus", "Terkurai"] },
            { no: 16, label: "INTI BESI", field: "intiBesi", opts: ["Baik", "Rusak", "Terkurai"] },
            { no: 17, label: "WARNA MINYAK", field: "warnaMinyak", opts: ["Jernih", "Kuning", "Coklat"] },
            { no: 18, label: "KANDUNGAN AIR DALAM MINYAK", field: "kandunganAirDalamMinyak", opts: ["Tidak Ada", "Ada"] },
          ].map((item) => (
            <View key={item.no} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "4%" }]}>{item.no}</Text>
              <Text style={[styles.tableCellLeft, { width: "38%", fontFamily: "Helvetica-Bold" }]}>{item.label}</Text>
              <Text style={[styles.tableCell, { width: "3%" }]}>V</Text>
              <Text style={[styles.tableCell, { width: "18%" }]}>
                {data?.[item.field] === item.opts[0] ? item.opts[0].toUpperCase() : ""}
              </Text>
              <Text style={[styles.tableCell, { width: "18%" }]}>
                {data?.[item.field] === item.opts[1] ? `${item.opts[1].toUpperCase()} ⊘` : ""}
              </Text>
              <Text style={[styles.tableCell, { width: "19%" }]}>
                {item.opts[2] && data?.[item.field] === item.opts[2] ? 
                  (item.no === 18 ? item.opts[2].toUpperCase() : `${item.opts[2].toUpperCase()} ⊘`) : ""}
              </Text>
            </View>
          ))}
        </View>

        {/* HASIL PENGUKURAN MEGGER */}
        <Text style={styles.sectionTitle}>HASIL PENGUKURAN MEGGER (M{OMEGA})</Text>
        <View style={styles.table}>
          {/* Header Row 1 */}
          <View style={styles.tableRow}>
            <Text style={[styles.meggerHeader, { width: "23%" }]}>MEGGER (5000 V)</Text>
            <Text style={[styles.meggerHeader, { width: "23%" }]}>TT - GROUND</Text>
            <Text style={[styles.meggerHeader, { width: "23%" }]}>TR - GROUND</Text>
            <Text style={[styles.meggerHeader, { width: "23%" }]}>TT - TR</Text>
            <Text style={[styles.meggerHeader, { width: "8%" }]}>TEG.TEMBUS{"\n"}MINYAK{"\n"}(kV/2.5mm)</Text>
          </View>
          {/* Header Row 2 */}
          <View style={styles.tableRow}>
            <Text style={[styles.meggerSubHeader, { width: "23%" }]}>Primer - Primer</Text>
            <Text style={[styles.meggerSubHeader, { width: "23%" }]}>Sekunder - Sekunder</Text>
            <Text style={[styles.meggerSubHeader, { width: "23%" }]}>Primer - Sekunder</Text>
            <Text style={[styles.meggerSubHeader, { width: "23%" }]}>Primer - Body</Text>
            <Text style={[styles.meggerSubHeader, { width: "8%" }]}></Text>
          </View>

          {/* Data Rows */}
          {/* Row 1 */}
          <View style={styles.tableRow}>
            <View style={{ width: "23%", flexDirection: "row" }}>
              <Text style={[styles.tableCell, { width: "40%" }]}>R-S</Text>
              <Text style={[styles.tableCell, { width: "35%" }]}>{data?.merggerR_S_Primer || "0"}</Text>
              <Text style={[styles.tableCell, { width: "25%" }]}>M{OMEGA}</Text>
            </View>
            <View style={{ width: "23%", flexDirection: "row" }}>
              <Text style={[styles.tableCell, { width: "40%" }]}>r-s</Text>
              <Text style={[styles.tableCell, { width: "35%" }]}>{data?.meggerR_S_Ground_SS || "0"}</Text>
              <Text style={[styles.tableCell, { width: "25%" }]}>M{OMEGA}</Text>
            </View>
            <View style={{ width: "23%", flexDirection: "row" }}>
              <Text style={[styles.tableCell, { width: "40%" }]}>R-r</Text>
              <Text style={[styles.tableCell, { width: "35%" }]}>{data?.meggerR_r_Ground_PS || "2000"}</Text>
              <Text style={[styles.tableCell, { width: "25%" }]}>M{OMEGA}</Text>
            </View>
            <View style={{ width: "23%", flexDirection: "row" }}>
              <Text style={[styles.tableCell, { width: "40%" }]}>R-B</Text>
              <Text style={[styles.tableCell, { width: "35%" }]}>{data?.meggerR_B_Ground_PB || "0"}</Text>
              <Text style={[styles.tableCell, { width: "25%" }]}>M{OMEGA}</Text>
            </View>
            <Text style={[styles.tableCell, { width: "8%" }]}>{data?.teganganTembus_RT || ""}</Text>
          </View>

          {/* Row 2 */}
          <View style={styles.tableRow}>
            <View style={{ width: "23%", flexDirection: "row" }}>
              <Text style={[styles.tableCell, { width: "40%" }]}>R-T</Text>
              <Text style={[styles.tableCell, { width: "35%" }]}>{data?.merggerR_T_Primer || "0"}</Text>
              <Text style={[styles.tableCell, { width: "25%" }]}>M{OMEGA}</Text>
            </View>
            <View style={{ width: "23%", flexDirection: "row" }}>
              <Text style={[styles.tableCell, { width: "40%" }]}>r-t</Text>
              <Text style={[styles.tableCell, { width: "35%" }]}>{data?.meggerR_T_Ground_SS || "0"}</Text>
              <Text style={[styles.tableCell, { width: "25%" }]}>M{OMEGA}</Text>
            </View>
            <View style={{ width: "23%", flexDirection: "row" }}>
              <Text style={[styles.tableCell, { width: "40%" }]}>R-s</Text>
              <Text style={[styles.tableCell, { width: "35%" }]}>{data?.meggerR_s_Ground_PS || "2000"}</Text>
              <Text style={[styles.tableCell, { width: "25%" }]}>M{OMEGA}</Text>
            </View>
            <View style={{ width: "23%", flexDirection: "row" }}>
              <Text style={[styles.tableCell, { width: "40%" }]}>S-B</Text>
              <Text style={[styles.tableCell, { width: "35%" }]}>{data?.meggerS_B_Ground_PB || "0"}</Text>
              <Text style={[styles.tableCell, { width: "25%" }]}>M{OMEGA}</Text>
            </View>
            <Text style={[styles.tableCell, { width: "8%" }]}>{data?.teganganTembus_ST || ""}</Text>
          </View>

          {/* Row 3 */}
          <View style={styles.tableRow}>
            <View style={{ width: "23%", flexDirection: "row" }}>
              <Text style={[styles.tableCell, { width: "40%" }]}>S-T</Text>
              <Text style={[styles.tableCell, { width: "35%" }]}>{data?.merggerS_T_Primer || "0"}</Text>
              <Text style={[styles.tableCell, { width: "25%" }]}>M{OMEGA}</Text>
            </View>
            <View style={{ width: "23%", flexDirection: "row" }}>
              <Text style={[styles.tableCell, { width: "40%" }]}>s-t</Text>
              <Text style={[styles.tableCell, { width: "35%" }]}>{data?.meggerS_T_Ground_SS || "0"}</Text>
              <Text style={[styles.tableCell, { width: "25%" }]}>M{OMEGA}</Text>
            </View>
            <View style={{ width: "23%", flexDirection: "row" }}>
              <Text style={[styles.tableCell, { width: "40%" }]}>R-t</Text>
              <Text style={[styles.tableCell, { width: "35%" }]}>{data?.meggerR_t_Ground_PS || "2000"}</Text>
              <Text style={[styles.tableCell, { width: "25%" }]}>M{OMEGA}</Text>
            </View>
            <View style={{ width: "23%", flexDirection: "row" }}>
              <Text style={[styles.tableCell, { width: "40%" }]}>T-B</Text>
              <Text style={[styles.tableCell, { width: "35%" }]}>{data?.meggerT_B_Ground_PB || "0"}</Text>
              <Text style={[styles.tableCell, { width: "25%" }]}>M{OMEGA}</Text>
            </View>
            <Text style={[styles.tableCell, { width: "8%" }]}>{data?.teganganTembus_TR || ""}</Text>
          </View>

          {/* Row 4 - Additional measurements */}
          <View style={styles.tableRow}>
            <View style={{ width: "23%" }}></View>
            <View style={{ width: "23%", flexDirection: "row" }}>
              <Text style={[styles.tableCell, { width: "40%" }]}>r-n</Text>
              <Text style={[styles.tableCell, { width: "35%" }]}>{data?.meggerR_N_Ground_SS || "0"}</Text>
              <Text style={[styles.tableCell, { width: "25%" }]}>M{OMEGA}</Text>
            </View>
            <View style={{ width: "23%", flexDirection: "row" }}>
              <Text style={[styles.tableCell, { width: "40%" }]}>S-r</Text>
              <Text style={[styles.tableCell, { width: "35%" }]}>{data?.meggerS_r_Ground_PS || "2000"}</Text>
              <Text style={[styles.tableCell, { width: "25%" }]}>M{OMEGA}</Text>
            </View>
            <Text style={[styles.tableCellBold, { width: "23%" }]}>Sekunder - Body</Text>
            <Text style={[styles.tableCell, { width: "8%", fontSize: 5 }]}>RATA-RATA{"\n"}{data?.teganganTembus_RataRata || ""}</Text>
          </View>

          {/* Rows 5-9 for Sekunder measurements */}
          {[
            { ss: ["s-n", data?.meggerS_N_Ground_SS || "0"], ps: ["S-s", data?.meggerS_s_Ground_PS || "2000"], sb: ["r-B", data?.megger_r_B_Ground_SB || "2000"] },
            { ss: ["t-n", data?.meggerT_N_Ground_SS || "0"], ps: ["S-t", data?.meggerS_t_Ground_PS || "2000"], sb: ["s-B", data?.megger_s_B_Ground_SB || "2000"] },
            { ss: ["", ""], ps: ["T-r", data?.meggerT_r_Ground_PS || "2000"], sb: ["t-B", data?.megger_t_B_Ground_SB || "2000"] },
            { ss: ["", ""], ps: ["T-s", data?.meggerT_s_Ground_PS || "2000"], sb: ["n-B", data?.megger_n_B_Ground_SB || "2000"] },
            { ss: ["", ""], ps: ["T-t", data?.meggerT_t_Ground_PS || "2000"], sb: ["", ""] },
          ].map((row, idx) => (
            <View key={idx} style={styles.tableRow}>
              <View style={{ width: "23%" }}></View>
              <View style={{ width: "23%", flexDirection: "row" }}>
                <Text style={[styles.tableCell, { width: "40%" }]}>{row.ss[0]}</Text>
                <Text style={[styles.tableCell, { width: "35%" }]}>{row.ss[1]}</Text>
                <Text style={[styles.tableCell, { width: "25%" }]}>{row.ss[0] ? `M${OMEGA}` : ""}</Text>
              </View>
              <View style={{ width: "23%", flexDirection: "row" }}>
                <Text style={[styles.tableCell, { width: "40%" }]}>{row.ps[0]}</Text>
                <Text style={[styles.tableCell, { width: "35%" }]}>{row.ps[1]}</Text>
                <Text style={[styles.tableCell, { width: "25%" }]}>{row.ps[0] ? `M${OMEGA}` : ""}</Text>
              </View>
              <View style={{ width: "23%", flexDirection: "row" }}>
                <Text style={[styles.tableCell, { width: "40%" }]}>{row.sb[0]}</Text>
                <Text style={[styles.tableCell, { width: "35%" }]}>{row.sb[1]}</Text>
                <Text style={[styles.tableCell, { width: "25%" }]}>{row.sb[0] ? `M${OMEGA}` : ""}</Text>
              </View>
              <View style={{ width: "8%" }}></View>
            </View>
          ))}
        </View>

        {/* TURN TEST RATIO */}
        <Text style={styles.sectionTitle}>TURN TEST RATIO (TTR)</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCellLeft, { width: "30%", fontFamily: "Helvetica-Bold" }]}>POSISI TAP CHANGER</Text>
            <Text style={[styles.tableCell, { width: "23.33%" }]}>{data?.posisiTapChanger1 || "1"}</Text>
            <Text style={[styles.tableCell, { width: "23.33%" }]}>{data?.posisiTapChanger2 || "2"}</Text>
            <Text style={[styles.tableCell, { width: "23.34%" }]}>{data?.posisiTapChanger3 || "3"}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCellLeft, { width: "30%" }]}></Text>
            <Text style={[styles.tableCell, { width: "23.33%" }]}>1</Text>
            <Text style={[styles.tableCell, { width: "23.33%" }]}>2</Text>
            <Text style={[styles.tableCell, { width: "23.34%" }]}>3</Text>
          </View>
        </View>

        {/* KESIMPULAN */}
        <Text style={styles.sectionTitle}>KESIMPULAN HASIL INVESTIGASI</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCellLeft, { width: "50%", fontFamily: "Helvetica-Bold" }]}>PENYEBAB KERUSAKAN/GANGGUAN</Text>
            <Text style={[styles.tableCellLeft, { width: "50%", fontFamily: "Helvetica-Bold" }]}>REKOMENDASI</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCellLeft, { width: "50%", minHeight: 40 }]}>
              {data?.penyebabKerusakan || "-"}
            </Text>
            <View style={{ width: "50%", border: "1px solid #000", padding: 4 }}>
              {/* Checkbox 1: TRAFO GARANSI */}
              <View style={styles.checkboxRow}>
                <View style={isRekomendasiChecked("trafo garansi") ? styles.checkboxChecked : styles.checkbox}>
                  {isRekomendasiChecked("trafo garansi") && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <Text style={{ fontSize: 7 }}>TRAFO GARANSI</Text>
              </View>

              {/* Checkbox 2: TRAFO DIREKONDISI */}
              <View style={styles.checkboxRow}>
                <View style={isRekomendasiChecked("trafo direkondisi") ? styles.checkboxChecked : styles.checkbox}>
                  {isRekomendasiChecked("trafo direkondisi") && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <Text style={{ fontSize: 7 }}>TRAFO DIREKONDISI</Text>
              </View>

              {/* Checkbox 3: TRAFO DINYATAKAN LIMBAH */}
              <View style={styles.checkboxRow}>
                <View style={isRekomendasiChecked("trafo dinyatakan limbah") ? styles.checkboxChecked : styles.checkbox}>
                  {isRekomendasiChecked("trafo dinyatakan limbah") && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <Text style={{ fontSize: 7 }}>TRAFO DINYATAKAN LIMBAH</Text>
              </View>
            </View>
          </View>
        </View>

        {/* TIM INVESTIGASI */}
        <Text style={styles.sectionTitle}>TIM INVESTIGASI</Text>
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={{ fontSize: 6, fontFamily: "Helvetica-Bold" }}>SUPERVISOR OPERASI</Text>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureName}>{data?.supervisorOperasi || ""}</Text>
            </View>
          </View>
          <View style={styles.signatureBox}>
            <Text style={{ fontSize: 6, fontFamily: "Helvetica-Bold" }}>PENGAWAS UP3</Text>           
            <View style={styles.signatureLine}>
              <Text style={styles.signatureName}>{data?.pemeriksaUP3 || ""}</Text>
            </View>
          </View>
          <View style={styles.signatureBox}>
            <Text style={{ fontSize: 6, fontFamily: "Helvetica-Bold" }}>MENGETAHUI,{"\n"}ASMAN JARINGAN</Text>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureName}>{data?.asmanJaringan || ""}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const InvestigasiDocument = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/investigasi/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Response investigasi dari API:", res.data);

        let fetchedData;
        if (res.data.data) {
          fetchedData = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
        } else if (Array.isArray(res.data)) {
          fetchedData = res.data[0];
        } else {
          fetchedData = res.data;
        }

        console.log("Data yang digunakan:", fetchedData);
        console.log("Rekomendasi value:", fetchedData?.rekomendasi);
        
        setData(fetchedData);
      } catch (error) {
        console.error("Gagal mengambil data investigasi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center p-8 text-gray-500">
        Memuat data investigasi...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-8 text-red-500">
        Tidak ada data investigasi ditemukan.
      </div>
    );
  }

  return (
    <PDFViewer width="100%" height="100%" style={{ minHeight: "100vh" }}>
      <InvestigasiPDFDocument data={data} />
    </PDFViewer>
  );
};

export default InvestigasiDocument;