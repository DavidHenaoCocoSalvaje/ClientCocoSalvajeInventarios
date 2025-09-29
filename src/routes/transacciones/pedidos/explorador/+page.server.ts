import { BACKEND_API_URL } from '$env/static/private';
import { SortDirection } from '$lib';
import { Pedido } from '$lib/routes/transacciones';
import type { Actions } from './$types';

export async function load({ cookies }) {
	const access_token = cookies.get('token') || '';
	const pedido = new Pedido();
	return {
		pedidos: await pedido.get_list(BACKEND_API_URL, access_token, 0, 200, SortDirection.DESC)
	};
}

export const actions = {} satisfies Actions;
