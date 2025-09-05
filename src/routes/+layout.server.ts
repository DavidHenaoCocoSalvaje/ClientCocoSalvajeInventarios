import { redirect } from '@sveltejs/kit';
import { BACKEND_API_URL } from '$env/static/private';

export function load({ cookies, url }) {
	const token = cookies.get('token');

	if (!token && !url.pathname.includes('login') && !url.pathname.includes('devtools')) {
		redirect(303, `/login?_=${url.pathname}`);
	}

	const backendUrl = BACKEND_API_URL;
	const access_token: string = cookies.get('token') || '';

	return {
		backendUrl,
		access_token
	};
}
