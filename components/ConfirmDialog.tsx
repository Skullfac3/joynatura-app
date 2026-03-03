"use client";

// ===================================
// ConfirmDialog - Diálogo de confirmación
// ===================================

import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
    isOpen: boolean;
    titulo: string;
    mensaje: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export default function ConfirmDialog({
    isOpen,
    titulo,
    mensaje,
    onConfirm,
    onCancel,
    loading = false,
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scale-in">
                <button
                    onClick={onCancel}
                    className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-red-100 shrink-0">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {titulo}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{mensaje}</p>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium
                           hover:bg-gray-50 transition-all duration-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-red-500 text-white font-medium
                           hover:bg-red-600 shadow-lg shadow-red-200 transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Eliminando..." : "Eliminar"}
                    </button>
                </div>
            </div>
        </div>
    );
}
