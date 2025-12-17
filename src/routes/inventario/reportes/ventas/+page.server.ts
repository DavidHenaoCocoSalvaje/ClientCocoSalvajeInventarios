import { BACKEND_API_URL } from '$env/static/private';
import { startEndMonthString } from '$lib';
import { Movimiento } from '$lib/routes/Inventario';
import type { Actions } from './$types';

export async function load({ cookies }) {
	const access_token = cookies.get('token') || '';
	const dates = startEndMonthString(new Date());

	const ventas = await Movimiento.getVentasAgrupadas({
		url: BACKEND_API_URL,
		access_token,
		start_date: dates[0],
		end_date: dates[1]
	});
	const metadatosDistinct = await Movimiento.getMetadatos({ url: BACKEND_API_URL, access_token });

	return {
		ventas,
		metadatosDistinct,
	};
}

export const actions = {} satisfies Actions;
