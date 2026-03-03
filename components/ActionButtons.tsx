"use client";

// ===================================
// ActionButtons - Botones de acción (WhatsApp, PDF, Nuevo)
// ===================================

import { Pedido } from "@/types";
import { generarMensajeWhatsApp, abrirWhatsApp } from "@/lib/whatsapp";
import { generarPDF } from "@/lib/pdf";
import { MessageCircle, FileDown, RefreshCcw, Loader2 } from "lucide-react";
import { useState } from "react";

interface ActionButtonsProps {
    pedido: Pedido;
    onNuevoPedido: () => void;
    /** ID del elemento HTML a capturar para el PDF */
    previewElementId?: string;
}

export default function ActionButtons({
    pedido,
    onNuevoPedido,
    previewElementId = "pedido-preview",
}: ActionButtonsProps) {
    const [generandoPDF, setGenerandoPDF] = useState(false);

    /** Enviar resumen por WhatsApp */
    const handleWhatsApp = () => {
        const mensaje = generarMensajeWhatsApp(pedido);
        abrirWhatsApp(mensaje);
    };

    /** Descargar como PDF */
    const handlePDF = async () => {
        setGenerandoPDF(true);
        try {
            const nombreArchivo = `pedido-${pedido.cliente.nombre
                .toLowerCase()
                .replace(/\s+/g, "-")}-${pedido.fecha}`;
            await generarPDF(previewElementId, nombreArchivo);
        } finally {
            setGenerandoPDF(false);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3 no-print">
            {/* WhatsApp */}
            <button
                type="button"
                onClick={handleWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl
                   bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold
                   hover:from-green-600 hover:to-green-700 
                   shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300
                   transition-all duration-300 active:scale-[0.98]"
            >
                <MessageCircle className="w-5 h-5" />
                Enviar por WhatsApp
            </button>

            {/* PDF */}
            <button
                type="button"
                onClick={handlePDF}
                disabled={generandoPDF}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl
                   bg-gradient-to-r from-joy-gold-400 to-joy-gold-500 text-white font-semibold
                   hover:from-joy-gold-500 hover:to-joy-gold-600 
                   shadow-lg shadow-joy-cream-300 hover:shadow-xl hover:shadow-joy-cream-400
                   transition-all duration-300 active:scale-[0.98]
                   disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {generandoPDF ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <FileDown className="w-5 h-5" />
                )}
                {generandoPDF ? "Generando..." : "Descargar PDF"}
            </button>

            {/* Nuevo pedido */}
            <button
                type="button"
                onClick={onNuevoPedido}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl
                   bg-white text-joy-green-600 font-semibold
                   border-2 border-joy-green-200
                   hover:bg-joy-green-50 hover:border-joy-green-300
                   transition-all duration-300 active:scale-[0.98]"
            >
                <RefreshCcw className="w-5 h-5" />
                Nuevo Pedido
            </button>
        </div>
    );
}
