import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});

export const metadata: Metadata = {
    title: "JoyNatura - Clientes Foráneos y Locales",
    description:
        "Gestión de pedidos para clientes locales y foráneos. Genera resúmenes para WhatsApp y PDF.",
    keywords: ["JoyNatura", "pedidos", "clientes", "productos naturales"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className={`${outfit.variable} font-sans`}>
                {/* Fondo decorativo global */}
                <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-joy-green-100/40 blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-joy-cream-200/30 blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-joy-green-50/20 blur-3xl" />
                </div>
                {children}
            </body>
        </html>
    );
}
