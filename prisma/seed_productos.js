// ===================================
// Seed de Productos — Importar mayoreo y menudeo
// ===================================

const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

/**
 * Parsea el texto extraído de un PDF de precios.
 * Retorna un Map<number, { nombre, precio }>.
 */
function parsePriceList(text) {
    const products = new Map();
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

    let currentNum = null;
    let currentName = "";

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Saltar headers y footers
        if (
            line.startsWith("#PRODUCTOS") ||
            line.startsWith("JOY NATURA") ||
            line.startsWith("LISTA DE PRECIOS") ||
            line.startsWith("Página") ||
            line.startsWith("MAYOREO") ||
            line.startsWith("MENUDEO")
        ) {
            continue;
        }

        // Detectar línea de precio (termina en $ con número)
        const priceMatch = line.match(/^([\d,]+\.?\d*)\$\s*$/);
        if (priceMatch) {
            if (currentNum !== null && currentName) {
                const precio = parseFloat(priceMatch[1].replace(",", ""));
                products.set(currentNum, {
                    nombre: currentName.trim(),
                    precio,
                });
            }
            currentNum = null;
            currentName = "";
            continue;
        }

        // Detectar línea que empieza con número de producto
        const numMatch = line.match(/^(\d+)(.*)$/);
        if (numMatch) {
            const num = parseInt(numMatch[1]);
            const rest = numMatch[2].trim();

            // Verificar que es un número de producto (1-400) y no parte del nombre
            if (num >= 1 && num <= 400 && (rest.length === 0 || /^[A-ZÁÉÍÓÚÑÜ\s\(\)]/.test(rest))) {
                // Nuevo producto
                currentNum = num;
                currentName = rest;
                continue;
            }
        }

        // Línea de continuación del nombre del producto
        if (currentNum !== null) {
            currentName += " " + line;
        }
    }

    return products;
}

async function main() {
    console.log("🏪 Importando productos a Supabase...\n");

    // Leer archivos de texto extraídos de los PDFs
    const mayoreoPath = path.join(__dirname, "..", "mayoreo_text.txt");
    const menudeoPath = path.join(__dirname, "..", "menudeo_text.txt");

    if (!fs.existsSync(mayoreoPath) || !fs.existsSync(menudeoPath)) {
        console.error("❌ No se encontraron los archivos de texto de precios.");
        console.error("   Ejecuta primero: node extract_pdf.js");
        process.exit(1);
    }

    const mayoreoText = fs.readFileSync(mayoreoPath, "utf8");
    const menudeoText = fs.readFileSync(menudeoPath, "utf8");

    const mayoreoProducts = parsePriceList(mayoreoText);
    const menudeoProducts = parsePriceList(menudeoText);

    console.log(`📋 Productos Mayoreo: ${mayoreoProducts.size}`);
    console.log(`📋 Productos Menudeo: ${menudeoProducts.size}`);

    // Combinar ambas listas usando el número como clave
    const allNumbers = new Set([
        ...mayoreoProducts.keys(),
        ...menudeoProducts.keys(),
    ]);

    console.log(`📋 Productos únicos totales: ${allNumbers.size}\n`);

    // Limpiar tabla existente
    await prisma.producto.deleteMany({});
    console.log("🗑️  Tabla productos limpiada\n");

    let created = 0;
    let errors = 0;

    // Insertar todos los productos
    const sorted = [...allNumbers].sort((a, b) => a - b);

    for (const num of sorted) {
        const mayoreo = mayoreoProducts.get(num);
        const menudeo = menudeoProducts.get(num);

        const nombre = mayoreo?.nombre || menudeo?.nombre || `Producto ${num}`;
        const precioMayoreo = mayoreo?.precio || 0;
        const precioMenudeo = menudeo?.precio || 0;

        try {
            await prisma.producto.create({
                data: {
                    numero: num,
                    nombre,
                    precioMayoreo,
                    precioMenudeo,
                },
            });
            created++;

            if (created % 50 === 0) {
                console.log(`   ✅ ${created} productos insertados...`);
            }
        } catch (err) {
            errors++;
            console.error(`   ❌ Error producto #${num} (${nombre}): ${err.message}`);
        }
    }

    // Verificar total en DB
    const totalDB = await prisma.producto.count();

    console.log(`\n🎉 Resumen:`);
    console.log(`   ✅ Creados: ${created}`);
    console.log(`   ❌ Errores: ${errors}`);
    console.log(`   🗄️  Total en DB: ${totalDB}`);

    // Mostrar primeros 5 como ejemplo
    const sample = await prisma.producto.findMany({
        take: 5,
        orderBy: { numero: "asc" },
    });
    console.log(`\n📋 Muestra (primeros 5):`);
    for (const p of sample) {
        console.log(
            `   #${p.numero} | ${p.nombre} | Mayoreo: $${p.precioMayoreo} | Menudeo: $${p.precioMenudeo}`
        );
    }

    await prisma.$disconnect();
}

main().catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
});
