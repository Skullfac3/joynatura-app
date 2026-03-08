"use client";

// ===================================
// ProductoItem - Ítem individual de producto
// Con modo catálogo: dropdown searchable conectado a la DB
// ===================================

import { Producto, ModoProducto } from "@/types";
import { X, Package, StickyNote, Search, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

/** Tipo de producto del catálogo (de la API) */
interface ProductoCatalogo {
    id: string;
    numero: number;
    nombre: string;
    precioMayoreo: number;
    precioMenudeo: number;
}

interface ProductoItemProps {
    producto: Producto;
    modo: ModoProducto;
    onChange: (producto: Producto) => void;
    onRemove: (id: string) => void;
    isOnly: boolean;
    /** Lista de productos del catálogo (cargados desde API) */
    catalogo?: ProductoCatalogo[];
    /** Tipo de precio a mostrar */
    tipoPrecio?: "mayoreo" | "menudeo";
}

export default function ProductoItem({
    producto,
    modo,
    onChange,
    onRemove,
    isOnly,
    catalogo = [],
    tipoPrecio = "mayoreo",
}: ProductoItemProps) {
    const [busqueda, setBusqueda] = useState("");
    const [abierto, setAbierto] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    /** Actualizar un campo del producto */
    const handleChange = (field: keyof Producto, value: string | number) => {
        onChange({ ...producto, [field]: value });
    };

    /** Filtrar productos del catálogo según búsqueda */
    const productosFiltrados = catalogo.filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    /** Seleccionar un producto del catálogo */
    const seleccionarProducto = (catalItem: ProductoCatalogo) => {
        const precio = tipoPrecio === "mayoreo" ? catalItem.precioMayoreo : catalItem.precioMenudeo;
        onChange({
            ...producto,
            nombre: catalItem.nombre,
            notas: `$${precio.toFixed(2)}`,
        });
        setBusqueda("");
        setAbierto(false);
    };

    /** Cerrar dropdown al hacer click afuera */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setAbierto(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                    <div className="flex-1 space-y-1" ref={dropdownRef}>
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            Producto
                        </label>

                        {modo === "catalogo" ? (
                            /* ─── MODO CATÁLOGO: Dropdown searchable ─── */
                            <div className="relative">
                                <div
                                    className="w-full px-3 py-2 rounded-lg border border-joy-green-200 bg-white
                                     cursor-pointer flex items-center justify-between gap-2
                                     focus-within:ring-2 focus-within:ring-joy-green-400 focus-within:border-transparent
                                     transition-all duration-200 text-sm"
                                    onClick={() => setAbierto(!abierto)}
                                >
                                    {producto.nombre ? (
                                        <span className="text-gray-800 truncate">{producto.nombre}</span>
                                    ) : (
                                        <span className="text-joy-green-300">Seleccionar producto...</span>
                                    )}
                                    <ChevronDown className={`w-4 h-4 text-joy-green-400 transition-transform duration-200 shrink-0 ${abierto ? "rotate-180" : ""}`} />
                                </div>

                                {abierto && (
                                    <div className="absolute z-20 w-full mt-1 bg-white rounded-xl border border-joy-green-200 
                                          shadow-xl max-h-60 overflow-hidden animate-slide-up">
                                        {/* Buscador */}
                                        <div className="p-2 border-b border-joy-green-100 sticky top-0 bg-white">
                                            <div className="relative">
                                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-joy-green-400" />
                                                <input
                                                    type="text"
                                                    autoFocus
                                                    value={busqueda}
                                                    onChange={(e) => setBusqueda(e.target.value)}
                                                    placeholder="Buscar producto..."
                                                    className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-joy-green-100 
                                                     focus:outline-none focus:ring-1 focus:ring-joy-green-400
                                                     placeholder:text-joy-green-300"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                        </div>

                                        {/* Lista de opciones */}
                                        <div className="max-h-48 overflow-y-auto">
                                            {productosFiltrados.length === 0 ? (
                                                <div className="p-3 text-sm text-joy-green-400 text-center italic">
                                                    No se encontraron productos
                                                </div>
                                            ) : (
                                                productosFiltrados.map((item) => {
                                                    const precio = tipoPrecio === "mayoreo" ? item.precioMayoreo : item.precioMenudeo;
                                                    return (
                                                        <button
                                                            key={item.id}
                                                            type="button"
                                                            className="w-full text-left px-3 py-2.5 text-sm hover:bg-joy-green-50 
                                                             transition-colors flex items-center justify-between gap-2
                                                             border-b border-joy-green-50 last:border-0"
                                                            onClick={() => seleccionarProducto(item)}
                                                        >
                                                            <span className="truncate text-gray-700">{item.nombre}</span>
                                                            <span className="shrink-0 text-xs font-semibold text-joy-gold-500 bg-joy-cream-50 px-2 py-0.5 rounded-full">
                                                                ${precio.toFixed(2)}
                                                            </span>
                                                        </button>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* ─── MODO MANUAL ─── */
                            <input
                                type="text"
                                value={producto.nombre}
                                onChange={(e) => handleChange("nombre", e.target.value)}
                                placeholder="Nombre del producto..."
                                className="w-full px-3 py-2 rounded-lg border border-joy-green-200 bg-white
                             focus:outline-none focus:ring-2 focus:ring-joy-green-400 focus:border-transparent
                             placeholder:text-joy-green-300 transition-all duration-200 text-sm"
                            />
                        )}
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
