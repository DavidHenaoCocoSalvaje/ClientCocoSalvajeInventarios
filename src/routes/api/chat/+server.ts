import { json } from '@sveltejs/kit';
import { get_token } from '$lib/jwt';
import type { RequestHandler } from './$types';

const PRIVATE_KEY_PATH = 'credentials/private-chatsopn8n.pem';
const N8N_WEBHOOK_URL = 'https://n8n.cocosalvajeapps.com/webhook/chat-sop';

export const POST: RequestHandler = async ({ cookies, request }) => {
    const userToken = cookies.get('token');
    if (!userToken) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jwtToken = get_token({
        private_key_path: PRIVATE_KEY_PATH,
        payload: { sub: 'chat-sop' }
    });

    const body = await request.json();

    const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chatInput: body.chatInput || '',
            sessionId: body.sessionId || ''
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        return json({ error: errorText, message: errorText }, { status: response.status });
    }

    // Intentar parsear como JSON, si falla devolver como texto
    const text = await response.text();
    try {
        const data = JSON.parse(text);
        return json(data);
    } catch {
        return json({ output: text, message: text });
    }
};
