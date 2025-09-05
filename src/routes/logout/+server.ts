import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	// Eliminar la cookie token
	cookies.delete('token', { path: '/' });
	throw redirect(302, '/login');
};
