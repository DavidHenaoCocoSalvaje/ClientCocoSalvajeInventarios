import { BACKEND_API_URL } from '$env/static/private';
import { CSRequest } from '$lib';
import { TransaccionesFormat, type Pedido } from '$lib/routes/transacciones/index.js';

export async function load({ cookies }) {
    const access_token = cookies.get('token') || '';
    const request = new CSRequest(BACKEND_API_URL);

    let pedidos = await request.get<Array<Pedido>>('/transacciones', '/pedidos', access_token, undefined, {
        skip: '0',
        limit: '200',
        sort: 'desc'
    });
    pedidos = TransaccionesFormat.pedidos(pedidos);

    return { pedidos };
}
