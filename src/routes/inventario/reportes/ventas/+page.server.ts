import { BACKEND_API_URL } from '$env/static/private';
import { startEndMonth } from '$lib';
import { Movimiento } from '$lib/routes/Inventario';
import type { Actions } from './$types';

export async function load({ cookies }) {
	const access_token = cookies.get('token') || '';
	const dates = startEndMonth(new Date());

	const ventas = await Movimiento.get_ventas(BACKEND_API_URL, access_token, dates[0], dates[1]);

	return {
		ventas
	};
}

export const actions = {} satisfies Actions;
