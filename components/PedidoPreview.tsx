"use client";

// ===================================
// PedidoPreview - Vista previa del pedido (imprimible)
// ===================================

import { Pedido } from "@/types";
import { Leaf, User, MapPin, Package, Calendar, Phone } from "lucide-react";

interface PedidoPreviewProps {
    pedido: Pedido;
}

export default function PedidoPreview({ pedido }: PedidoPreviewProps) {
    const { cliente, productos, fecha } = pedido;

    /** Gran total = suma de (precioUnitario × cantidad) de cada producto */
    const granTotal = productos.reduce(
        (sum, p) => sum + p.precioUnitario * p.cantidad,
        0
    );
    const totalArticulos = productos.reduce((sum, p) => sum + p.cantidad, 0);

    return (
        <div
            id="pedido-preview"
            className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto"
        >
            {/* ─── Encabezado ─── */}
            <div className="bg-gradient-to-r from-joy-green-500 via-joy-green-400 to-joy-green-500 
                      px-6 py-8 text-center relative overflow-hidden">
                {/* Decoración de fondo */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-2 left-8 text-6xl">🌿</div>
                    <div className="absolute bottom-2 right-8 text-6xl">🍃</div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Leaf className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-wide">
                        JoyNatura
                    </h1>
                    <p className="text-joy-green-100 text-sm mt-1 font-light">
                        Hoja de Pedido
                    </p>
                </div>
            </div>

            {/* ─── Fecha ─── */}
            <div className="px-6 py-3 bg-joy-cream-50 border-b border-joy-cream-200 
                      flex items-center gap-2 text-sm text-joy-green-600">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Fecha:</span>
                <span>{fecha}</span>
            </div>

            {/* ─── Datos del Cliente ─── */}
            <div className="px-6 py-5 border-b border-joy-green-100">
                <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-joy-green-500" />
                    <h2 className="font-semibold text-joy-green-800">
                        Datos del Cliente
                    </h2>
                    <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${cliente.tipo === "local"
                            ? "bg-joy-green-100 text-joy-green-700"
                            : "bg-joy-cream-200 text-joy-gold-600"
                            }`}
                    >
                        {cliente.tipo === "local" ? "Local" : "Foráneo"}
                    </span>
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                    <p>
                        <span className="font-medium text-joy-green-700">Nombre:</span>{" "}
                        {cliente.nombre || "—"}
                    </p>
                    {cliente.telefono && (
                        <p className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-joy-green-500" />
                            <span className="font-medium text-joy-green-700">Tel:</span>{" "}
                            {cliente.telefono}
                        </p>
                    )}
                </div>

                <div className="mt-4 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-joy-gold-500 mt-0.5 shrink-0" />
                    <div className="text-sm text-gray-600 space-y-0.5">
                        <p>
                            {cliente.direccion.calle}{" "}
                            {cliente.direccion.numero && `#${cliente.direccion.numero}`}
                        </p>
                        {cliente.direccion.colonia && (
                            <p>Col. {cliente.direccion.colonia}</p>
                        )}
                        <p>
                            {cliente.direccion.ciudad}
                            {cliente.direccion.ciudad && cliente.direccion.estado && ", "}
                            {cliente.direccion.estado}
                        </p>
                    </div>
                </div>
            </div>

            {/* ─── Lista de Productos ─── */}
            <div className="px-6 py-5">
                <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-joy-gold-500" />
                    <h2 className="font-semibold text-joy-green-800">Productos</h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-joy-green-100 text-joy-green-700 font-medium">
                        {productos.length} {productos.length === 1 ? "producto" : "productos"}
                    </span>
                </div>

                {/* Tabla de productos */}
                <div className="rounded-xl overflow-hidden border border-joy-green-100">
                    {/* Header */}
                    <div className="grid grid-cols-12 bg-joy-green-50 px-4 py-2.5 text-xs font-semibold text-joy-green-700 uppercase tracking-wider">
                        <div className="col-span-1">#</div>
                        <div className="col-span-4">Producto</div>
                        <div className="col-span-1 text-center">Cant.</div>
                        <div className="col-span-2 text-right">P. Unit.</div>
                        <div className="col-span-2 text-right">Subtotal</div>
                        <div className="col-span-2 pl-2">Notas</div>
                    </div>

                    {/* Rows */}
                    {productos.map((producto, index) => {
                        const subtotal = producto.precioUnitario * producto.cantidad;
                        return (
                            <div
                                key={producto.id}
                                className={`grid grid-cols-12 px-4 py-3 text-sm items-center 
                ${index % 2 === 0 ? "bg-white" : "bg-joy-green-50/30"}
                ${index !== productos.length - 1 ? "border-b border-joy-green-50" : ""}`}
                            >
                                <div className="col-span-1 text-joy-green-400 font-medium">
                                    {index + 1}
                                </div>
                                <div className="col-span-4 font-medium text-gray-800">
                                    {producto.nombre || "—"}
                                </div>
                                <div className="col-span-1 text-center">
                                    <span className="inline-block px-2 py-0.5 rounded-full bg-joy-cream-100 text-joy-gold-600 font-semibold text-xs">
                                        ×{producto.cantidad}
                                    </span>
                                </div>
                                <div className="col-span-2 text-right text-gray-600 text-xs">
                                    {producto.precioUnitario > 0
                                        ? `$${producto.precioUnitario.toFixed(2)}`
                                        : "—"}
                                </div>
                                <div className="col-span-2 text-right font-semibold text-joy-green-700 text-xs">
                                    {subtotal > 0
                                        ? `$${subtotal.toFixed(2)}`
                                        : "—"}
                                </div>
                                <div className="col-span-2 pl-2 text-gray-500 text-xs italic truncate">
                                    {producto.notas || "—"}
                                </div>
                            </div>
                        );
                    })}

                    {/* Gran Total */}
                    <div className="grid grid-cols-12 px-4 py-3 bg-joy-green-50 border-t-2 border-joy-green-200">
                        <div className="col-span-6 text-right font-bold text-joy-green-800 text-sm pr-2">
                            TOTAL:
                        </div>
                        <div className="col-span-2 text-right font-bold text-joy-green-800 text-sm">
                            ${granTotal.toFixed(2)}
                        </div>
                        <div className="col-span-4 pl-2 text-xs text-joy-green-600">
                            ({totalArticulos} {totalArticulos === 1 ? "artículo" : "artículos"})
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Footer ─── */}
            <div className="px-6 py-4 bg-gradient-to-r from-joy-green-50 to-joy-cream-50 
                      border-t border-joy-green-100 text-center">
                <p className="text-xs text-joy-green-500">
                    🌿 JoyNatura — Productos naturales con amor 🌿
                </p>
            </div>
        </div>
    );
}
