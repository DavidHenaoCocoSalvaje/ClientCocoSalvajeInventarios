import { BACKEND_API_URL } from '$env/static/private';
import { GetArray } from '$lib';

export async function load({ cookies }) {
    const access_token = cookies.get('token') || '';

    let pedidos = await GetArray(BACKEND_API_URL, '/transacciones', '/pedidos', access_token);
    pedidos = pedidos.map((pedido: any) => ({
        ...pedido,
        fecha: new Date(pedido.fecha).toLocaleString('es-CO'),
        factura_numero: pedido.factura_numero ? pedido.factura_numero : '-'
    }));

    return { pedidos };
}
