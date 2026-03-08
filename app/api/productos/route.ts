// ===================================
// API de Productos JoyNatura
// GET /api/productos — lista/búsqueda de productos
// ===================================

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const buscar = searchParams.get("buscar");

        const productos = await prisma.producto.findMany({
            where: buscar
                ? {
                    nombre: {
                        contains: buscar,
                        mode: "insensitive",
                    },
                }
                : undefined,
            orderBy: { numero: "asc" },
        });

        return NextResponse.json(productos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return NextResponse.json(
            { error: "Error al obtener productos" },
            { status: 500 }
        );
    }
}
