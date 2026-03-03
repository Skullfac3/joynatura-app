// ===================================
// Generación de PDF con html2canvas + jsPDF
// ===================================

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Captura un elemento del DOM por su ID y lo convierte en un PDF descargable.
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
        // Capturar el elemento como canvas
        const canvas = await html2canvas(element, {
            scale: 2, // Mayor resolución
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
        });

        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const pdf = new jsPDF("p", "mm", "a4");

        // Si la imagen es más alta que una página, ajustar
        if (imgHeight <= pageHeight) {
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        } else {
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position -= pageHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
        }

        pdf.save(`${filename}.pdf`);
    } catch (error) {
        console.error("Error al generar PDF:", error);
    }
}
