<script lang="ts">
	import { onMount } from 'svelte';
	import { marked } from 'marked';

	interface Message {
		id: number;
		text: string;
		sender: 'user' | 'bot';
		timestamp: Date;
	}

	interface ChatProps {
		initialMessage?: string;
		botName?: string;
	}

	let {
		initialMessage = '¡Hola! ¿En qué puedo ayudarte?',
		botName = 'Assistant'
	}: ChatProps = $props();

	let messages = $state<Message[]>([]);
	let inputMessage = $state<string>('');
	let isLoading = $state<boolean>(false);
	let chatContainer: HTMLDivElement | undefined = $state();
	let sessionId = $state<string>('');

	onMount(() => {
		sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

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
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sessionId,
					chatInput: messageToSend,
					action: 'sendMessage'
				})
			});

			if (!response.ok) {
				throw new Error(`Error ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();

			const botMessage: Message = {
				id: Date.now() + 1,
				text: data.output || data.message || data.response || JSON.stringify(data),
				sender: 'bot',
				timestamp: new Date()
			};

			messages = [...messages, botMessage];
		} catch (error) {
			console.error('Error al enviar mensaje:', error);
			messages = [
				...messages,
				{
					id: Date.now() + 1,
					text: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
					sender: 'bot',
					timestamp: new Date()
				}
			];
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

	function handleKeyPress(e: KeyboardEvent): void {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}

	function formatTime(date: Date): string {
		return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
	}

	function renderMarkdown(text: string): string {
		return marked(text, { async: false }) as string;
	}
</script>

<!-- Contenedor principal centrado con estilos consistentes -->
<div class="flex h-full w-full flex-col items-center gap-5 overflow-hidden px-10 pt-19 pb-5">
	<!-- Chat container centrado con ancho máximo -->
	<div class="flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-md border border-gray-300">
		<!-- Header -->
		<div class="flex items-center gap-3 border-b border-gray-300 bg-teal-700 px-4 py-2 text-white">
			<div class="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 font-bold">
				{botName.charAt(0)}
			</div>
			<div>
				<h2 class="text-sm font-semibold">{botName}</h2>
				<span class="text-xs opacity-80">En línea</span>
			</div>
		</div>

		<!-- Mensajes -->
		<div
			class="flex-1 space-y-3 overflow-y-auto bg-white p-4"
			bind:this={chatContainer}>
			{#each messages as message (message.id)}
				<div class="flex {message.sender === 'user' ? 'justify-end' : 'justify-start'}">
					<div
						class="max-w-xl rounded-md px-3 py-2 {message.sender === 'user'
							? 'bg-teal-600 text-white'
							: 'border border-gray-300 bg-gray-50'}">
						{#if message.sender === 'bot'}
							<div class="prose prose-sm max-w-none text-sm">
								{@html renderMarkdown(message.text)}
							</div>
						{:else}
							<p class="whitespace-pre-wrap text-sm">{message.text}</p>
						{/if}
						<span
							class="mt-1 block text-xs {message.sender === 'user'
								? 'text-teal-100'
								: 'text-gray-400'}">
							{formatTime(message.timestamp)}
						</span>
					</div>
				</div>
			{/each}

			{#if isLoading}
				<div class="flex justify-start">
					<div class="rounded-md border border-gray-300 bg-gray-50 px-3 py-2">
						<div class="flex gap-1">
							<span class="h-2 w-2 animate-bounce rounded-full bg-gray-400"></span>
							<span class="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]"></span>
							<span class="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.4s]"></span>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Input integrado estilo Qwen -->
		<div class="border-t border-gray-300 bg-gray-50 px-4 py-3">
			<div class="relative">
				<input
					type="text"
					class="w-full rounded-lg border border-gray-300 py-3 pr-12 pl-4 text-sm transition-colors duration-200 hover:border-teal-500 focus:border-teal-500 focus:outline-none"
					bind:value={inputMessage}
					onkeypress={handleKeyPress}
					placeholder="Escribe tu mensaje..."
					disabled={isLoading} />
				<button
					aria-label="Enviar mensaje"
					class="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md bg-teal-600 text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-gray-300"
					onclick={sendMessage}
					disabled={!inputMessage.trim() || isLoading}>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
</div>
