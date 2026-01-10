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
    padding: 20,
    fontSize: 8,
    fontFamily: "Helvetica",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: "2px solid #000",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    width: 28,
    height: 32,
  },
  headerText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    lineHeight: 1.4,
  },
  formBox: {
    border: "1px solid #000",
    padding: "4px 8px",
    fontSize: 7,
  },
  title: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 8,
    textAlign: "center",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    fontSize: 7,
    marginBottom: 1.5,
  },
  label: {
    width: 110,
  },
  colon: {
    width: 10,
  },
  value: {
    flex: 1,
  },
  section: {
    marginTop: 8,
    marginBottom: 8,
  },
  sectionHeader: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    backgroundColor: "#f0f0f0",
    padding: 3,
    marginBottom: 5,
  },
  gridRow: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 8,
  },
  gridCol: {
    flex: 1,
    border: "1px solid #d0d0d0",
    padding: 5,
  },
  dataLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 6.5,
    marginBottom: 1,
  },
  notesBox: {
    border: "1px solid #000",
    padding: 5,
    minHeight: 30,
    fontSize: 7,
  },
  signatureArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 15,
  },
  signatureCol: {
    flex: 1,
    alignItems: "center",
  },
  signatureLabel: {
    fontSize: 7,
    marginBottom: 35,
    textAlign: "center",
  },
  signatureLine: {
    width: "100%",
    borderTop: "1px solid #000",
    paddingTop: 3,
  },
  signatureName: {
    fontSize: 6.5,
    textAlign: "center",
  },
  peopleList: {
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 30,
  },
  personRow: {
    fontSize: 6.5,
    marginBottom: 1.5,
  },
  lampiranTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  fotoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "flex-start",
  },
  fotoBox: {
    width: "48%",
    marginBottom: 10,
    border: "1px solid #ddd",
    padding: 5,
  },
  fotoImage: {
    width: "100%",
    height: 150,
    objectFit: "cover",
  },
  fotoCaption: {
    fontSize: 6.5,
    textAlign: "center",
    marginTop: 3,
  },
});

const OMEGA = "Ω";

// Helper function untuk normalize array petugasPLN
const normalizePetugasArray = (petugas) => {
  // Jika null atau undefined
  if (!petugas) return [];
  
  // Jika sudah array
  if (Array.isArray(petugas)) {
    return petugas.filter(p => p && p.trim() !== "");
  }
  
  // Jika string JSON
  if (typeof petugas === "string") {
    try {
      const parsed = JSON.parse(petugas);
      if (Array.isArray(parsed)) {
        return parsed.filter(p => p && p.trim() !== "");
      }
      // Jika hasil parse bukan array, jadikan array
      return parsed ? [parsed] : [];
    } catch (e) {
      // Jika gagal parse, coba split by comma
      return petugas.split(',').map(p => p.trim()).filter(p => p !== "");
    }
  }
  
  // Jika object
  if (typeof petugas === "object") {
    return Object.values(petugas).filter(p => p && p.trim() !== "");
  }
  
  return [];
};

const normalizeLampiranList = (lampiran, fallback) => {
  if (Array.isArray(lampiran)) return lampiran;
  if (typeof lampiran === "string") {
    try {
      const parsed = JSON.parse(lampiran);
      if (Array.isArray(parsed)) return parsed;
      if (parsed) return [parsed];
    } catch (err) {
      return [lampiran];
    }
  }
  if (lampiran) return [lampiran];
  if (Array.isArray(fallback)) return fallback;
  if (typeof fallback === "string") {
    try {
      const parsed = JSON.parse(fallback);
      if (Array.isArray(parsed)) return parsed;
      if (parsed) return [parsed];
    } catch (err) {
      return [fallback];
    }
  }
  return [];
};

