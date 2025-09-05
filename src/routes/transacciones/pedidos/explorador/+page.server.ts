import { BACKEND_API_URL } from '$env/static/private';
import { GetArray } from '$lib';

export async function load({ cookies }) {
	const access_token = cookies.get('token') || '';

	const pedidos = await GetArray(BACKEND_API_URL, '/transacciones', '/pedidos', access_token);

	return { pedidos };
}
