"use client";

// ===================================
// ClienteModal - Modal para agregar/editar clientes
// ===================================

import { useState, useEffect } from "react";
import { X, User, MapPin, Phone, Mail, Building2 } from "lucide-react";

export interface ClienteFormData {
    nombre: string;
    tipo: string;
    telefono: string;
    email: string;
    calle: string;
    numero: string;
    colonia: string;
    ciudad: string;
    estado: string;
}

interface ClienteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ClienteFormData) => void;
    clienteInicial?: ClienteFormData | null;
    loading?: boolean;
}

const defaultData: ClienteFormData = {
    nombre: "",
    tipo: "local",
    telefono: "",
    email: "",
    calle: "",
    numero: "",
    colonia: "",
    ciudad: "",
    estado: "",
};

export default function ClienteModal({
    isOpen,
    onClose,
    onSave,
    clienteInicial,
    loading = false,
}: ClienteModalProps) {
    const [form, setForm] = useState<ClienteFormData>(defaultData);
    const esEdicion = !!clienteInicial;

    useEffect(() => {
        if (clienteInicial) {
            setForm(clienteInicial);
        } else {
            setForm(defaultData);
        }
    }, [clienteInicial, isOpen]);

    const handleChange = (field: keyof ClienteFormData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.nombre.trim()) return;
        onSave(form);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-joy-green-500 to-joy-green-600 px-6 py-4 rounded-t-2xl flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {esEdicion ? "Editar Cliente" : "Nuevo Cliente"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Nombre */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-joy-green-700 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            Nombre completo *
                        </label>
                        <input
                            type="text"
                            value={form.nombre}
                            onChange={(e) => handleChange("nombre", e.target.value)}
                            placeholder="Nombre del cliente..."
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-joy-green-200 bg-white
                               focus:outline-none focus:ring-2 focus:ring-joy-green-400 focus:border-transparent
                               placeholder:text-joy-green-300 transition-all duration-200"
                        />
                    </div>

                    {/* Tipo de cliente */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-joy-green-700">
                            Tipo de cliente
                        </label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => handleChange("tipo", "local")}
                                className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all duration-300
                                    ${form.tipo === "local"
                                        ? "bg-joy-green-500 text-white shadow-lg shadow-joy-green-200 scale-[1.02]"
                                        : "bg-joy-green-50 text-joy-green-600 hover:bg-joy-green-100"
                                    }`}
                            >
                                <Building2 className="w-4 h-4 inline-block mr-1.5" />
                                Local
                            </button>
                            <button
                                type="button"
                                onClick={() => handleChange("tipo", "foraneo")}
                                className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all duration-300
                                    ${form.tipo === "foraneo"
                                        ? "bg-joy-cream-500 text-white shadow-lg shadow-joy-cream-200 scale-[1.02]"
                                        : "bg-joy-cream-50 text-joy-cream-500 hover:bg-joy-cream-100"
                                    }`}
                            >
                                <MapPin className="w-4 h-4 inline-block mr-1.5" />
                                Foráneo
                            </button>
                        </div>
                    </div>

                    {/* Teléfono y Email */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-joy-green-700 flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5" />
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                value={form.telefono}
                                onChange={(e) => handleChange("telefono", e.target.value)}
                                placeholder="10 dígitos"
                                className="w-full px-4 py-2.5 rounded-xl border border-joy-green-200 bg-white
                                   focus:outline-none focus:ring-2 focus:ring-joy-green-400 focus:border-transparent
                                   placeholder:text-joy-green-300 transition-all duration-200 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-joy-green-700 flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5" />
                                Email
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder="correo@ejemplo.com"
                                className="w-full px-4 py-2.5 rounded-xl border border-joy-green-200 bg-white
                                   focus:outline-none focus:ring-2 focus:ring-joy-green-400 focus:border-transparent
                                   placeholder:text-joy-green-300 transition-all duration-200 text-sm"
                            />
                        </div>
                    </div>

                    {/* Dirección */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-joy-green-700 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            Dirección de entrega
                        </label>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2 space-y-1">
                                <label className="text-xs text-muted-foreground">Calle</label>
                                <input
                                    type="text"
                                    value={form.calle}
                                    onChange={(e) => handleChange("calle", e.target.value)}
                                    placeholder="Nombre de la calle"
                                    className="w-full px-3 py-2 rounded-xl border border-joy-green-200 bg-white
                                       focus:outline-none focus:ring-2 focus:ring-joy-green-400 focus:border-transparent
                                       placeholder:text-joy-green-300 transition-all duration-200 text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Número</label>
                                <input
                                    type="text"
                                    value={form.numero}
                                    onChange={(e) => handleChange("numero", e.target.value)}
                                    placeholder="#"
                                    className="w-full px-3 py-2 rounded-xl border border-joy-green-200 bg-white
                                       focus:outline-none focus:ring-2 focus:ring-joy-green-400 focus:border-transparent
                                       placeholder:text-joy-green-300 transition-all duration-200 text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Colonia</label>
                            <input
                                type="text"
                                value={form.colonia}
                                onChange={(e) => handleChange("colonia", e.target.value)}
                                placeholder="Nombre de la colonia"
                                className="w-full px-3 py-2 rounded-xl border border-joy-green-200 bg-white
                                   focus:outline-none focus:ring-2 focus:ring-joy-green-400 focus:border-transparent
                                   placeholder:text-joy-green-300 transition-all duration-200 text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Ciudad</label>
                                <input
                                    type="text"
                                    value={form.ciudad}
                                    onChange={(e) => handleChange("ciudad", e.target.value)}
                                    placeholder="Ciudad"
                                    className="w-full px-3 py-2 rounded-xl border border-joy-green-200 bg-white
                                       focus:outline-none focus:ring-2 focus:ring-joy-green-400 focus:border-transparent
                                       placeholder:text-joy-green-300 transition-all duration-200 text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Estado</label>
                                <input
                                    type="text"
                                    value={form.estado}
                                    onChange={(e) => handleChange("estado", e.target.value)}
                                    placeholder="Estado"
                                    className="w-full px-3 py-2 rounded-xl border border-joy-green-200 bg-white
                                       focus:outline-none focus:ring-2 focus:ring-joy-green-400 focus:border-transparent
                                       placeholder:text-joy-green-300 transition-all duration-200 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium
                               hover:bg-gray-50 transition-all duration-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !form.nombre.trim()}
                            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-joy-green-500 to-joy-green-600
                               text-white font-semibold shadow-lg shadow-joy-green-200
                               hover:from-joy-green-600 hover:to-joy-green-700
                               transition-all duration-200
                               disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? "Guardando..."
                                : esEdicion
                                    ? "Guardar Cambios"
                                    : "Agregar Cliente"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
