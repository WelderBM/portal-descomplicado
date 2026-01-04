// components/comparison/ExportPDF.tsx - Exportação de Comparação em PDF
"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ExportPDFProps {
  comparisonRef: React.RefObject<HTMLDivElement | null>;
  item1Name: string;
  item2Name: string;
  type: "fipe" | "taco";
}

export function ExportPDF({
  comparisonRef,
  item1Name,
  item2Name,
  type,
}: ExportPDFProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!comparisonRef.current) return;

    setIsExporting(true);

    try {
      // Captura o elemento como imagem
      const canvas = await html2canvas(comparisonRef.current, {
        scale: 2,
        backgroundColor: "#0f172a",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 190; // A4 width in mm minus margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Cria PDF
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? "portrait" : "landscape",
        unit: "mm",
        format: "a4",
      });

      // Adiciona cabeçalho
      pdf.setFontSize(20);
      pdf.setTextColor(16, 185, 129); // Verde success
      pdf.text("Portal Descomplicado", 10, 15);

      pdf.setFontSize(14);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        `Comparação: ${type === "fipe" ? "Veículos" : "Alimentos"}`,
        10,
        25
      );

      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`${item1Name} vs ${item2Name}`, 10, 32);

      // Adiciona imagem da comparação
      pdf.addImage(imgData, "PNG", 10, 40, imgWidth, imgHeight);

      // Adiciona rodapé
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `Gerado em: ${new Date().toLocaleDateString("pt-BR")}`,
        10,
        pageHeight - 10
      );
      pdf.text(
        "Portal Descomplicado - Dados Oficiais Simplificados",
        10,
        pageHeight - 5
      );

      // Download
      const fileName = `comparacao-${type}-${item1Name
        .toLowerCase()
        .replace(/\s+/g, "-")}-vs-${item2Name
        .toLowerCase()
        .replace(/\s+/g, "-")}.pdf`;

      pdf.save(fileName);
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      alert("Erro ao exportar PDF. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FileDown className="h-4 w-4" />
      {isExporting ? "Exportando..." : "Exportar em PDF"}
    </button>
  );
}
