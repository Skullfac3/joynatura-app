// ===================================
// Seed Script - Importar datos del Excel a PostgreSQL
// Ejecutar: node prisma/seed.js
// ===================================

const XLSX = require("xlsx");
const { PrismaClient } = require("@prisma/client");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
    const excelPath = path.join(__dirname, "..", "clientes datos.xlsx");

    console.log("📂 Leyendo archivo Excel:", excelPath);
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);

    console.log(`📋 Encontradas ${rows.length} filas en la hoja "${sheetName}"`);
    console.log("📋 Columnas:", Object.keys(rows[0] || {}));

    let creados = 0;
    let errores = 0;

    for (const row of rows) {
        try {
            // Columnas del Excel: CLIENTE, PAQUETERIA, DIRECCION, CP, TELEFONO
            const nombre = row["CLIENTE"] || "";
            const telefono = String(row["TELEFONO"] || "");
            const direccionCompleta = row["DIRECCION"] || "";

            if (!nombre || nombre.toString().trim() === "") {
                continue; // Saltar filas sin nombre
            }

            // Intentar parsear la dirección completa
            // Formato típico: "CALLE: X NO.EXT Y COL. Z C.P. NNNNN CIUDAD, ESTADO"
            let calle = "";
            let numero = "";
            let colonia = "";
            let ciudad = "";
            let estado = "";
            const dir = direccionCompleta.toString();

            // Extraer calle (todo antes de NO. o NUM.)
            const calleMatch = dir.match(/^(?:CALLE[:\s]*)?(.+?)(?:\s*NO\.?\s*(?:EXT[:\s]*)?)/i);
            if (calleMatch) calle = calleMatch[1].trim();

            // Extraer número
            const numMatch = dir.match(/NO\.?\s*(?:EXT[:\s]*)?([\w\d-]+)/i);
            if (numMatch) numero = numMatch[1].trim();

            // Extraer colonia
            const colMatch = dir.match(/COL(?:ONIA)?\.?\s*:?\s*(.+?)(?:\s*C\.?P\.?)/i);
            if (colMatch) colonia = colMatch[1].trim();

            // Extraer ciudad y estado (después del CP)
            const ciudadEstadoMatch = dir.match(/C\.?P\.?\s*\d+\.?\s*(.+)/i);
            if (ciudadEstadoMatch) {
                const parts = ciudadEstadoMatch[1].split(/[,]+/).map(p => p.trim()).filter(Boolean);
                if (parts.length >= 2) {
                    ciudad = parts[0];
                    estado = parts[1];
                } else if (parts.length === 1) {
                    ciudad = parts[0];
                }
            }

            // Todos son clientes foráneos (tienen PAQUETERIA)
            const tipo = row["PAQUETERIA"] ? "foraneo" : "local";

            await prisma.cliente.create({
                data: {
                    nombre: nombre.toString().trim(),
                    tipo,
                    telefono: telefono.toString().trim(),
                    email: "",
                    calle: calle,
                    numero: numero,
                    colonia: colonia,
                    ciudad: ciudad,
                    estado: estado,
                },
            });
            creados++;
            console.log(`   ✅ ${nombre.toString().trim()} | ${ciudad} ${estado} | Tel: ${telefono}`);
        } catch (err) {
            errores++;
            console.error(`   ❌ Error:`, err.message);
        }
    }

    console.log(`\n🎉 Resumen:`);
    console.log(`   ✅ Creados: ${creados}`);
    console.log(`   ❌ Errores: ${errores}`);
    console.log(`   📋 Total en Excel: ${rows.length}`);

    const total = await prisma.cliente.count();
    console.log(`   🗄️  Total en DB: ${total}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
