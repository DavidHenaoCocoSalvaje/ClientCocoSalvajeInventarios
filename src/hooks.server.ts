// hooks.server.ts

import { decodeJwt } from 'jose';

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session');

	if (token) {
		try {
			const payload = decodeJwt(token);
			event.locals.user = {
				id: payload.sub,
				username: payload.username
			};
		} catch {
			event.locals.user = null;
		}
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};
