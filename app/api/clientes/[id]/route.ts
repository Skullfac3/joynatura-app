// ===================================
// API Route: GET/PUT/DELETE /api/clientes/[id]
// Operaciones sobre un cliente específico
// ===================================

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
    params: { id: string };
}

/** GET - Obtener un cliente por ID */
export async function GET(_request: Request, { params }: RouteParams) {
    try {
        const cliente = await prisma.cliente.findUnique({
            where: { id: params.id },
        });

        if (!cliente) {
            return NextResponse.json(
                { error: "Cliente no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(cliente);
    } catch (error) {
        console.error("Error al obtener cliente:", error);
        return NextResponse.json(
            { error: "Error al obtener cliente" },
            { status: 500 }
        );
    }
}

/** PUT - Actualizar un cliente */
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const body = await request.json();

        const cliente = await prisma.cliente.update({
            where: { id: params.id },
            data: {
                nombre: body.nombre,
                tipo: body.tipo,
                telefono: body.telefono,
                email: body.email,
                calle: body.calle,
                numero: body.numero,
                colonia: body.colonia,
                ciudad: body.ciudad,
                estado: body.estado,
            },
        });

        return NextResponse.json(cliente);
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        return NextResponse.json(
            { error: "Error al actualizar cliente" },
            { status: 500 }
        );
    }
}

/** DELETE - Eliminar un cliente */
export async function DELETE(_request: Request, { params }: RouteParams) {
    try {
        await prisma.cliente.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "Cliente eliminado" });
    } catch (error) {
        console.error("Error al eliminar cliente:", error);
        return NextResponse.json(
            { error: "Error al eliminar cliente" },
            { status: 500 }
        );
    }
}
