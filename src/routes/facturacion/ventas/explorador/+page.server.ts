import { BACKEND_API_URL } from '$env/static/private';
import { SortDirection } from '$lib';
import { Venta } from '$lib/routes/facturacion';
import type { Actions } from './$types';

export async function load({ cookies }) {
	const access_token = cookies.get('token') || '';
	return {
		ventas: await Venta.get_list({
			url: BACKEND_API_URL,
			access_token,
			skip: 0,
			limit: 200,
			sort: SortDirection.DESC
		})
	};
}

export const actions = {} satisfies Actions;