const resolveLampiranUrl = (item) => {
  if (!item) return "";
  const raw = typeof item === "string" ? item : item.path || item.filename || "";
  if (!raw) return "";
  if (raw.startsWith("http")) return raw;
  if (raw.startsWith("/uploads/")) {
    if (raw.includes("/oprasian-jaringan/") || raw.includes("/test-jaringan/")) {
      return `http://localhost:5000${raw}`;
    }
    return `http://localhost:5000/uploads/oprasian-jaringan/${raw.replace("/uploads/", "")}`;
  }
  if (raw.startsWith("uploads/")) {
    if (raw.includes("oprasian-jaringan/") || raw.includes("test-jaringan/")) {
      return `http://localhost:5000/${raw}`;
    }
    return `http://localhost:5000/uploads/oprasian-jaringan/${raw.replace("uploads/", "")}`;
  }
  return `http://localhost:5000/uploads/oprasian-jaringan/${raw}`;
};

const PengoperasianPDFDocument = ({ data }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleDateString("id-ID", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getDateParts = (dateString) => {
    if (!dateString) return { day: "-", month: "-", year: "-" };
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("id-ID", { month: "long" }),
      year: date.getFullYear(),
    };
  };

  // Normalize petugasPLN dengan debugging
  const petugasList = normalizePetugasArray(data?.petugasPLN);
  console.log("🔍 Debug petugasPLN:", {
    original: data?.petugasPLN,
    normalized: petugasList,
    type: typeof data?.petugasPLN
  });

  const lampiranList = normalizeLampiranList(data?.lampiran, data?.fotoLampiran);
  const lampiranUrls = lampiranList.map(resolveLampiranUrl).filter(Boolean);

  const tanggalParts = getDateParts(data.tanggalTest);

  return (
    <Document>
      {/* Halaman 1 - Hasil Test */}
      <Page size="LEGAL" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image src="/Logo_PLN.png" style={styles.logo} />
            <View>
              <Text style={styles.headerText}>PT PLN (PERSERO)</Text>
              <Text style={styles.headerText}>UNIT INDUK DISTRIBUSI JATIM</Text>
              <Text style={styles.headerText}>UP3 PONOROGO</Text>
            </View>
          </View>
          <View style={styles.formBox}>
            <Text>Form G</Text>
          </View>
        </View>

        {/* Judul */}
        <Text style={styles.title}>HASIL TEST JARINGAN DISTRIBUSI 20 KV</Text>

        {/* Info Umum - 2 Kolom */}
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <View style={{ flex: 1, paddingRight: 20 }}>
            <View style={styles.row}>
              <Text style={styles.label}>PLN UP3</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{data.plnUp3 || "-"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Nama Pekerjaan</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{data.namaPekerjaan || "-"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Nama Pelanggan</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{data.namaPelanggan || "-"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Lokasi / Alamat</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{data.lokasiAlamat || "-"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>SPK/PK (SUTM)</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{data.spkSutm || "-"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>SPK/PK (SUTR)</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{data.spkSutr || "-"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>SPK/PK (GTT)</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{data.spkGtt || "-"}</Text>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.row}>
              <Text style={styles.label}>Tanggal Test</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{formatDate(data.tanggalTest)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Tanggal Operasi</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{formatDate(data.tanggalOperasi)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Pelaksana</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{data.pelaksana || "-"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>ULP</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{data.ulp || "-"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Penyulang</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{data.penyulang || "-"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Gardu Induk</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{data.garduInduk || "-"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>No. GTT</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{data.noGtt || "-"}</Text>
            </View>
          </View>
        </View>

        {/* Jaringan SUTR */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>JARINGAN SUTR & TEST TAHANAN ISOLASI</Text>
          <View style={styles.gridRow}>
            {/* Line 1 */}
            <View style={styles.gridCol}>
              <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", textAlign: "center", marginBottom: 3 }}>
                {data.sutrJenisLine1 || "LINE 1"}
              </Text>
              <View style={styles.dataLine}>
                <Text>Jenis</Text>
                <Text>{data.sutrJenisConductor1 || "-"}</Text>
              </View>
              <View style={styles.dataLine}>
                <Text>Ukuran</Text>
                <Text>{data.sutrUkuran1 ? `${data.sutrUkuran1} mm²` : "-"}</Text>
              </View>
              <View style={styles.dataLine}>
                <Text>Panjang</Text>
                <Text>{data.sutrPanjang1 ? `${data.sutrPanjang1} km` : "-"}</Text>
              </View>
              <View style={{ borderTop: "1px solid #d0d0d0", marginTop: 3, paddingTop: 3 }}>
                <View style={styles.dataLine}>
                  <Text>R-N</Text>
                  <Text>{data.sutrRN1 ? `${data.sutrRN1} M${OMEGA}` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>S-N</Text>
                  <Text>{data.sutrSN1 ? `${data.sutrSN1} M${OMEGA}` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>T-N</Text>
                  <Text>{data.sutrTN1 ? `${data.sutrTN1} M${OMEGA}` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>R-S</Text>
                  <Text>{data.sutrRS1 ? `${data.sutrRS1} M${OMEGA}` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>R-T</Text>
                  <Text>{data.sutrRT1 ? `${data.sutrRT1} M${OMEGA}` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>S-T</Text>
                  <Text>{data.sutrST1 ? `${data.sutrST1} M${OMEGA}` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>N-BODY</Text>
                  <Text>{data.sutrNBody1 ? `${data.sutrNBody1} M${OMEGA}` : "-"}</Text>
                </View>
              </View>
            </View>

            {/* Line 2 */}
            <View style={styles.gridCol}>
              <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", textAlign: "center", marginBottom: 3 }}>LINE 2</Text>
              <View style={styles.dataLine}>
                <Text>Jenis</Text>
                <Text>{data.sutrJenisConductor2 || "-"}</Text>
              </View>
              <View style={styles.dataLine}>
                <Text>Ukuran</Text>
                <Text>{data.sutrUkuran2 ? `${data.sutrUkuran2} mm²` : "-"}</Text>
              </View>
              <View style={styles.dataLine}>
                <Text>Panjang</Text>
                <Text>{data.sutrPanjang2 ? `${data.sutrPanjang2} km` : "-"}</Text>
              </View>
              <View style={{ borderTop: "1px solid #d0d0d0", marginTop: 3, paddingTop: 3 }}>
                <View style={styles.dataLine}>
                  <Text>R-N</Text>
                  <Text>{data.sutrRN2 ? `${data.sutrRN2} M${OMEGA}` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>S-N</Text>
                  <Text>{data.sutrSN2 ? `${data.sutrSN2} M${OMEGA}` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>T-N</Text>
                  <Text>{data.sutrTN2 ? `${data.sutrTN2} M${OMEGA}` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>R-S</Text>
                  <Text>{data.sutrRS2 ? `${data.sutrRS2} M${OMEGA}` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>R-T</Text>
                  <Text>{data.sutrRT2 ? `${data.sutrRT2} M${OMEGA}` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>S-T</Text>
                  <Text>{data.sutrST2 ? `${data.sutrST2} M${OMEGA}` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>N-BODY</Text>
                  <Text>{data.sutrNBody2 ? `${data.sutrNBody2} M${OMEGA}` : "-"}</Text>
                </View>
              </View>
            </View>

            {/* Line 3 */}
            <View style={styles.gridCol}>
              <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", textAlign: "center", marginBottom: 3 }}>LINE 3</Text>
              <View style={styles.dataLine}>
                <Text>Jenis</Text>
                <Text>{data.sutrJenisConductor3 || "-"}</Text>
              </View>
              <View style={styles.dataLine}>
                <Text>Ukuran</Text>
                <Text>{data.sutrUkuran3 ? `${data.sutrUkuran3} mm²` : "-"}</Text>
              </View>
              <View style={styles.dataLine}>
                <Text>Panjang</Text>
                <Text>{data.sutrPanjang3 ? `${data.sutrPanjang3} km` : "-"}</Text>
              </View>
              <View style={{ borderTop: "1px solid #d0d0d0", marginTop: 3, paddingTop: 3 }}>
                <View style={styles.dataLine}>
                  <Text>R-N</Text>
                  <Text>{data.sutrRN3 ? `${data.sutrRN3} M${OMEGA}` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>S-N</Text>
                  <Text>{data.sutrSN3 ? `${data.sutrSN3} M${OMEGA}` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>T-N</Text>
                  <Text>{data.sutrTN3 ? `${data.sutrTN3} M${OMEGA}` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>R-S</Text>
                  <Text>{data.sutrRS3 ? `${data.sutrRS3} M${OMEGA}` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>R-T</Text>
                  <Text>{data.sutrRT3 ? `${data.sutrRT3} M${OMEGA}` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>S-T</Text>
                  <Text>{data.sutrST3 ? `${data.sutrST3} M${OMEGA}` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>N-BODY</Text>
                  <Text>{data.sutrNBody3 ? `${data.sutrNBody3} M${OMEGA}` : "-"}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Jaringan SUTM */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>JARINGAN SUTM & TEST TAHANAN ISOLASI</Text>
          <View style={{ border: "1px solid #d0d0d0", padding: 5 }}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <View style={styles.dataLine}>
                  <Text>Jenis</Text>
                  <Text>{data.sutmJenisConductor || "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>Ukuran</Text>
                  <Text>{data.sutmUkuran ? `${data.sutmUkuran} mm²` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>Panjang</Text>
                  <Text>{data.sutmPanjang ? `${data.sutmPanjang} kms` : "-"}</Text>
                </View>
              </View>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <View style={styles.dataLine}>
                  <Text>R-G</Text>
                  <Text>{data.sutmRG ? `${data.sutmRG} M${OMEGA}` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>S-G</Text>
                  <Text>{data.sutmSG ? `${data.sutmSG} M${OMEGA}` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>T-G</Text>
                  <Text>{data.sutmTG ? `${data.sutmTG} M${OMEGA}` : "-"}</Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.dataLine}>
                  <Text>R-S</Text>
                  <Text>{data.sutmRS ? `${data.sutmRS} M${OMEGA}` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>R-T</Text>
                  <Text>{data.sutmRT ? `${data.sutmRT} M${OMEGA}` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>S-T</Text>
                  <Text>{data.sutmST ? `${data.sutmST} M${OMEGA}` : "-"}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Transformator */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>TRANSFORMATOR DISTRIBUSI 20 KV</Text>
          <View style={{ border: "1px solid #d0d0d0", padding: 5 }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              <View style={{ width: "50%", paddingRight: 5 }}>
                <View style={styles.dataLine}>
                  <Text>Pabrik/Merk</Text>
                  <Text>{data.pabrikMerk || "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>Daya Nominal</Text>
                  <Text>{data.dayaNominal ? `${data.dayaNominal} KVA` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>Tegangan Primer</Text>
                  <Text>{data.tegPrimer ? `${data.tegPrimer} KV` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>Tegangan Sekunder</Text>
                  <Text>{data.tegSekunder ? `${data.tegSekunder} V` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>No. Seri</Text>
                  <Text>{data.noSeri || "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>Tahun Pembuatan</Text>
                  <Text>{data.tahunPembuatan || "-"}</Text>
                </View>
              </View>
              <View style={{ width: "50%" }}>
                <View style={styles.dataLine}>
                  <Text>Hubungan</Text>
                  <Text>{data.hubungan || "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>Frekuensi</Text>
                  <Text>{data.frekuensi ? `${data.frekuensi} Hz` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>Arus Primer</Text>
                  <Text>{data.arusPrimer ? `${data.arusPrimer} A` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>Arus Nominal</Text>
                  <Text>{data.arusNom ? `${data.arusNom} A` : "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>Pendingin Minyak</Text>
                  <Text>{data.pendinginMinyak || "-"}</Text>
                </View>
                <View style={styles.dataLine}>
                  <Text>Berat Minyak</Text>
                  <Text>{data.beratMinyak ? `${data.beratMinyak} kg` : "-"}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Tahanan Isolasi & Tegangan */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>TAHANAN ISOLASI TRAFO & TEGANGAN RENDAH</Text>
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <View style={styles.dataLine}>
                <Text>Primer-Body</Text>
                <Text>{data.tahananPrimerBody ? `${data.tahananPrimerBody} M${OMEGA}` : "-"}</Text>
              </View>
              <View style={styles.dataLine}>
                <Text>Sekunder-Body</Text>
                <Text>{data.tahananSekunderBody ? `${data.tahananSekunderBody} M${OMEGA}` : "-"}</Text>
              </View>
              <View style={styles.dataLine}>
                <Text>Primer-Sekunder</Text>
                <Text>{data.tahananPrimerPrimer ? `${data.tahananPrimerPrimer} M${OMEGA}` : "-"}</Text>
              </View>
              <View style={styles.dataLine}>
                <Text>Sekunder-Sekunder</Text>
                <Text>{data.tahananSekunderSekunder ? `${data.tahananSekunderSekunder} M${OMEGA}` : "-"}</Text>
              </View>
            </View>
            <View style={styles.gridCol}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1, paddingRight: 5 }}>
                  <View style={styles.dataLine}>
                    <Text>R-N</Text>
                    <Text>{data.teganganRN ? `${data.teganganRN}V` : "-"}</Text>
                  </View>
                  <View style={styles.dataLine}>
                    <Text>S-N</Text>
                    <Text>{data.teganganSN ? `${data.teganganSN}V` : "-"}</Text>
                  </View>
                  <View style={styles.dataLine}>
                    <Text>T-N</Text>
                    <Text>{data.teganganTN ? `${data.teganganTN}V` : "-"}</Text>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.dataLine}>
                    <Text>R-S</Text>
                    <Text>{data.teganganRS ? `${data.teganganRS}V` : "-"}</Text>
                  </View>
                  <View style={styles.dataLine}>
                    <Text>R-T</Text>
                    <Text>{data.teganganRT ? `${data.teganganRT}V` : "-"}</Text>
                  </View>
                  <View style={styles.dataLine}>
                    <Text>S-T</Text>
                    <Text>{data.teganganST ? `${data.teganganST}V` : "-"}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Arrester & Pentanahan */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>ARRESTER & PENTANAHAN</Text>
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <View style={styles.dataLine}>
                <Text>R-G</Text>
                <Text>{data.tahananArresterRG ? `${data.tahananArresterRG} M${OMEGA}` : "-"}</Text>
              </View>
              <View style={styles.dataLine}>
                <Text>S-G</Text>
                <Text>{data.tahananArresterSG ? `${data.tahananArresterSG} M${OMEGA}` : "-"}</Text>
              </View>
              <View style={styles.dataLine}>
                <Text>T-G</Text>
                <Text>{data.tahananArresterTG ? `${data.tahananArresterTG} M${OMEGA}` : "-"}</Text>
              </View>
              <View style={styles.dataLine}>
                <Text>Arus Bocor Arrester</Text>
                <Text>{data.pentanahanArusBocorArrester ? `${data.pentanahanArusBocorArrester} mA` : "-"}</Text>
              </View>
            </View>
            <View style={styles.gridCol}>
              <View style={styles.dataLine}>
                <Text>Netral</Text>
                <Text>{data.pentanahanNetral ? `${data.pentanahanNetral} ${OMEGA}` : "-"}</Text>
              </View>
              <View style={styles.dataLine}>
                <Text>Arus Bocor Netral</Text>
                <Text>{data.pentanahanArusBocorNetral ? `${data.pentanahanArusBocorNetral} mA` : "-"}</Text>
              </View>
              <View style={styles.dataLine}>
                <Text>Arrester</Text>
                <Text>{data.pentanahanArrester ? `${data.pentanahanArrester} ${OMEGA}` : "-"}</Text>
              </View>
              <View style={styles.dataLine}>
                <Text>Body</Text>
                <Text>{data.pentanahanBody ? `${data.pentanahanBody} ${OMEGA}` : "-"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Catatan */}
        <View style={styles.section}>
          <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", marginBottom: 3 }}>Catatan:</Text>
          <View style={styles.notesBox}>
            <Text>{data.catatan || "-"}</Text>
          </View>
        </View>

        {/* Tanda Tangan */}
        <View style={styles.signatureArea}>
          <View style={styles.signatureCol}>
            <Text style={styles.signatureLabel}>Petugas PLN:</Text>
            <View style={styles.peopleList}>
              {petugasList.length > 0 ? (
                petugasList.slice(0, 3).map((petugas, idx) => (
                  <Text key={idx} style={styles.personRow}>
                    {idx + 1}. {petugas}
                  </Text>
                ))
              ) : (
                <>
                  <Text style={styles.personRow}>1. _______________</Text>
                  <Text style={styles.personRow}>2. _______________</Text>
                  <Text style={styles.personRow}>3. _______________</Text>
                </>
              )}
            </View>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureName}></Text>
            </View>
          </View>

          <View style={styles.signatureCol}>
            <Text style={styles.signatureLabel}>Mengetahui Pengawas</Text>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureName}>Asman Jaringan</Text>
              <Text style={styles.signatureName}>PT PLN UP3 Ponorogo</Text>
            </View>
          </View>

          <View style={styles.signatureCol}>
            <Text style={styles.signatureLabel}>Pelaksana</Text>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureName}>{data.pelaksanaPetugas || "_______________"}</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* Halaman 2 - Berita Acara */}
      <Page size="LEGAL" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image src="/Logo_PLN.png" style={styles.logo} />
            <View>
              <Text style={styles.headerText}>PT PLN (PERSERO)</Text>
              <Text style={styles.headerText}>UNIT INDUK DISTRIBUSI JATIM</Text>
              <Text style={styles.headerText}>UP3 PONOROGO</Text>
            </View>
          </View>
        </View>

        {/* Judul */}
        <Text style={styles.title}>BERITA ACARA</Text>
        <Text style={styles.subtitle}>Tentang</Text>
        <Text style={styles.title}>PEMERIKSAAN JARINGAN DISTRIBUSI 20 KV</Text>
        <Text style={styles.subtitle}>
          No. BA: BA. / UP3-PRG / ULP - {data.ulp || "___"} / {new Date().getMonth() + 1} / {new Date().getFullYear()}
        </Text>

        {/* Info */}
        <View style={{ marginBottom: 10 }}>
          <View style={styles.row}>
            <Text style={styles.label}>PLN AREA</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{data.plnUp3 || "-"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>NAMA PEKERJAAN</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{data.namaPekerjaan || "-"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>NAMA PELANGGAN</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{data.namaPelanggan || "-"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>ALAMAT / LOKASI</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{data.lokasiAlamat || "-"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>RAYON</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{data.ulp || "-"}</Text>
          </View>
        </View>

        {/* Tanggal */}
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 7 }}>
            Pada Hari ini: Tanggal <Text style={{ fontFamily: "Helvetica-Bold" }}>{tanggalParts.day}</Text>
            {" "}Bulan <Text style={{ fontFamily: "Helvetica-Bold" }}>{tanggalParts.month}</Text>
            {" "}Tahun <Text style={{ fontFamily: "Helvetica-Bold" }}>{tanggalParts.year}</Text>
          </Text>
        </View>

        {/* SPK Info */}
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 7, marginBottom: 3 }}>Berdasarkan:</Text>
          <View style={{ marginLeft: 15 }}>
            <View style={styles.row}>
              <Text style={{ width: 100 }}>SPK/PK (SUTM)</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{data.spkSutm || "-"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={{ width: 100 }}>SPK/PK (SUTR)</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{data.spkSutr || "-"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={{ width: 100 }}>SPK/PK (GTT)</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{data.spkGtt || "-"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={{ width: 100 }}>Tanggal</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{formatDate(data.tanggalOperasi)}</Text>
            </View>
          </View>
        </View>

        {/* Hasil Pemeriksaan */}
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", marginBottom: 4 }}>
            Telah Melaksanakan Pemeriksaan Pada:
          </Text>
          <View style={{ marginLeft: 15 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 3, fontSize: 7 }}>
              <Text style={{ width: 20 }}>1.</Text>
              <Text style={{ width: 130 }}>SUTM A3C</Text>
              <Text style={{ flex: 1, borderBottom: "1px dotted #666", textAlign: "center", paddingHorizontal: 5 }}>
                {data.pemeriksaanSutm || data.sutmUkuran || "___"} mm²
              </Text>
              <Text style={{ marginHorizontal: 8 }}>=</Text>
              <Text style={{ width: 60, borderBottom: "1px dotted #666", textAlign: "center" }}>
                {data.sutmPanjang || "___"}
              </Text>
              <Text style={{ marginLeft: 5 }}>Kms</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 3, fontSize: 7 }}>
              <Text style={{ width: 20 }}>2.</Text>
              <Text style={{ width: 130 }}>SUTR Bund.Conduktor</Text>
              <Text style={{ flex: 1, borderBottom: "1px dotted #666", textAlign: "center", paddingHorizontal: 5 }}>
                {data.pemeriksaanSutr || data.sutrUkuran1 || "___"} mm²
              </Text>
              <Text style={{ marginHorizontal: 8 }}>=</Text>
              <Text style={{ width: 60, borderBottom: "1px dotted #666", textAlign: "center" }}>
                {data.sutrPanjang1 || "___"}
              </Text>
              <Text style={{ marginLeft: 5 }}>Kms</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 3, fontSize: 7 }}>
              <Text style={{ width: 20 }}>3.</Text>
              <Text style={{ width: 130 }}>Trafo Distribusi 20 KV 3 Ph</Text>
              <Text style={{ flex: 1, borderBottom: "1px dotted #666", textAlign: "center", paddingHorizontal: 5 }}>
                {data.pemeriksaanTrafo || data.dayaNominal || "___"} KVA
              </Text>
              <Text style={{ marginHorizontal: 8 }}>=</Text>
              <Text style={{ width: 60, borderBottom: "1px dotted #666", textAlign: "center" }}>1</Text>
              <Text style={{ marginLeft: 5 }}>Bh</Text>
            </View>
          </View>
        </View>

        <Text style={{ fontSize: 7, marginBottom: 10 }}>
          Dan siap untuk dilakukan proses pengoperasian.
        </Text>

        <Text style={{ fontSize: 7, marginBottom: 20 }}>
          Demikian Berita Acara ini dibuat dengan sebenarnya untuk dipergunakan seperlunya.
        </Text>

        {/* Tanda Tangan Halaman 2 */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 30, gap: 30 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 7, marginBottom: 3 }}>Petugas PLN:</Text>
            <View style={{ marginBottom: 35 }}>
              {petugasList.length > 0 ? (
                petugasList.map((petugas, idx) => (
                  <View key={idx} style={{ flexDirection: "row", marginBottom: 2 }}>
                    <Text style={{ fontSize: 6.5, width: 20 }}>{idx + 1}.</Text>
                    <Text style={{ fontSize: 6.5, flex: 1 }}>{petugas}</Text>
                  </View>
                ))
              ) : (
                <>
                  <View style={{ flexDirection: "row", marginBottom: 2 }}>
                    <Text style={{ fontSize: 6.5, width: 20 }}>1.</Text>
                    <Text style={{ fontSize: 6.5 }}>_______________</Text>
                  </View>
                  <View style={{ flexDirection: "row", marginBottom: 2 }}>
                    <Text style={{ fontSize: 6.5, width: 20 }}>2.</Text>
                    <Text style={{ fontSize: 6.5 }}>_______________</Text>
                  </View>
                  <View style={{ flexDirection: "row", marginBottom: 2 }}>
                    <Text style={{ fontSize: 6.5, width: 20 }}>3.</Text>
                    <Text style={{ fontSize: 6.5 }}>_______________</Text>
                  </View>
                  <View style={{ flexDirection: "row", marginBottom: 2 }}>
                    <Text style={{ fontSize: 6.5, width: 20 }}>4.</Text>
                    <Text style={{ fontSize: 6.5 }}>_______________</Text>
                  </View>
                  <View style={{ flexDirection: "row", marginBottom: 2 }}>
                    <Text style={{ fontSize: 6.5, width: 20 }}>5.</Text>
                    <Text style={{ fontSize: 6.5 }}>_______________</Text>
                  </View>
                </>
              )}
            </View>
            <View style={{ borderTop: "1px solid #000", paddingTop: 3 }}>
              <Text style={{ fontSize: 6.5, textAlign: "center" }}></Text>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 7, marginBottom: 3, textAlign: "center" }}>Mengetahui Pengawas</Text>
            <View style={{ borderTop: "1px solid #000", paddingTop: 3, marginTop: 70 }}>
              <Text style={{ fontSize: 6.5, textAlign: "center" }}>Asman Jaringan</Text>
              <Text style={{ fontSize: 6.5, textAlign: "center" }}>PT PLN UP3 Ponorogo</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* Halaman 3 - Lampiran */}
      <Page size="LEGAL" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image src="/Logo_PLN.png" style={styles.logo} />
            <View>
              <Text style={styles.headerText}>PT PLN (PERSERO)</Text>
              <Text style={styles.headerText}>UNIT INDUK DISTRIBUSI JATIM</Text>
              <Text style={styles.headerText}>UP3 PONOROGO</Text>
            </View>
          </View>
        </View>

        <Text style={styles.lampiranTitle}>LAMPIRAN DOKUMENTASI KEGIATAN</Text>

        {lampiranUrls.length > 0 ? (
          <View style={styles.fotoGrid}>
            {lampiranUrls.map((foto, index) => (
              <View key={index} style={styles.fotoBox}>
                <Image src={foto} style={styles.fotoImage} />
                <Text style={styles.fotoCaption}>Foto {index + 1}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={{ fontSize: 7, textAlign: "center", marginTop: 20 }}>
            Tidak ada lampiran foto.
          </Text>
        )}
      </Page>
    </Document>
  );
};

const PengoperasianDocument = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/test-jaringan/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📦 Response dari API:", res.data);

        let fetchedData;
        if (res.data.data) {
          fetchedData = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
        } else if (Array.isArray(res.data)) {
          fetchedData = res.data[0];
        } else {
          fetchedData = res.data;
        }

        console.log("✅ Data yang digunakan:", fetchedData);
        console.log("👥 petugasPLN:", fetchedData.petugasPLN, typeof fetchedData.petugasPLN);
        
        setData(fetchedData);
      } catch (error) {
        console.error("❌ Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center p-8 text-gray-500">
        Memuat data pengoperasian...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-8 text-red-500">
        Tidak ada data pengoperasian ditemukan.
      </div>
    );
  }

  return (
    <PDFViewer width="100%" height="100%" style={{ minHeight: "100vh" }}>
      <PengoperasianPDFDocument data={data} />
    </PDFViewer>
  );
};

export default PengoperasianDocument;