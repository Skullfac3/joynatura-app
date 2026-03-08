"use client";

// ===================================
// ProductoList - Lista dinámica de productos
// Con toggle Mayoreo/Menudeo y carga de catálogo
// ===================================

import { Producto, crearProductoVacio, ModoProducto } from "@/types";
import ProductoItem from "./ProductoItem";
import { Plus, ShoppingBag, Store, Truck } from "lucide-react";
import { useState, useEffect } from "react";

/** Tipo de producto del catálogo */
interface ProductoCatalogo {
    id: string;
    numero: number;
    nombre: string;
    precioMayoreo: number;
    precioMenudeo: number;
}

interface ProductoListProps {
    productos: Producto[];
    onChange: (productos: Producto[]) => void;
    /** Modo global de entrada de productos */
    modo?: ModoProducto;
}

export default function ProductoList({
    productos,
    onChange,
    modo = "catalogo",
}: ProductoListProps) {
    const [catalogo, setCatalogo] = useState<ProductoCatalogo[]>([]);
    const [tipoPrecio, setTipoPrecio] = useState<"mayoreo" | "menudeo">("mayoreo");
    const [cargando, setCargando] = useState(false);

    /** Cargar catálogo de productos desde la API */
    useEffect(() => {
        const cargarCatalogo = async () => {
            setCargando(true);
            try {
                const res = await fetch("/api/productos");
                if (res.ok) {
                    const data = await res.json();
                    setCatalogo(data);
                }
            } catch (error) {
                console.error("Error al cargar catálogo:", error);
            } finally {
                setCargando(false);
            }
        };
        cargarCatalogo();
    }, []);

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

            {/* Toggle Mayoreo / Menudeo */}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setTipoPrecio("mayoreo")}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2
                      ${tipoPrecio === "mayoreo"
                            ? "bg-joy-green-500 text-white shadow-lg shadow-joy-green-200 scale-[1.02]"
                            : "bg-joy-green-50 text-joy-green-600 hover:bg-joy-green-100"
                        }`}
                >
                    <Truck className="w-4 h-4" />
                    Mayoreo
                </button>
                <button
                    type="button"
                    onClick={() => setTipoPrecio("menudeo")}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2
                      ${tipoPrecio === "menudeo"
                            ? "bg-joy-cream-500 text-white shadow-lg shadow-joy-cream-200 scale-[1.02]"
                            : "bg-joy-cream-50 text-joy-cream-500 hover:bg-joy-cream-100"
                        }`}
                >
                    <Store className="w-4 h-4" />
                    Menudeo
                </button>
            </div>

            {/* Estado de carga */}
            {cargando && (
                <div className="text-sm text-joy-green-400 text-center py-2 animate-pulse">
                    Cargando catálogo de productos...
                </div>
            )}

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
                        catalogo={catalogo}
                        tipoPrecio={tipoPrecio}
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
