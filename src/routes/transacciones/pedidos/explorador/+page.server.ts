import { BACKEND_API_URL } from '$env/static/private';
import { SortDirection } from '$lib';
import { Pedido } from '$lib/routes/transacciones';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export async function load({ cookies }) {
	const access_token = cookies.get('token') || '';
	return {
		pedidos: await Pedido.get_list(BACKEND_API_URL, access_token, 0, 200, SortDirection.DESC)
	};
}

export const actions = {
	upload: async ({ request }) => {
		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file || file.size === 0) {
			return fail(400, { message: 'No se seleccionó ningún archivo' });
		}

		try {
			// Aquí envías el archivo a tu backend FastAPI
			const formData = new FormData();
			formData.append('file', file);

			// const response = await fetch('http://localhost:8000/upload', {
			// 	method: 'POST',
			// 	body: formData
			// });

			// if (!response.ok) {
			// 	return fail(response.status, { message: 'Error al subir archivo' });
			// }

			// const result = await response.json();
			return { 
                success: true,
                // data: result 
            };
		} catch (error) {
			console.error('Error:', error);
			return fail(500, { message: 'Error del servidor' });
		}
	}
} satisfies Actions;
