"use client";

// ===================================
// ClienteForm - Formulario de datos del cliente
// ===================================

import { Cliente, TipoCliente } from "@/types";
import { User, MapPin, Building2 } from "lucide-react";

interface ClienteFormProps {
    cliente: Cliente;
    onChange: (cliente: Cliente) => void;
}

export default function ClienteForm({ cliente, onChange }: ClienteFormProps) {
    /** Actualizar un campo directo del cliente */
    const handleChange = (field: keyof Cliente, value: string) => {
        onChange({ ...cliente, [field]: value });
    };

    /** Actualizar un campo de la dirección */
    const handleDireccionChange = (field: string, value: string) => {
        onChange({
            ...cliente,
            direccion: { ...cliente.direccion, [field]: value },
        });
    };

    /** Cambiar tipo de cliente */
    const handleTipoChange = (tipo: TipoCliente) => {
        onChange({ ...cliente, tipo });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Encabezado de sección */}
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-joy-green-100">
                    <User className="w-5 h-5 text-joy-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-joy-green-800">
                    Datos del Cliente
                </h2>
            </div>

            {/* Nombre del cliente */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-joy-green-700">
                    Nombre completo
                </label>
                <input
                    type="text"
                    value={cliente.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                    placeholder="Nombre del cliente..."
                    className="w-full px-4 py-3 rounded-xl border border-joy-green-200 
                     bg-white/80 backdrop-blur-sm
                     focus:outline-none focus:ring-2 focus:ring-joy-green-400 focus:border-transparent
                     placeholder:text-joy-green-300 transition-all duration-200
                     hover:border-joy-green-300"
                />
            </div>

            {/* Tipo de cliente - Toggle */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-joy-green-700">
                    Tipo de cliente
                </label>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => handleTipoChange("local")}
                        className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300
              ${cliente.tipo === "local"
                                ? "bg-joy-green-500 text-white shadow-lg shadow-joy-green-200 scale-[1.02]"
                                : "bg-joy-green-50 text-joy-green-600 hover:bg-joy-green-100"
                            }`}
                    >
                        <Building2 className="w-4 h-4 inline-block mr-2" />
                        Local
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTipoChange("foraneo")}
                        className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300
              ${cliente.tipo === "foraneo"
                                ? "bg-joy-cream-500 text-white shadow-lg shadow-joy-cream-200 scale-[1.02]"
                                : "bg-joy-cream-50 text-joy-cream-500 hover:bg-joy-cream-100"
                            }`}
                    >
                        <MapPin className="w-4 h-4 inline-block mr-2" />
                        Foráneo
                    </button>
                </div>
            </div>

            {/* Dirección de entrega */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-joy-cream-100">
                        <MapPin className="w-5 h-5 text-joy-gold-500" />
                    </div>
                    <h3 className="text-sm font-semibold text-joy-green-700">
                        Dirección de entrega
                    </h3>
                </div>

                {/* Calle y Número en una fila */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            Calle
                        </label>
                        <input
                            type="text"
                            value={cliente.direccion.calle}
                            onChange={(e) => handleDireccionChange("calle", e.target.value)}
                            placeholder="Nombre de la calle"
                            className="w-full px-4 py-2.5 rounded-xl border border-joy-green-200 
                         bg-white/80 backdrop-blur-sm
                         focus:outline-none focus:ring-2 focus:ring-joy-green-400 focus:border-transparent
                         placeholder:text-joy-green-300 transition-all duration-200 text-sm"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            Número
                        </label>
                        <input
                            type="text"
                            value={cliente.direccion.numero}
                            onChange={(e) => handleDireccionChange("numero", e.target.value)}
                            placeholder="#"
                            className="w-full px-4 py-2.5 rounded-xl border border-joy-green-200 
                         bg-white/80 backdrop-blur-sm
                         focus:outline-none focus:ring-2 focus:ring-joy-green-400 focus:border-transparent
                         placeholder:text-joy-green-300 transition-all duration-200 text-sm"
                        />
                    </div>
                </div>

                {/* Colonia */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                        Colonia
                    </label>
                    <input
                        type="text"
                        value={cliente.direccion.colonia}
                        onChange={(e) => handleDireccionChange("colonia", e.target.value)}
                        placeholder="Nombre de la colonia"
                        className="w-full px-4 py-2.5 rounded-xl border border-joy-green-200 
                       bg-white/80 backdrop-blur-sm
                       focus:outline-none focus:ring-2 focus:ring-joy-green-400 focus:border-transparent
                       placeholder:text-joy-green-300 transition-all duration-200 text-sm"
                    />
                </div>

                {/* Ciudad y Estado */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            Ciudad
                        </label>
                        <input
                            type="text"
                            value={cliente.direccion.ciudad}
                            onChange={(e) => handleDireccionChange("ciudad", e.target.value)}
                            placeholder="Ciudad"
                            className="w-full px-4 py-2.5 rounded-xl border border-joy-green-200 
                         bg-white/80 backdrop-blur-sm
                         focus:outline-none focus:ring-2 focus:ring-joy-green-400 focus:border-transparent
                         placeholder:text-joy-green-300 transition-all duration-200 text-sm"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            Estado
                        </label>
                        <input
                            type="text"
                            value={cliente.direccion.estado}
                            onChange={(e) => handleDireccionChange("estado", e.target.value)}
                            placeholder="Estado"
                            className="w-full px-4 py-2.5 rounded-xl border border-joy-green-200 
                         bg-white/80 backdrop-blur-sm
                         focus:outline-none focus:ring-2 focus:ring-joy-green-400 focus:border-transparent
                         placeholder:text-joy-green-300 transition-all duration-200 text-sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
