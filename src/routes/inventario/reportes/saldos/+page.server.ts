import { BACKEND_API_URL } from '$env/static/private';
import { Slado } from '$lib/routes/Inventario';
import type { Actions } from './$types';

export async function load({ cookies }) {
    const access_token = cookies.get('token') || '';
    const saldo = new Slado();
    return {
        saldos: await saldo.get_list({ url: BACKEND_API_URL, access_token })
    };
}

export const actions = {} satisfies Actions;
