import { BACKEND_API_URL } from '$env/static/private';
import { CSRequest } from '$lib';
import { MovimientosFormat, type IMovimiento } from '$lib/routes/Inventario/index.js';

export async function load({ cookies }) {
    const access_token = cookies.get('token') || '';
    const request = new CSRequest(BACKEND_API_URL);

    let movimientos = await request.get<Array<IMovimiento>>('/inventario', '/movimientos', access_token, undefined, {
        skip: '0',
        limit: '200',
        sort: 'desc'
    });
    movimientos = MovimientosFormat.movimientos(movimientos);

    return { movimientos };
}
