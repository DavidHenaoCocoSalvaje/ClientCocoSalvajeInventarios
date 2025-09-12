import { BACKEND_API_URL } from '$env/static/private';
import { CSRequest } from '$lib';

export async function load({ cookies }) {
    const access_token = cookies.get('token') || '';
    const request = new CSRequest(BACKEND_API_URL);

    let pedidos = await request.get<Array<Record<string, any>>>('/transacciones', '/pedidos', access_token);
    pedidos = pedidos.map((pedido: any) => ({
        ...pedido,
        fecha: new Date(pedido.fecha).toLocaleString('es-CO'),
        factura_numero: pedido.factura_numero ? pedido.factura_numero : '-',
        log: pedido.log ? pedido.log : '-'
    }));

    return { pedidos };
}
