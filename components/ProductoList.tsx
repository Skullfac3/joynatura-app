"use client";

// ===================================
// ProductoList - Lista dinámica de productos
// ===================================

import { Producto, crearProductoVacio, ModoProducto } from "@/types";
import ProductoItem from "./ProductoItem";
import { Plus, ShoppingBag } from "lucide-react";

interface ProductoListProps {
    productos: Producto[];
    onChange: (productos: Producto[]) => void;
    /** Modo global de entrada de productos (propagado a cada item) */
    modo?: ModoProducto;
}

export default function ProductoList({
    productos,
    onChange,
    modo = "manual",
}: ProductoListProps) {
    /** Agregar un nuevo producto vacío a la lista */
    const agregarProducto = () => {
        onChange([...productos, crearProductoVacio()]);
    };

    /** Eliminar un producto por ID */
    const eliminarProducto = (id: string) => {
        onChange(productos.filter((p) => p.id !== id));
    };

    /** Actualizar un producto específico */
    const actualizarProducto = (productoActualizado: Producto) => {
        onChange(
            productos.map((p) =>
                p.id === productoActualizado.id ? productoActualizado : p
            )
        );
    };

    return (
        <div className="space-y-4 animate-fade-in">
            {/* Encabezado de sección */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-joy-cream-100">
                        <ShoppingBag className="w-5 h-5 text-joy-gold-500" />
                    </div>
                    <h2 className="text-lg font-semibold text-joy-green-800">
                        Productos
                    </h2>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-joy-green-100 text-joy-green-600 font-medium">
                        {productos.length}
                    </span>
                </div>
            </div>

            {/* Lista de productos */}
            <div className="space-y-3">
                {productos.map((producto) => (
                    <ProductoItem
                        key={producto.id}
                        producto={producto}
                        modo={modo}
                        onChange={actualizarProducto}
                        onRemove={eliminarProducto}
                        isOnly={productos.length === 1}
                    />
                ))}
            </div>

            {/* Botón agregar producto */}
            <button
                type="button"
                onClick={agregarProducto}
                className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-joy-green-200
                   text-joy-green-500 font-medium text-sm
                   hover:border-joy-green-400 hover:bg-joy-green-50 hover:text-joy-green-600
                   transition-all duration-300 flex items-center justify-center gap-2
                   active:scale-[0.98]"
            >
                <Plus className="w-4 h-4" />
                Agregar producto
            </button>
        </div>
    );
}
