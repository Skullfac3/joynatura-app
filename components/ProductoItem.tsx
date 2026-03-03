"use client";

// ===================================
// ProductoItem - Ítem individual de producto
// Preparado para modo "manual" y "catalogo" (futuro)
// ===================================

import { Producto, ModoProducto } from "@/types";
import { X, Package, StickyNote } from "lucide-react";

interface ProductoItemProps {
    producto: Producto;
    /** Modo de entrada: 'manual' = texto libre, 'catalogo' = selector (futuro) */
    modo: ModoProducto;
    onChange: (producto: Producto) => void;
    onRemove: (id: string) => void;
    /** Indica si es el único producto (no se puede eliminar) */
    isOnly: boolean;
}

export default function ProductoItem({
    producto,
    modo,
    onChange,
    onRemove,
    isOnly,
}: ProductoItemProps) {
    /** Actualizar un campo del producto */
    const handleChange = (field: keyof Producto, value: string | number) => {
        onChange({ ...producto, [field]: value });
    };

    // ─────────────────────────────────────────────
    // MODO CATÁLOGO (futuro)
    // Cuando se implemente la conexión a base de datos,
    // este bloque mostrará un selector/buscador de productos
    // en lugar de los inputs de texto libre.
    // ─────────────────────────────────────────────
    if (modo === "catalogo") {
        return (
            <div className="p-4 rounded-xl border border-dashed border-joy-green-300 bg-joy-green-50/50">
                <p className="text-sm text-joy-green-500 italic">
                    🔜 Modo catálogo — próximamente disponible.
                    <br />
                    Se conectará a la base de datos de productos.
                </p>
            </div>
        );
    }

    // ─────────────────────────────────────────────
    // MODO MANUAL (actual)
    // ─────────────────────────────────────────────
    return (
        <div className="group relative p-4 rounded-xl border border-joy-green-100 bg-white/60 
                    backdrop-blur-sm hover:shadow-md hover:border-joy-green-200 
                    transition-all duration-300 animate-slide-up">
            {/* Botón eliminar */}
            {!isOnly && (
                <button
                    type="button"
                    onClick={() => onRemove(producto.id)}
                    className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-100 text-red-500 
                     opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white
                     transition-all duration-200 shadow-sm hover:shadow-md z-10"
                    title="Eliminar producto"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            )}

            <div className="space-y-3">
                {/* Nombre del producto y cantidad */}
                <div className="flex gap-3">
                    <div className="flex-1 space-y-1">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            Producto
                        </label>
                        <input
                            type="text"
                            value={producto.nombre}
                            onChange={(e) => handleChange("nombre", e.target.value)}
                            placeholder="Nombre del producto..."
                            className="w-full px-3 py-2 rounded-lg border border-joy-green-200 bg-white
                         focus:outline-none focus:ring-2 focus:ring-joy-green-400 focus:border-transparent
                         placeholder:text-joy-green-300 transition-all duration-200 text-sm"
                        />
                    </div>
                    <div className="w-20 space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            Cant.
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={producto.cantidad}
                            onChange={(e) =>
                                handleChange("cantidad", parseInt(e.target.value) || 1)
                            }
                            className="w-full px-3 py-2 rounded-lg border border-joy-green-200 bg-white
                         focus:outline-none focus:ring-2 focus:ring-joy-green-400 focus:border-transparent
                         transition-all duration-200 text-sm text-center"
                        />
                    </div>
                </div>

                {/* Notas opcionales */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <StickyNote className="w-3 h-3" />
                        Notas <span className="text-joy-green-300">(opcional)</span>
                    </label>
                    <input
                        type="text"
                        value={producto.notas}
                        onChange={(e) => handleChange("notas", e.target.value)}
                        placeholder="Ej: sin azúcar, empaque especial..."
                        className="w-full px-3 py-2 rounded-lg border border-joy-green-100 bg-joy-green-50/30
                       focus:outline-none focus:ring-2 focus:ring-joy-green-400 focus:border-transparent
                       placeholder:text-joy-green-300 transition-all duration-200 text-sm"
                    />
                </div>
            </div>
        </div>
    );
}
