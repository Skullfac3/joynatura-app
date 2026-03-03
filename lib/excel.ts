// ===================================
// Excel - Exportación de clientes a Excel
// ===================================

import * as XLSX from "xlsx";

export interface ClienteExcel {
    id: string;
    nombre: string;
    tipo: string;
    telefono: string;
    email: string;
    calle: string;
    numero: string;
    colonia: string;
    ciudad: string;
    estado: string;
    fechaCreacion: string;
}

/**
 * Genera y descarga un archivo Excel con los datos de clientes.
 */
export function exportarClientesExcel(clientes: ClienteExcel[]) {
    const datosExcel = clientes.map((c) => ({
        Nombre: c.nombre,
        Tipo: c.tipo === "local" ? "Local" : "Foráneo",
        Teléfono: c.telefono,
        Email: c.email,
        Calle: c.calle,
        Número: c.numero,
        Colonia: c.colonia,
        Ciudad: c.ciudad,
        Estado: c.estado,
        "Fecha de Registro": c.fechaCreacion,
    }));

    const hoja = XLSX.utils.json_to_sheet(datosExcel);

    // Auto-ancho de columnas
    const anchos = Object.keys(datosExcel[0] || {}).map((key) => ({
        wch: Math.max(
            key.length,
            ...datosExcel.map((row) => String((row as Record<string, unknown>)[key] || "").length)
        ) + 2,
    }));
    hoja["!cols"] = anchos;

    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Clientes");
    XLSX.writeFile(libro, `clientes-joynatura-${new Date().toISOString().split("T")[0]}.xlsx`);
}
