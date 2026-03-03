"use client";

// ===================================
// Preview Page - Vista previa dedicada del pedido
// Recibe datos desde localStorage para compartir entre rutas
// ===================================

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pedido } from "@/types";
import PedidoPreview from "@/components/PedidoPreview";
import ActionButtons from "@/components/ActionButtons";
import { ArrowLeft, Leaf } from "lucide-react";

export default function PreviewPage() {
    const router = useRouter();
    const [pedido, setPedido] = useState<Pedido | null>(null);

    useEffect(() => {
        // Leer datos del pedido desde localStorage
        const data = localStorage.getItem("joynatura-pedido");
        if (data) {
            try {
                setPedido(JSON.parse(data));
            } catch {
                console.error("Error al parsear pedido desde localStorage");
                router.push("/");
            }
        } else {
            // Si no hay datos, redirigir al inicio
            router.push("/");
        }
    }, [router]);

    const handleNuevoPedido = () => {
        localStorage.removeItem("joynatura-pedido");
        router.push("/");
    };

    if (!pedido) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center animate-fade-in">
                    <Leaf className="w-12 h-12 text-joy-green-400 mx-auto mb-4 animate-pulse" />
                    <p className="text-joy-green-500 text-sm">Cargando pedido...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen pb-12">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-joy-green-100 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2 text-joy-green-600 hover:text-joy-green-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Volver</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-joy-green-500" />
                        <span className="font-bold text-joy-green-800">JoyNatura</span>
                    </div>
                </div>
            </header>

            {/* Contenido */}
            <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
                <PedidoPreview pedido={pedido} />
                <ActionButtons pedido={pedido} onNuevoPedido={handleNuevoPedido} />
            </div>
        </main>
    );
}
