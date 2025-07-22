// src/hooks.server.ts
import { decodeJwt } from 'jose';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session'); // Lee la cookie de sesión establecida por tu backend

	if (token) {
		try {
			// **IMPORTANTE**: En producción, asegúrate de VERIFICAR la firma del JWT
			// utilizando la clave secreta de tu backend (p. ej., con `jwtVerify` de `jose`).
			const payload = decodeJwt(token);

			// Ajusta estas propiedades (id, username) para que coincidan con las que tu backend
			// realmente incluye en el payload del JWT.
			if (payload.sub && payload.name) {
				event.locals.user = {
					id: payload.sub,
					username: payload.name as string
				};
			}
		} catch (error) {
			console.error('Error decodificando o verificando el token de sesión:', error);
			// Si el token es inválido o ha expirado, borra la cookie de sesión
			event.cookies.delete('session', { path: '/' });
			event.locals.user = null;
		}
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};
