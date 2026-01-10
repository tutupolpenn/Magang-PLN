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
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: "Helvetica",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  logo: {
    width: 35,
    height: 40,
    marginRight: 8,
  },
  headerText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  headerBox: {
    border: "1px solid #000",
    padding: "4px 8px",
    fontSize: 8,
  },
  title: {
    textAlign: "center",
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 3,
  },
  label: {
    width: 120,
    fontSize: 9,
  },
  colon: {
    width: 10,
    fontSize: 9,
  },
  value: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    flex: 1,
  },
  table: {
    marginTop: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
  },
  tableHeader: {
    backgroundColor: "#d3d3d3",
    fontFamily: "Helvetica-Bold",
    padding: 4,
    fontSize: 8,
    textAlign: "center",
  },
  tableCell: {
    border: "1px solid #000",
    padding: 4,
    fontSize: 8,
    textAlign: "center",
  },
  tableCellLeft: {
    border: "1px solid #000",
    padding: 4,
    fontSize: 8,
    textAlign: "left",
    flex: 2,
  },
  twoColumns: {
    flexDirection: "row",
    gap: 10,
  },
  column: {
    flex: 1,
  },
  measurementTable: {
    flexDirection: "row",
    gap: 15,
    marginTop: 8,
  },
  measurementBox: {
    flex: 1,
  },
  measurementTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
  },
  gridTable: {
    marginTop: 3,
  },
  gridRow: {
    flexDirection: "row",
  },
  gridCell: {
    flex: 1,
    padding: 3,
    fontSize: 7,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    fontSize: 9,
  },
  signatureBox: {
    width: "45%",
    textAlign: "center",
  },
  signatureLine: {
    fontSize: 9,
    textAlign: "center",
    marginTop: 50,
    borderTop: "1px solid #000",
    paddingTop: 5,
  },
  checkboxRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  checkLabel: {
    width: 140,
    fontSize: 9,
  },
  checkValue: {
    width: 15,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
});

