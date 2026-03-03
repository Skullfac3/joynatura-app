// ===================================
// Tipos principales del sistema JoyNatura
// ===================================

/** Modos de entrada de producto */
export type ModoProducto = "manual" | "catalogo";

/** Tipo de cliente */
export type TipoCliente = "local" | "foraneo";

/** Dirección de entrega */
export interface Direccion {
    calle: string;
    numero: string;
    colonia: string;
    ciudad: string;
    estado: string;
}

/** Producto individual en un pedido */
export interface Producto {
    id: string;
    nombre: string;
    cantidad: number;
    notas: string;
    modo: ModoProducto;
}

/** Datos del cliente */
export interface Cliente {
    nombre: string;
    tipo: TipoCliente;
    direccion: Direccion;
}

/** Pedido completo */
export interface Pedido {
    cliente: Cliente;
    productos: Producto[];
    fecha: string;
}

// ===================================
// Valores por defecto / Factories
// ===================================

/** Crear una dirección vacía */
export const crearDireccionVacia = (): Direccion => ({
    calle: "",
    numero: "",
    colonia: "",
    ciudad: "",
    estado: "",
});

/** Crear un cliente vacío */
export const crearClienteVacio = (): Cliente => ({
    nombre: "",
    tipo: "local",
    direccion: crearDireccionVacia(),
});

/** Crear un producto vacío en modo manual */
export const crearProductoVacio = (): Producto => ({
    id: crypto.randomUUID(),
    nombre: "",
    cantidad: 1,
    notas: "",
    modo: "manual",
});
