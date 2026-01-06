import { redirect } from '@sveltejs/kit';
import { getDefaultPath } from '$lib/routes/facturacion/navigation';

export function load() {
    throw redirect(307, getDefaultPath({ root: '/facturacion' }));
}
