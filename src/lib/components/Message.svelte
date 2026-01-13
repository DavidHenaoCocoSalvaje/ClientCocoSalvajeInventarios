<script lang="ts">
	type MessageType = 'error' | 'info' | 'warning';

	interface Props {
		message?: string;
		title?: string;
		type?: MessageType;
	}

	const typeStyles: Record<MessageType, { border: string; bg: string; icon: string; title: string; text: string }> = {
		error: {
			border: 'border-red-200',
			bg: 'bg-red-50',
			icon: 'text-red-500',
			title: 'text-red-700',
			text: 'text-red-600'
		},
		info: {
			border: 'border-blue-200',
			bg: 'bg-blue-50',
			icon: 'text-blue-500',
			title: 'text-blue-700',
			text: 'text-blue-600'
		},
		warning: {
			border: 'border-yellow-200',
			bg: 'bg-yellow-50',
			icon: 'text-yellow-500',
			title: 'text-yellow-700',
			text: 'text-yellow-600'
		}
	};

	let { 
		message = 'Ha ocurrido un error', 
		title = 'Error',
		type = 'error'
	}: Props = $props();

	const styles = $derived(typeStyles[type]);
</script>

<div class="flex h-64 w-full items-center justify-center">
	<div class="flex flex-col items-center gap-4 rounded-lg border {styles.border} {styles.bg} p-6">
		{#if type === 'error'}
			<svg class="h-12 w-12 {styles.icon}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
			</svg>
		{:else if type === 'info'}
			<svg class="h-12 w-12 {styles.icon}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		{:else}
			<svg class="h-12 w-12 {styles.icon}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
			</svg>
		{/if}
		<div class="text-center">
			<h3 class="text-lg font-semibold {styles.title}">{title}</h3>
			<p class="mt-1 text-sm {styles.text}">{message}</p>
		</div>
	</div>
</div>
