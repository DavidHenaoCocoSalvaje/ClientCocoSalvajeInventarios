<script lang="ts">
	import { onMount } from 'svelte';
	import InputText from './InputText.svelte';

	// Interfaces
	interface Message {
		id: number;
		text: string;
		sender: 'user' | 'bot';
		timestamp: Date;
	}

	interface ChatProps {
		webhookUrl?: string;
		initialMessage?: string;
		botName?: string;
	}

	interface N8nChatRequest {
		sessionId: string;
		chatInput: string;
		action: string;
	}

	interface N8nResponse {
		output?: string;
		message?: string;
		response?: string;
	}

	// Props con valores por defecto
	let {
		webhookUrl = '',
		initialMessage = '¡Hola! ¿En qué puedo ayudarte?',
		botName = 'Assistant'
	}: ChatProps = $props();

	// Estado reactivo
	let isOpen = $state<boolean>(false);
	let messages = $state<Message[]>([]);
	let inputMessage = $state<string>('');
	let isLoading = $state<boolean>(false);
	let chatContainer: HTMLDivElement | undefined = $state();
	let sessionId = $state<string>('');

	// Generar sessionId único
	onMount(() => {
		sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

		// Mensaje inicial del bot
		if (initialMessage) {
			messages = [
				{
					id: Date.now(),
					text: initialMessage,
					sender: 'bot',
					timestamp: new Date()
				}
			];
		}
	});

	// Función para enviar mensaje a n8n
	async function sendMessage(): Promise<void> {
		if (!inputMessage.trim() || isLoading) return;

		const userMessage: Message = {
			id: Date.now(),
			text: inputMessage,
			sender: 'user',
			timestamp: new Date()
		};

		messages = [...messages, userMessage];
		const messageToSend = inputMessage;
		inputMessage = '';
		isLoading = true;

		setTimeout(() => scrollToBottom(), 100);

		try {
			const requestBody: N8nChatRequest = {
				sessionId: sessionId,
				chatInput: messageToSend,
				action: 'sendMessage'
			};

			const response = await fetch(webhookUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody)
			});

			if (!response.ok) {
				throw new Error('Error en la respuesta del servidor');
			}

			const data: N8nResponse = await response.json();

			const botMessage: Message = {
				id: Date.now() + 1,
				text:
					data.output || data.message || data.response || 'Lo siento, no pude procesar tu mensaje.',
				sender: 'bot',
				timestamp: new Date()
			};

			messages = [...messages, botMessage];
		} catch (error) {
			console.error('Error al enviar mensaje:', error);

			const errorMessage: Message = {
				id: Date.now() + 1,
				text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.',
				sender: 'bot',
				timestamp: new Date()
			};

			messages = [...messages, errorMessage];
		} finally {
			isLoading = false;
			setTimeout(() => scrollToBottom(), 100);
		}
	}

	function scrollToBottom(): void {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}

	function toggleChat(): void {
		isOpen = !isOpen;
		if (isOpen) {
			setTimeout(() => scrollToBottom(), 100);
		}
	}

	function handleKeyPress(e: KeyboardEvent): void {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}

	function formatTime(date: Date): string {
		return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
	}
</script>

<div class="fixed right-5 bottom-5 z-50">
	<!-- Botón flotante -->
	<button
		class="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-teal-700 text-white shadow-lg hover:bg-teal-600"
		onclick={toggleChat}>
		{#if isOpen}
			<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12" />
			</svg>
		{:else}
			<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
			</svg>
		{/if}
	</button>

	<!-- Ventana de chat -->
	{#if isOpen}
		<div
			class="absolute right-10 bottom-20 flex h-150 w-96 flex-col rounded-lg shadow-md shadow-neutral-500">
			<!-- Header -->
			<div class="rounded-t-lg bg-teal-700 px-4 py-2 text-white">
				<div class="flex items-center gap-3">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 font-bold">
						{botName.charAt(0)}
					</div>
					<div>
						<h3 class="font-semibold">{botName}</h3>
						<p class="opacity-90">En línea</p>
					</div>
				</div>
			</div>

			<!-- Mensajes -->
			<div
				class="flex-1 space-y-3 overflow-y-auto bg-neutral-100 px-4 py-2"
				bind:this={chatContainer}>
				{#each messages as message (message.id)}
					<div class="flex {message.sender === 'user' ? 'justify-end' : 'justify-start'}">
						<div
							class="max-w-70 rounded-lg px-2 py-1 shadow-sm {message.sender === 'user'
								? 'bg-teal-600 text-white'
								: 'bg-white'}">
							<p>{message.text}</p>
							<span class="text-xs {message.sender === 'user' ? 'text-white' : 'text-gray-500'}"
								>{formatTime(message.timestamp)}</span>
						</div>
					</div>
				{/each}

				{#if isLoading}
					<div class="flex justify-start">
						<div class="rounded-lg bg-white p-3 shadow-sm">
							<div class="flex gap-1">
								<span class="h-2 w-2 animate-bounce rounded-full bg-gray-400"></span>
								<span class="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]"
								></span>
								<span class="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.4s]"
								></span>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Input -->
			<div class="rounded-b-lg border-t-1 border-gray-300 bg-neutral-200 px-4 py-2">
				<div class="flex items-center justify-center gap-2">
					<input
						type="text"
						class="flex-1 rounded-full border border-gray-300 bg-white px-2 py-1 focus:ring-1 focus:ring-teal-700 focus:outline-none"
						bind:value={inputMessage}
						onkeypress={handleKeyPress}
						placeholder="Escribe un mensaje..."
						disabled={isLoading} />
					<button
						aria-label="Send message"
						class="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white"
						onclick={sendMessage}
						disabled={!inputMessage.trim() || isLoading}>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
