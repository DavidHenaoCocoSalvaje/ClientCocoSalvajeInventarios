export interface Pedido {
    id: string;
    fecha: string;
    numero: number;
    pago: boolean;
    factura_numero: number;
    contabilizado: boolean;
    log: string;
    q_intentos: number
}

export class TransaccionesFormat {
    static pedidos(pedidos: Array<Pedido>) {
        return pedidos.map((pedido: Pedido) => ({
            ...pedido,
            fecha: new Date(pedido.fecha).toLocaleString('es-CO'),
            factura_numero: pedido.factura_numero ? pedido.factura_numero : 0,
            log: pedido.log ? pedido.log : '-'
        }));
    }
}