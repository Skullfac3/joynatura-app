"use client";

// ===================================
// Página de Gestión de Clientes - CRUD completo
// ===================================

import { useState, useEffect, useCallback } from "react";
import { Leaf, UserPlus, Search, FileSpreadsheet, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ClienteTable, { ClienteRow } from "@/components/ClienteTable";
import ClienteModal, { ClienteFormData } from "@/components/ClienteModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { exportarClientesExcel } from "@/lib/excel";

export default function ClientesPage() {
    // ─── Estado ───
    const [clientes, setClientes] = useState<ClienteRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [debouncedBusqueda, setDebouncedBusqueda] = useState("");

    // Modal
    const [modalAbierto, setModalAbierto] = useState(false);
    const [clienteEditando, setClienteEditando] = useState<ClienteRow | null>(null);
    const [guardando, setGuardando] = useState(false);

    // Confirm Delete
    const [confirmAbierto, setConfirmAbierto] = useState(false);
    const [clienteAEliminar, setClienteAEliminar] = useState<ClienteRow | null>(null);
    const [eliminando, setEliminando] = useState(false);

    // ─── Debounce de búsqueda ───
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedBusqueda(busqueda), 300);
        return () => clearTimeout(timer);
    }, [busqueda]);

    // ─── Cargar clientes ───
    const cargarClientes = useCallback(async () => {
        setLoading(true);
        try {
            const params = debouncedBusqueda ? `?buscar=${encodeURIComponent(debouncedBusqueda)}` : "";
            const res = await fetch(`/api/clientes${params}`);
            if (res.ok) {
                const data = await res.json();
                setClientes(data);
            }
        } catch (error) {
            console.error("Error al cargar clientes:", error);
        } finally {
            setLoading(false);
        }
    }, [debouncedBusqueda]);

    useEffect(() => {
        cargarClientes();
    }, [cargarClientes]);

    // ─── Handlers ───

    /** Abrir modal para nuevo cliente */
    const handleNuevo = () => {
        setClienteEditando(null);
        setModalAbierto(true);
    };

    /** Abrir modal para editar */
    const handleEditar = (cliente: ClienteRow) => {
        setClienteEditando(cliente);
        setModalAbierto(true);
    };

    /** Guardar cliente (crear o actualizar) */
    const handleGuardar = async (data: ClienteFormData) => {
        setGuardando(true);
        try {
            const url = clienteEditando
                ? `/api/clientes/${clienteEditando.id}`
                : "/api/clientes";
            const method = clienteEditando ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setModalAbierto(false);
                setClienteEditando(null);
                cargarClientes();
            }
        } catch (error) {
            console.error("Error al guardar cliente:", error);
        } finally {
            setGuardando(false);
        }
    };

    /** Preparar eliminación */
    const handlePrepararEliminar = (cliente: ClienteRow) => {
        setClienteAEliminar(cliente);
        setConfirmAbierto(true);
    };

    /** Confirmar eliminación */
    const handleConfirmarEliminar = async () => {
        if (!clienteAEliminar) return;
        setEliminando(true);
        try {
            const res = await fetch(`/api/clientes/${clienteAEliminar.id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setConfirmAbierto(false);
                setClienteAEliminar(null);
                cargarClientes();
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
        } finally {
            setEliminando(false);
        }
    };

    /** Exportar a Excel */
    const handleExportarExcel = () => {
        if (clientes.length === 0) return;
        exportarClientesExcel(clientes);
    };

    return (
        <main className="min-h-screen pb-12">
            {/* ─── Header ─── */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-joy-green-100 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-joy-green-400 to-joy-green-600 shadow-lg shadow-joy-green-200">
                            <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-joy-green-800 tracking-tight">
                                JoyNatura
                            </h1>
                            <p className="text-xs text-joy-green-500 -mt-0.5">
                                Gestión de Clientes
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 text-sm text-joy-green-600 hover:text-joy-green-800 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Pedidos
                    </Link>
                </div>
            </header>

            {/* ─── Contenido ─── */}
            <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
                {/* Barra de herramientas */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-joy-green-100">
                            <Users className="w-6 h-6 text-joy-green-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-joy-green-800">Clientes</h2>
                            <p className="text-sm text-muted-foreground">
                                {clientes.length} {clientes.length === 1 ? "cliente registrado" : "clientes registrados"}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            onClick={handleExportarExcel}
                            disabled={clientes.length === 0}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                               bg-joy-cream-100 text-joy-gold-600 border border-joy-cream-300
                               hover:bg-joy-cream-200 transition-all duration-200
                               disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            Excel
                        </button>
                        <button
                            onClick={handleNuevo}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                               bg-gradient-to-r from-joy-green-500 to-joy-green-600 text-white
                               shadow-lg shadow-joy-green-200
                               hover:from-joy-green-600 hover:to-joy-green-700
                               transition-all duration-200 active:scale-[0.98]"
                        >
                            <UserPlus className="w-4 h-4" />
                            Nuevo Cliente
                        </button>
                    </div>
                </div>

                {/* Barra de búsqueda */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-joy-green-400" />
                    <input
                        type="text"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por nombre, ciudad, teléfono, email..."
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-joy-green-200
                           bg-white/80 backdrop-blur-sm
                           focus:outline-none focus:ring-2 focus:ring-joy-green-400 focus:border-transparent
                           placeholder:text-joy-green-300 transition-all duration-200
                           hover:border-joy-green-300"
                    />
                </div>

                {/* Tabla de clientes */}
                <ClienteTable
                    clientes={clientes}
                    onEditar={handleEditar}
                    onEliminar={handlePrepararEliminar}
                    loading={loading}
                />
            </div>

            {/* ─── Footer ─── */}
            <footer className="mt-16 text-center text-xs text-joy-green-400 pb-4">
                <p>🌿 JoyNatura © {new Date().getFullYear()} — Hecho con amor 🌿</p>
            </footer>

            {/* ─── Modales ─── */}
            <ClienteModal
                isOpen={modalAbierto}
                onClose={() => {
                    setModalAbierto(false);
                    setClienteEditando(null);
                }}
                onSave={handleGuardar}
                clienteInicial={
                    clienteEditando
                        ? {
                            nombre: clienteEditando.nombre,
                            tipo: clienteEditando.tipo,
                            telefono: clienteEditando.telefono,
                            email: clienteEditando.email,
                            calle: clienteEditando.calle,
                            numero: clienteEditando.numero,
                            colonia: clienteEditando.colonia,
                            ciudad: clienteEditando.ciudad,
                            estado: clienteEditando.estado,
                        }
                        : null
                }
                loading={guardando}
            />

            <ConfirmDialog
                isOpen={confirmAbierto}
                titulo="Eliminar cliente"
                mensaje={`¿Estás seguro de que deseas eliminar a "${clienteAEliminar?.nombre}"? Esta acción no se puede deshacer.`}
                onConfirm={handleConfirmarEliminar}
                onCancel={() => {
                    setConfirmAbierto(false);
                    setClienteAEliminar(null);
                }}
                loading={eliminando}
            />
        </main>
    );
}
