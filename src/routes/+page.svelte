<script lang="ts">
	import '@n8n/chat/style.css';
	import { createChat } from '@n8n/chat';
	import { onMount } from 'svelte';

    	const msg = `¡Hola! Soy tu asistente especializado en los SOP de COCO SALVAJE. Puedo responder preguntas relacionadas a este tema.

    Tengo conocimiento de los SOP para las siguientes áreas:
* Administración
* Comercial
* Compras
* Gerencia
* Marketing
* Producción
* Talento Humano
* Generales (Comunicación, Notion, WhatsApp)

¿Qué área te interesa?`;

	const initialMessages: Array<string> = [];

	onMount(() => {
		createChat({
			webhookUrl: 'https://n8n.cocosalvajeapps.com/webhook/8e017568-8034-4367-b519-719783855dc3/chat',
			initialMessages: initialMessages,
			i18n: {
				en: {
					title: '',
					subtitle: 'SOP Assistant COCO SALVAJE',
					footer: '',
					getStarted: 'New Conversation',
					inputPlaceholder: 'Escribe tu pregunta...',
					closeButtonTooltip: 'Cerrar'
				}
			}
		});
	});
</script>

<style>
	:global(body) {
		--chat--color--primary: #e74266;
		--chat--color--primary-shade-50: #db4061;
		--chat--color--primary--shade-100: #cf3c5c;
		--chat--color--secondary: #20b69e;
		--chat--color-secondary-shade-50: #1ca08a;
		--chat--color-white: #ffffff;
		--chat--color-light: #f2f4f8;
		--chat--color-light-shade-50: #e6e9f1;
		--chat--color-light-shade-100: #c2c5cc;
		--chat--color-medium: #d2d4d9;
		--chat--color-dark: #101330;
		--chat--color-disabled: #777980;
		--chat--color-typing: #404040;

		--chat--spacing: 1rem;
		--chat--border-radius: 0.5rem;
		--chat--transition-duration: 0.15s;

		--chat--window--width: 400px;
		--chat--window--height: 600px;

		--chat--header-height: auto;
		--chat--header--padding: var(--chat--spacing);
		--chat--header--background: var(--color-teal-700);
		--chat--header--color: var(--color-white);
		--chat--header--border-top: none;
		--chat--header--border-bottom: none;
		--chat--heading--font-size: 2em;
		--chat--subtitle--font-size: inherit;
		--chat--subtitle--line-height: 1.8;

		--chat--textarea--height: 50px;

		--chat--message--font-size: 1rem;
		--chat--message--padding: var(--chat--spacing);
		--chat--message--border-radius: var(--chat--border-radius);
		--chat--message-line-height: 1.8;
		--chat--message--bot--background: var(--chat--color-white);
		--chat--message--bot--color: var(--color-black);
		--chat--message--bot--border: none;
		--chat--message--user--background: var(--chat--color--secondary);
		--chat--message--user--color: var(--chat--color-white);
		--chat--message--user--border: none;
		--chat--message--pre--background: rgba(0, 0, 0, 0.05);

		--chat--toggle--background: var(--color-teal-700);
		--chat--toggle--hover--background: var(--color-teal-600);
		--chat--toggle--active--background: var(--color-teal-600);
		--chat--toggle--color: var(--chat--color-white);
		--chat--toggle--size: 64px;
	}
</style>