const LaporanPDFDocument = ({ laporan }) => {
  const renderBooleanCheck = (value) => {
    if (value === 1 || value === "1" || value === true) return "Ya";
    if (value === 0 || value === "0" || value === false || value === "" || value === null || value === undefined) return "Tidak";
    return "Tidak";
  };

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Document>
      {/* HALAMAN 1 */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image src="/Logo_PLN.png" style={styles.logo} />
            <View>
              <Text style={styles.headerText}>PT. PLN (PERSERO)</Text>
              <Text style={styles.headerText}>UNIT INDUK DISTRIBUSI JATIM</Text>
              <Text style={styles.headerText}>UP3 PONOROGO</Text>
            </View>
          </View>
          <View style={styles.headerBox}>
            <Text>Form. G</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>BERITA ACARA KERUSAKAN TRAFO</Text>
        <Text style={styles.subtitle}>
          No. {laporan.id || "___"} / GGN-TRAFO / UP3-PNG / {new Date().getFullYear()}
        </Text>

        {/* DATA GARDU */}
        <Text style={styles.sectionTitle}>DATA GARDU</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Gardu Induk</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>{laporan.kodegi || "-"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ULP</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>{laporan.ulp || "-"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Penyulang</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>{laporan.kodepenyul || "-"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Nomor GTT</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>{laporan.kodegardu || "-"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Alamat</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>{laporan.alamatgardu || "-"}</Text>
        </View>

        {/* I. DATA GARDU TRAFO TIANG */}
        <Text style={styles.sectionTitle}>I. DATA GARDU TRAFO TIANG</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Merk</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>{laporan.merk || "-"}</Text>
          <Text style={[styles.label, { width: 100, textAlign: "right" }]}>Tap Trafo *)</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value, { width: 40 }]}>{laporan.tapTrafo || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Daya</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>{laporan.daya || "-"}</Text>
          <Text style={[styles.label, { width: 100, textAlign: "right" }]}>Tegangan Tap</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value, { width: 40 }]}>{laporan.teganganTap || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Nomor Serie</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>{laporan.nomorSerie || "-"}</Text>
          <Text style={[styles.label, { width: 100, textAlign: "right" }]}>Konstruksi Trafo *)</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value, { width: 40 }]}>{laporan.konstruksiTrafo || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Phasa *)</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>{laporan.fasa || "-"}</Text>
          <Text style={[styles.label, { width: 100, textAlign: "right" }]}>Hubungan Belitan /</Text>
          <Text style={styles.colon}></Text>
          <Text style={[styles.value, { width: 40 }]}></Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tegangan Primer</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>{laporan.teganganPrimer || "-"}</Text>
          <Text style={[styles.label, { width: 100, textAlign: "right" }]}>Vektor</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value, { width: 40 }]}>{laporan.hubunganBelitan || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tegangan Sekunder</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>{laporan.teganganSekunder || "-"}</Text>
          <Text style={[styles.label, { width: 100, textAlign: "right" }]}>Trafo Ex</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value, { width: 40 }]}>{laporan.trafoEk || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Arus Primer</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>{laporan.arusPrimer || "-"}</Text>
          <Text style={[styles.label, { width: 100, textAlign: "right", fontSize: 7 }]}>Nama Bengkel Rekondisi</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value, { width: 40 }]}>{laporan.namaBengkel || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Arus Sekunder</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>{laporan.arusSekunder || "-"}</Text>
          <Text style={[styles.label, { width: 100, textAlign: "right" }]}>Tanggal Operasi</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value, { width: 40 }]}>{laporan.tanggalOperasi ? formatDate(laporan.tanggalOperasi) : "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Impedansi</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>{laporan.impedensi || "-"}</Text>
          <Text style={[styles.label, { width: 100, textAlign: "right", fontSize: 7 }]}>Tgl Pemeriksaan Minyak</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value, { width: 40 }]}>{laporan.platPemeriksaanMinyak || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tahun</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>{laporan.tahun || "-"}</Text>
          <Text style={[styles.label, { width: 100, textAlign: "right" }]}>Trafo *)</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value, { width: 40 }]}>-</Text>
        </View>

        {/* II. DATA KERUSAKAN */}
        <Text style={styles.sectionTitle}>II. DATA KERUSAKAN</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Tanggal Kerusakan</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>
            {laporan.tanggalKerusakan ? formatDate(laporan.tanggalKerusakan) : "-"}
          </Text>
        </View>

        <Text style={{ fontSize: 9, marginTop: 5 }}>Pemeriksaan Kerusakan Komponen</Text>
        
        <View style={styles.checkboxRow}>
          <Text style={styles.checkLabel}>&gt; Tangki Rusak *)</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.checkValue}>{renderBooleanCheck(laporan.tangkiRusak)}</Text>
          <Text style={[styles.checkLabel, { marginLeft: 20 }]}>&gt; Tap Charger *)</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.checkValue}>{renderBooleanCheck(laporan.tapCharger)}</Text>
        </View>

        <View style={styles.checkboxRow}>
          <Text style={styles.checkLabel}>&gt; Bushing TM *)</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.checkValue}>{renderBooleanCheck(laporan.bushingTM)}</Text>
          <Text style={[styles.checkLabel, { marginLeft: 20 }]}>&gt; Minyak Trafo *)</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.checkValue}>{renderBooleanCheck(laporan.minyakTrafo)}</Text>
        </View>

        <View style={styles.checkboxRow}>
          <Text style={styles.checkLabel}>&gt; Bushing TR *)</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.checkValue}>{renderBooleanCheck(laporan.bushingTR)}</Text>
          <Text style={[styles.checkLabel, { marginLeft: 20 }]}>&gt; Stop Kran (In/Out) *)</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.checkValue}>{renderBooleanCheck(laporan.stopKran)}</Text>
        </View>

        {/* Pengukuran Tahanan Isolasi */}
        <Text style={{ fontSize: 9, marginTop: 8 }}>
          Pengukuran Tahanan Isolasi Trafo ( Megger 500 / 1000 V ) :
        </Text>

        <View style={styles.measurementTable}>
          {/* Kumparan Primer */}
          <View style={styles.measurementBox}>
            <Text style={styles.measurementTitle}>KUMPARAN PRIMER ( 1000 V )</Text>
            <View style={styles.gridTable}>
              <View style={styles.gridRow}>
                <Text style={[styles.gridCell, { borderWidth: 1 }]}>P - S = 0</Text>
                <Text style={[styles.gridCell, { borderWidth: 1 }]}>MΩ</Text>
                <Text style={[styles.gridCell, { borderWidth: 1 }]}>R - S = 0</Text>
                <Text style={[styles.gridCell, { borderWidth: 1 }]}>MΩ</Text>
              </View>
              <View style={styles.gridRow}>
                <Text style={[styles.gridCell, { borderWidth: 1 }]}>P - G = 0</Text>
                <Text style={[styles.gridCell, { borderWidth: 1 }]}>MΩ</Text>
                <Text style={[styles.gridCell, { borderWidth: 1 }]}>S - T = 0</Text>
                <Text style={[styles.gridCell, { borderWidth: 1 }]}>MΩ</Text>
              </View>
              <View style={styles.gridRow}>
                <Text style={[styles.gridCell, { borderWidth: 1 }]}>T - G = 0</Text>
                <Text style={[styles.gridCell, { borderWidth: 1 }]}>MΩ</Text>
                <Text style={[styles.gridCell, { borderWidth: 1 }]}>T - R = 0</Text>
                <Text style={[styles.gridCell, { borderWidth: 1 }]}>MΩ</Text>
              </View>
            </View>
          </View>

          {/* Kumparan Sekunder */}
          <View style={styles.measurementBox}>
            <Text style={styles.measurementTitle}>KUMPARAN SEKUNDER ( 500 V )</Text>
            <View style={styles.gridTable}>
              <View style={styles.gridRow}>
                <Text style={[styles.gridCell, { borderWidth: 1 }]}>r - s = 0</Text>
                <Text style={[styles.gridCell, { borderWidth: 1 }]}>MΩ</Text>
              </View>
              <View style={styles.gridRow}>
                <Text style={[styles.gridCell, { borderWidth: 1 }]}>s - t = 0</Text>
                <Text style={[styles.gridCell, { borderWidth: 1 }]}>MΩ</Text>
              </View>
              <View style={styles.gridRow}>
                <Text style={[styles.gridCell, { borderWidth: 1 }]}>t - r = 0</Text>
                <Text style={[styles.gridCell, { borderWidth: 1 }]}>MΩ</Text>
              </View>
            </View>
          </View>
        </View>

        {/* III. PENGUKURAN PENTANAHAN */}
        <Text style={styles.sectionTitle}>III. PENGUKURAN PENTANAHAN</Text>
        <View style={styles.row}>
          <Text style={styles.checkLabel}>&gt; Titik Netral</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value, { width: 30 }]}>{laporan.titikNetral || "-"}</Text>
          <Text style={{ fontSize: 9, width: 15 }}>Ω</Text>
          <Text style={[styles.checkLabel, { marginLeft: 20 }]}>&gt; Lightning Arrester</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value, { width: 30 }]}>{laporan.lightningArrester || "-"}</Text>
          <Text style={{ fontSize: 9, width: 15 }}>Ω</Text>
        </View>
      </Page>

      {/* HALAMAN 2 */}
      <Page size="A4" style={styles.page}>
        {/* IV. DATA PEMBATAS TRAFO */}
        <Text style={styles.sectionTitle}>IV. DATA PEMBATAS TRAFO</Text>
        <View style={styles.twoColumns} wrap={false}>
          {/* Kolom Kiri */}
          <View style={styles.column}>
            {/* Pengaman Primer */}
            <View style={{ marginBottom: 8 }}>
              <Text style={styles.tableHeader}>PENGAMAN PRIMER</Text>
              <View style={styles.gridTable}>
                <View style={styles.gridRow}>
                  <Text style={styles.tableCellLeft}>Phasa R</Text>
                  <Text style={styles.tableCell}>:</Text>
                  <Text style={styles.tableCell}>{laporan.pengamanPrimerPhasaR || "-"}</Text>
                </View>
                <View style={styles.gridRow}>
                  <Text style={styles.tableCellLeft}>Phasa S</Text>
                  <Text style={styles.tableCell}>:</Text>
                  <Text style={styles.tableCell}>{laporan.pengamanPrimerPhasaS || "-"}</Text>
                </View>
                <View style={styles.gridRow}>
                  <Text style={styles.tableCellLeft}>Phasa T</Text>
                  <Text style={styles.tableCell}>:</Text>
                  <Text style={styles.tableCell}>{laporan.pengamanPrimerPhasaT || "-"}</Text>
                </View>
              </View>
            </View>

            {/* Pembatas Sekunder Jurusan A */}
            <View style={{ marginBottom: 8 }}>
              <Text style={styles.tableHeader}>PEMBATAS SEKUNDER JURUSAN " A "</Text>
              <View style={styles.gridTable}>
                <View style={styles.gridRow}>
                  <Text style={styles.tableCellLeft}>Phasa R</Text>
                  <Text style={styles.tableCell}>:</Text>
                  <Text style={styles.tableCell}>{laporan.pengamanSkunderAPhasaR || "-"}</Text>
                </View>
                <View style={styles.gridRow}>
                  <Text style={styles.tableCellLeft}>Phasa S</Text>
                  <Text style={styles.tableCell}>:</Text>
                  <Text style={styles.tableCell}>{laporan.pengamanSkunderAPhasaS || "-"}</Text>
                </View>
                <View style={styles.gridRow}>
                  <Text style={styles.tableCellLeft}>Phasa T</Text>
                  <Text style={styles.tableCell}>:</Text>
                  <Text style={styles.tableCell}>{laporan.pengamanSkunderAPhasaT || "-"}</Text>
                </View>
              </View>
            </View>

            {/* Pembatas Sekunder Jurusan C */}
            <View>
              <Text style={styles.tableHeader}>PEMBATAS SEKUNDER JURUSAN " C "</Text>
              <View style={styles.gridTable}>
                <View style={styles.gridRow}>
                  <Text style={styles.tableCellLeft}>Phasa R</Text>
                  <Text style={styles.tableCell}>:</Text>
                  <Text style={styles.tableCell}>{laporan.pengamanSkunderCPhasaR || "-"}</Text>
                </View>
                <View style={styles.gridRow}>
                  <Text style={styles.tableCellLeft}>Phasa S</Text>
                  <Text style={styles.tableCell}>:</Text>
                  <Text style={styles.tableCell}>{laporan.pengamanSkunderCPhasaS || "-"}</Text>
                </View>
                <View style={styles.gridRow}>
                  <Text style={styles.tableCellLeft}>Phasa T</Text>
                  <Text style={styles.tableCell}>:</Text>
                  <Text style={styles.tableCell}>{laporan.pengamanSkunderCPhasaT || "-"}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Kolom Kanan */}
          <View style={styles.column}>
            {/* Pembatas Sekunder Utama */}
            <View style={{ marginBottom: 8 }}>
              <Text style={styles.tableHeader}>PEMBATAS SEKUNDER UTAMA</Text>
              <View style={styles.gridTable}>
                <View style={styles.gridRow}>
                  <Text style={styles.tableCellLeft}>Phasa R</Text>
                  <Text style={styles.tableCell}>:</Text>
                  <Text style={styles.tableCell}>{laporan.pengamanSkunderPhasaR || "-"}</Text>
                </View>
                <View style={styles.gridRow}>
                  <Text style={styles.tableCellLeft}>Phasa S</Text>
                  <Text style={styles.tableCell}>:</Text>
                  <Text style={styles.tableCell}>{laporan.pengamanSkunderPhasaS || "-"}</Text>
                </View>
                <View style={styles.gridRow}>
                  <Text style={styles.tableCellLeft}>Phasa T</Text>
                  <Text style={styles.tableCell}>:</Text>
                  <Text style={styles.tableCell}>{laporan.pengamanSkunderPhasaT || "-"}</Text>
                </View>
              </View>
            </View>

            {/* Pembatas Sekunder Jurusan B */}
            <View style={{ marginBottom: 8 }}>
              <Text style={styles.tableHeader}>PEMBATAS SEKUNDER JURUSAN " B "</Text>
              <View style={styles.gridTable}>
                <View style={styles.gridRow}>
                  <Text style={styles.tableCellLeft}>Phasa R</Text>
                  <Text style={styles.tableCell}>:</Text>
                  <Text style={styles.tableCell}>{laporan.pengamanSkunderBPhasaR || "-"}</Text>
                </View>
                <View style={styles.gridRow}>
                  <Text style={styles.tableCellLeft}>Phasa S</Text>
                  <Text style={styles.tableCell}>:</Text>
                  <Text style={styles.tableCell}>{laporan.pengamanSkunderBPhasaS || "-"}</Text>
                </View>
                <View style={styles.gridRow}>
                  <Text style={styles.tableCellLeft}>Phasa T</Text>
                  <Text style={styles.tableCell}>:</Text>
                  <Text style={styles.tableCell}>{laporan.pengamanSkunderBPhasaT || "-"}</Text>
                </View>
              </View>
            </View>

            {/* Pembatas Sekunder Jurusan D */}
            <View>
              <Text style={styles.tableHeader}>PEMBATAS SEKUNDER JURUSAN " D "</Text>
              <View style={styles.gridTable}>
                <View style={styles.gridRow}>
                  <Text style={styles.tableCellLeft}>Phasa R</Text>
                  <Text style={styles.tableCell}>:</Text>
                  <Text style={styles.tableCell}>{laporan.pengamanSkunderDPhasaR || "-"}</Text>
                </View>
                <View style={styles.gridRow}>
                  <Text style={styles.tableCellLeft}>Phasa S</Text>
                  <Text style={styles.tableCell}>:</Text>
                  <Text style={styles.tableCell}>{laporan.pengamanSkunderDPhasaS || "-"}</Text>
                </View>
                <View style={styles.gridRow}>
                  <Text style={styles.tableCellLeft}>Phasa T</Text>
                  <Text style={styles.tableCell}>:</Text>
                  <Text style={styles.tableCell}>{laporan.pengamanSkunderDPhasaT || "-"}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.row, { marginTop: 8 }]}>
          <Text style={styles.label}>Merk Saklar Utama / HB</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.value}>{laporan.merkSaklarUtama || "-"}</Text>
          <Text style={[styles.label, { width: 120, textAlign: "right" }]}>Arus Nominal Saklar Utama</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value, { width: 30 }]}>{laporan.arusNominalSaklarUtama || "-"}</Text>
          <Text style={{ fontSize: 9, width: 10 }}>A</Text>
        </View>

        {/* V. KABEL */}
        <Text style={styles.sectionTitle}>V. KABEL</Text>
        <View style={styles.twoColumns} wrap={false}>
          {/* Kabel Incoming */}
          <View style={styles.column}>
            <Text style={[styles.sectionTitle, { marginTop: 0 }]}>KABEL INCOMING</Text>
            <View style={styles.row}>
              <Text style={[styles.label, { width: 80 }]}>Jenis Kabel</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{laporan.jenisKabel || "-"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.label, { width: 80 }]}>Penampang</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={[styles.value, { width: 40 }]}>{laporan.penampangOutgoing || "-"}</Text>
              <Text style={{ fontSize: 9 }}>mm²</Text>
            </View>
          </View>
        </View>

        {/* VI. KETERANGAN */}
        <Text style={styles.sectionTitle} wrap={false}>VI. KETERANGAN / PENYEBAB KERUSAKAN TRAFO</Text>
        <Text style={{ fontSize: 9, marginTop: 5 }} wrap={false}>{laporan.keterangan || ""}</Text>

        {/* Footer Tanda Tangan Halaman 2 */}
        <View style={styles.footer} wrap={false}>
          <View style={styles.signatureBox}>
            <Text>Manager </Text>
            <Text>ULP {laporan.ulp || "Trenggalek"}</Text>
            <Text style={styles.signatureLine}></Text>
          </View>
          <View style={styles.signatureBox}>
            <Text>{laporan.ulp || "Trenggalek"}, {formatDate(laporan.tanggalKerusakan || new Date())}</Text>
            <Text>Petugas Lapangan,</Text>
            <Text style={styles.signatureLine}></Text>
          </View>
        </View>
      </Page>

      {/* HALAMAN 3 - LAMPIRAN FOTO */}
{(laporan.foto1 || laporan.foto2 || laporan.foto3) && (
  <Page size="A4" style={styles.page}>
    <Text style={styles.title}>LAMPIRAN FOTO</Text>
    <Text style={styles.subtitle}>
      Dokumentasi Kerusakan Trafo No. GTT {laporan.kodegardu || "___"}
    </Text>

    <View style={{ marginTop: 20 }}>
      {/* Foto 1 */}
      {laporan.foto1 && (
        <View style={{ marginBottom: 20 }} wrap={false}>
          <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 5 }}>
            Foto 1: 
          </Text>
          <Image 
            src={`http://localhost:5000${laporan.foto1}`}
            style={{ 
              width: "100%", 
              maxHeight: 300,
              objectFit: "contain",
              border: "1px solid #000"
            }} 
          />
        </View>
      )}

      {/* Foto 2 */}
      {laporan.foto2 && (
        <View style={{ marginBottom: 20 }} wrap={false}>
          <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 5 }}>
            Foto 2: 
          </Text>
          <Image 
            src={`http://localhost:5000${laporan.foto2}`}
            style={{ 
              width: "100%", 
              maxHeight: 300,
              objectFit: "contain",
              border: "1px solid #000"
            }} 
          />
        </View>
      )}

      {/* Foto 3 */}
      {laporan.foto3 && (
        <View style={{ marginBottom: 20 }} wrap={false}>
          <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 5 }}>
            Foto 3: 
          </Text>
          <Image 
            src={`http://localhost:5000${laporan.foto3}`}
            style={{ 
              width: "100%", 
              maxHeight: 300,
              objectFit: "contain",
              border: "1px solid #000"
            }} 
          />
        </View>
      )}
    </View>

    {/* Footer dengan timestamp */}
    <View style={{ marginTop: "auto", paddingTop: 20, borderTop: "1px solid #ddd" }}>
      <Text style={{ fontSize: 8, color: "#666", textAlign: "center" }}>
        Dokumen ini digenerate otomatis pada {new Date().toLocaleString("id-ID")}
      </Text>
    </View>
  </Page>
)}

    </Document>
  );
};

const LaporanDocument = () => {
  const { id } = useParams();
  const [laporan, setLaporan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/laporan/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Respons laporan dari API:", res.data);

        const data = res.data.laporan || res.data;
        setLaporan(Array.isArray(data) ? data[0] : data);
      } catch (error) {
        console.error("Gagal mengambil data laporan:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center p-8 text-gray-500">
        Memuat data laporan...
      </div>
    );
  }

  if (!laporan) {
    return (
      <div className="text-center p-8 text-red-500">
        Tidak ada data laporan ditemukan.
      </div>
    );
  }

  return (
    <PDFViewer width="100%" height="100%" style={{ minHeight: "100vh" }}>
      <LaporanPDFDocument laporan={laporan} />
    </PDFViewer>
  );
};

export default LaporanDocument;