"use client";

// ===================================
// Página principal - Formulario de pedido
// ===================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Cliente,
    Producto,
    crearClienteVacio,
    crearProductoVacio,
} from "@/types";
import ClienteForm from "@/components/ClienteForm";
import ProductoList from "@/components/ProductoList";
import PedidoPreview from "@/components/PedidoPreview";
import ActionButtons from "@/components/ActionButtons";
import { Leaf, Eye, ChevronUp, Sparkles, Users } from "lucide-react";

export default function Home() {
    // ─── Estado centralizado ───
    const [cliente, setCliente] = useState<Cliente>(crearClienteVacio());
    const [productos, setProductos] = useState<Producto[]>([crearProductoVacio()]);
    const [mostrarPreview, setMostrarPreview] = useState(false);

    /** Fecha actual formateada */
    const fechaActual = new Date().toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    /** Objeto pedido completo */
    const pedido = {
        cliente,
        productos,
        fecha: fechaActual,
    };

    /** Verificar si el formulario tiene datos mínimos */
    const formularioValido =
        cliente.nombre.trim() !== "" &&
        productos.some((p) => p.nombre.trim() !== "");

    /** Limpiar todo y empezar nuevo pedido */
    const nuevoPedido = () => {
        setCliente(crearClienteVacio());
        setProductos([crearProductoVacio()]);
        setMostrarPreview(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <main className="min-h-screen pb-12">
            {/* ─── Header ─── */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-joy-green-100 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-joy-green-400 to-joy-green-600 shadow-lg shadow-joy-green-200">
                            <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-joy-green-800 tracking-tight">
                                JoyNatura
                            </h1>
                            <p className="text-xs text-joy-green-500 -mt-0.5">
                                Clientes Foráneos y Locales
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/clientes"
                            className="flex items-center gap-1.5 text-sm text-joy-green-600 hover:text-joy-green-800 font-medium transition-colors
                               px-3 py-1.5 rounded-lg hover:bg-joy-green-50"
                        >
                            <Users className="w-4 h-4" />
                            Clientes
                        </Link>
                        <span className="text-xs text-muted-foreground hidden sm:block">
                            {fechaActual}
                        </span>
                    </div>
                </div>
            </header>

            {/* ─── Contenido principal ─── */}
            <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
                {/* Sección: Datos del cliente */}
                <section className="bg-white/60 backdrop-blur-sm rounded-2xl border border-joy-green-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <ClienteForm cliente={cliente} onChange={setCliente} />
                </section>

                {/* Sección: Productos */}
                <section className="bg-white/60 backdrop-blur-sm rounded-2xl border border-joy-green-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <ProductoList productos={productos} onChange={setProductos} />
                </section>

                {/* Botón ver preview */}
                {!mostrarPreview && (
                    <button
                        type="button"
                        onClick={() => setMostrarPreview(true)}
                        disabled={!formularioValido}
                        className="w-full py-4 px-6 rounded-2xl font-semibold text-lg
                       bg-gradient-to-r from-joy-green-500 to-joy-green-600 text-white
                       shadow-xl shadow-joy-green-200/50
                       hover:from-joy-green-600 hover:to-joy-green-700 hover:shadow-2xl hover:shadow-joy-green-300/50
                       transition-all duration-300 active:scale-[0.99]
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-xl
                       flex items-center justify-center gap-3"
                    >
                        <Eye className="w-5 h-5" />
                        Ver Vista Previa del Pedido
                        <Sparkles className="w-4 h-4" />
                    </button>
                )}

                {/* Sección: Preview y Acciones */}
                {mostrarPreview && (
                    <div className="space-y-6 animate-slide-up">
                        {/* Botón para ocultar preview */}
                        <button
                            type="button"
                            onClick={() => setMostrarPreview(false)}
                            className="w-full py-2 text-sm text-joy-green-500 hover:text-joy-green-700 
                         flex items-center justify-center gap-1 transition-colors"
                        >
                            <ChevronUp className="w-4 h-4" />
                            Ocultar vista previa
                        </button>

                        {/* Preview del pedido */}
                        <PedidoPreview pedido={pedido} />

                        {/* Botones de acción */}
                        <ActionButtons pedido={pedido} onNuevoPedido={nuevoPedido} />
                    </div>
                )}
            </div>

            {/* ─── Footer ─── */}
            <footer className="mt-16 text-center text-xs text-joy-green-400 pb-4">
                <p>🌿 JoyNatura © {new Date().getFullYear()} — Hecho con amor 🌿</p>
            </footer>
        </main>
    );
}
