import { BACKEND_API_URL } from '$env/static/private';
import { SortDirection } from '$lib';
import { Compra } from '$lib/routes/transacciones';
import type { Actions } from './$types';

export async function load({ cookies }) {
	const access_token = cookies.get('token') || '';
	return {
		compras: await Compra.get_list({
			url: BACKEND_API_URL,
			access_token,
			skip: 0,
			limit: 200,
			sort: SortDirection.DESC
		})
	};
}

export const actions = {} satisfies Actions;
