// ===================================
// API Route: GET /api/clientes - Obtener todos los clientes
// POST /api/clientes - Crear un nuevo cliente
// ===================================

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/** GET - Obtener todos los clientes, con búsqueda opcional */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const buscar = searchParams.get("buscar") || "";

        const clientes = await prisma.cliente.findMany({
            where: buscar
                ? {
                    OR: [
                        { nombre: { contains: buscar, mode: "insensitive" } },
                        { ciudad: { contains: buscar, mode: "insensitive" } },
                        { estado: { contains: buscar, mode: "insensitive" } },
                        { telefono: { contains: buscar, mode: "insensitive" } },
                        { email: { contains: buscar, mode: "insensitive" } },
                    ],
                }
                : {},
            orderBy: { fechaCreacion: "desc" },
        });

        return NextResponse.json(clientes);
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        return NextResponse.json(
            { error: "Error al obtener clientes" },
            { status: 500 }
        );
    }
}

/** POST - Crear un nuevo cliente */
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const cliente = await prisma.cliente.create({
            data: {
                nombre: body.nombre,
                tipo: body.tipo || "local",
                telefono: body.telefono || "",
                email: body.email || "",
                calle: body.calle || "",
                numero: body.numero || "",
                colonia: body.colonia || "",
                ciudad: body.ciudad || "",
                estado: body.estado || "",
            },
        });

        return NextResponse.json(cliente, { status: 201 });
    } catch (error) {
        console.error("Error al crear cliente:", error);
        return NextResponse.json(
            { error: "Error al crear cliente" },
            { status: 500 }
        );
    }
}
