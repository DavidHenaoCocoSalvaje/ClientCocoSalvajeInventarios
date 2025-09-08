import type { Actions } from './$types.js';
import { BACKEND_API_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, cookies, url }) => {
		const _ = url.searchParams.get('_');
		const redirectTo = _ && !_?.includes('/login') ? _ : '/';
		let accessToken = cookies.get('token') || '';
		if (accessToken) redirect(303, redirectTo);

		const data = await request.formData();
		const username = data.get('username')!.toString();
		const password = data.get('password')!.toString();

		const formData = new URLSearchParams();
		formData.append('grant_type', 'password');
		formData.append('username', username);
		formData.append('password', password);
		formData.append('scope', ''); // o lo que necesites
		formData.append('client_id', '');
		formData.append('client_secret', '');

		let res = new Response();
		try {
			res = await fetch(`${BACKEND_API_URL}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: formData
			});
		} catch (e) {
			console.log(e);
		}

		if (res.status === 200) {
			const data = await res.json();
			accessToken = data.access_token;
			// Guardar token en cookie
			cookies.set('token', accessToken, {
				path: '/',
				httpOnly: true,
				secure: false, // Cuando sea true, el cookie solo se puede acceder a través de HTTPS
				sameSite: 'strict'
			});
			redirect(303, redirectTo);
		} else if (res.status === 401) {
			return { success: false, message: 'Credenciales incorrectas' };
		} else {
			return { success: false, message: 'Error al iniciar sesión' };
		}
	}
} satisfies Actions;
