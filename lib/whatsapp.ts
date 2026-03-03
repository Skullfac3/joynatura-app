// ===================================
// Generación de mensaje para WhatsApp
// ===================================

import { Pedido } from "@/types";

/**
 * Genera un mensaje de texto formateado con emojis
 * listo para enviar por WhatsApp.
 */
export function generarMensajeWhatsApp(pedido: Pedido): string {
    const { cliente, productos, fecha } = pedido;

    let mensaje = `🌿 *JoyNatura - Pedido*\n`;
    mensaje += `📅 Fecha: ${fecha}\n\n`;

    // Datos del cliente
    mensaje += `👤 *Cliente:* ${cliente.nombre}\n`;
    mensaje += `📌 Tipo: ${cliente.tipo === "local" ? "Local" : "Foráneo"}\n\n`;

    // Dirección
    const { calle, numero, colonia, ciudad, estado } = cliente.direccion;
    mensaje += `🏠 *Dirección de entrega:*\n`;
    mensaje += `${calle} #${numero}\n`;
    mensaje += `Col. ${colonia}\n`;
    mensaje += `${ciudad}, ${estado}\n\n`;

    // Productos
    mensaje += `📦 *Productos:*\n`;
    mensaje += `─────────────────\n`;
    productos.forEach((producto, index) => {
        mensaje += `${index + 1}. ${producto.nombre} x${producto.cantidad}`;
        if (producto.notas) {
            mensaje += ` (${producto.notas})`;
        }
        mensaje += `\n`;
    });
    mensaje += `─────────────────\n`;
    mensaje += `📊 Total de productos: ${productos.length}\n\n`;
    mensaje += `🌿 ¡Gracias por tu pedido! - JoyNatura`;

    return mensaje;
}

/**
 * Abre WhatsApp Web con el mensaje formateado.
 * Usa encodeURIComponent para los caracteres especiales.
 */
export function abrirWhatsApp(mensaje: string): void {
    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
}
