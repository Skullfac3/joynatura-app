"use client";

// ===================================
// ClienteTable - Tabla de clientes con acciones
// ===================================

import { Edit3, Trash2, MapPin, Phone, Mail, Building2, Users } from "lucide-react";

export interface ClienteRow {
    id: string;
    nombre: string;
    tipo: string;
    telefono: string;
    email: string;
    calle: string;
    numero: string;
    colonia: string;
    ciudad: string;
    estado: string;
    fechaCreacion: string;
}

interface ClienteTableProps {
    clientes: ClienteRow[];
    onEditar: (cliente: ClienteRow) => void;
    onEliminar: (cliente: ClienteRow) => void;
    loading?: boolean;
}

export default function ClienteTable({
    clientes,
    onEditar,
    onEliminar,
    loading = false,
}: ClienteTableProps) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-joy-green-500 border-t-transparent" />
                <span className="ml-3 text-joy-green-600 font-medium">Cargando clientes...</span>
            </div>
        );
    }

    if (clientes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 rounded-full bg-joy-green-100 mb-4">
                    <Users className="w-8 h-8 text-joy-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-joy-green-700">
                    No hay clientes aún
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Agrega tu primer cliente con el botón de arriba
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-joy-green-100 shadow-sm">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gradient-to-r from-joy-green-50 to-joy-cream-50 border-b border-joy-green-100">
                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-joy-green-700 uppercase tracking-wider">
                                Cliente
                            </th>
                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-joy-green-700 uppercase tracking-wider">
                                Tipo
                            </th>
                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-joy-green-700 uppercase tracking-wider">
                                Contacto
                            </th>
                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-joy-green-700 uppercase tracking-wider">
                                Ciudad
                            </th>
                            <th className="text-center px-5 py-3.5 text-xs font-semibold text-joy-green-700 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map((cliente, index) => (
                            <tr
                                key={cliente.id}
                                className={`border-b border-joy-green-50 hover:bg-joy-green-50/50 transition-colors duration-150
                                    ${index % 2 === 0 ? "bg-white" : "bg-joy-green-50/20"}`}
                            >
                                <td className="px-5 py-4">
                                    <div className="font-semibold text-gray-800">
                                        {cliente.nombre}
                                    </div>
                                    {cliente.colonia && (
                                        <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            Col. {cliente.colonia}
                                        </div>
                                    )}
                                </td>
                                <td className="px-5 py-4">
                                    <span
                                        className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${cliente.tipo === "local"
                                                ? "bg-joy-green-100 text-joy-green-700"
                                                : "bg-joy-cream-200 text-joy-gold-600"
                                            }`}
                                    >
                                        {cliente.tipo === "local" ? (
                                            <Building2 className="w-3 h-3" />
                                        ) : (
                                            <MapPin className="w-3 h-3" />
                                        )}
                                        {cliente.tipo === "local" ? "Local" : "Foráneo"}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="space-y-0.5">
                                        {cliente.telefono && (
                                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                <Phone className="w-3 h-3 text-joy-green-400" />
                                                {cliente.telefono}
                                            </div>
                                        )}
                                        {cliente.email && (
                                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                <Mail className="w-3 h-3 text-joy-green-400" />
                                                {cliente.email}
                                            </div>
                                        )}
                                        {!cliente.telefono && !cliente.email && (
                                            <span className="text-xs text-gray-300">—</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-gray-600">
                                    {cliente.ciudad || "—"}
                                    {cliente.ciudad && cliente.estado && ", "}
                                    {cliente.estado}
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => onEditar(cliente)}
                                            className="p-2 rounded-lg text-joy-green-500 hover:bg-joy-green-100 hover:text-joy-green-700 transition-all"
                                            title="Editar"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onEliminar(cliente)}
                                            className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-joy-green-100">
                {clientes.map((cliente) => (
                    <div key={cliente.id} className="p-4 bg-white hover:bg-joy-green-50/30 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="font-semibold text-gray-800">{cliente.nombre}</h3>
                                <span
                                    className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${cliente.tipo === "local"
                                            ? "bg-joy-green-100 text-joy-green-700"
                                            : "bg-joy-cream-200 text-joy-gold-600"
                                        }`}
                                >
                                    {cliente.tipo === "local" ? "Local" : "Foráneo"}
                                </span>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => onEditar(cliente)}
                                    className="p-2 rounded-lg text-joy-green-500 hover:bg-joy-green-100 transition-all"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onEliminar(cliente)}
                                    className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1 text-xs text-gray-500">
                            {cliente.telefono && (
                                <div className="flex items-center gap-1.5">
                                    <Phone className="w-3 h-3" /> {cliente.telefono}
                                </div>
                            )}
                            {cliente.email && (
                                <div className="flex items-center gap-1.5">
                                    <Mail className="w-3 h-3" /> {cliente.email}
                                </div>
                            )}
                            {(cliente.ciudad || cliente.estado) && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-3 h-3" />
                                    {cliente.ciudad}{cliente.ciudad && cliente.estado && ", "}{cliente.estado}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
