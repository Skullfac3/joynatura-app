// ===================================
// Generación de PDF con html2canvas + jsPDF
// Encabezado JoyNatura en TODAS las páginas
// Márgenes uniformes en todas las páginas
// ===================================

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Captura un elemento del DOM por su ID y lo convierte en un PDF descargable.
 * Agrega el encabezado de JoyNatura en todas las páginas.
 * @param elementId - ID del elemento HTML a capturar
 * @param filename - Nombre del archivo PDF (sin extensión)
 */
export async function generarPDF(
    elementId: string,
    filename: string = "pedido-joynatura"
): Promise<void> {
    const element = document.getElementById(elementId);

    if (!element) {
        console.error(`Elemento con id "${elementId}" no encontrado.`);
        return;
    }

    try {
        // Capturar el elemento completo como canvas
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
        });

        // Dimensiones A4 en mm
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 10;

        // Área útil
        const usableWidth = pageWidth - margin * 2;
        const usableHeight = pageHeight - margin * 2;

        // Escala: relación px del canvas → mm del PDF
        const pixelsPerMm = canvas.width / usableWidth;

        const pdf = new jsPDF("p", "mm", "a4");

        // ─── Detectar el header verde del preview ───
        // El header verde ocupa aprox 40mm (icono + "JoyNatura" + "Hoja de Pedido")
        const headerHeightMm = 40;
        const headerHeightPx = Math.floor(headerHeightMm * pixelsPerMm);

        // Capturar solo el header como imagen reutilizable
        const headerCanvas = document.createElement("canvas");
        headerCanvas.width = canvas.width;
        headerCanvas.height = headerHeightPx;
        const headerCtx = headerCanvas.getContext("2d");
        if (headerCtx) {
            headerCtx.drawImage(
                canvas,
                0, 0, canvas.width, headerHeightPx,
                0, 0, canvas.width, headerHeightPx
            );
        }
        const headerImgData = headerCanvas.toDataURL("image/png");

        // ─── Calcular paginación ───
        const page1HeightPx = Math.floor(usableHeight * pixelsPerMm);
        const totalImgHeightMm = canvas.height / pixelsPerMm;

        if (totalImgHeightMm <= usableHeight) {
            // Todo cabe en una sola página
            const imgData = canvas.toDataURL("image/png");
            pdf.addImage(imgData, "PNG", margin, margin, usableWidth, totalImgHeightMm);
        } else {
            // ─── Múltiples páginas ───
            // Página 2+ tiene: header (40mm) + separación (4mm) + contenido restante
            const headerSpaceMm = headerHeightMm + 4;
            const contentAreaPage2Mm = usableHeight - headerSpaceMm;
            const contentAreaPage2Px = Math.floor(contentAreaPage2Mm * pixelsPerMm);

            let currentY = 0; // Posición en px del canvas
            let pageNum = 0;

            while (currentY < canvas.height) {
                if (pageNum > 0) {
                    pdf.addPage();
                }

                if (pageNum === 0) {
                    // ─── Primera página: contenido normal ───
                    const sliceHeight = Math.min(page1HeightPx, canvas.height - currentY);

                    const sliceCanvas = createSlice(canvas, 0, currentY, canvas.width, sliceHeight);
                    const sliceData = sliceCanvas.toDataURL("image/png");
                    const sliceHeightMm = sliceHeight / pixelsPerMm;

                    pdf.addImage(sliceData, "PNG", margin, margin, usableWidth, sliceHeightMm);
                    currentY += sliceHeight;
                } else {
                    // ─── Páginas 2+: header + contenido ───

                    // 1. Dibujar el encabezado de JoyNatura
                    pdf.addImage(
                        headerImgData, "PNG",
                        margin, margin,
                        usableWidth, headerHeightMm
                    );

                    // 2. Contenido restante debajo del header
                    const contentStartY = margin + headerSpaceMm;
                    const sliceHeight = Math.min(contentAreaPage2Px, canvas.height - currentY);

                    if (sliceHeight <= 0) break;

                    const sliceCanvas = createSlice(canvas, 0, currentY, canvas.width, sliceHeight);
                    const sliceData = sliceCanvas.toDataURL("image/png");
                    const sliceHeightMm = sliceHeight / pixelsPerMm;

                    pdf.addImage(
                        sliceData, "PNG",
                        margin, contentStartY,
                        usableWidth, sliceHeightMm
                    );
                    currentY += sliceHeight;
                }

                pageNum++;
            }
        }

        pdf.save(`${filename}.pdf`);
    } catch (error) {
        console.error("Error al generar PDF:", error);
    }
}

/**
 * Crea un canvas recortado de una porción del canvas original
 */
function createSlice(
    source: HTMLCanvasElement,
    sx: number, sy: number,
    sw: number, sh: number
): HTMLCanvasElement {
    const sliceCanvas = document.createElement("canvas");
    sliceCanvas.width = sw;
    sliceCanvas.height = sh;
    const ctx = sliceCanvas.getContext("2d");
    if (ctx) {
        ctx.drawImage(source, sx, sy, sw, sh, 0, 0, sw, sh);
    }
    return sliceCanvas;
}
