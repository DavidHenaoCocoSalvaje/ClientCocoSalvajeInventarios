<script lang="ts">
	import type { Snippet } from 'svelte';

	let { showModal = $bindable(false), children }: { showModal: boolean; children?: Snippet } =
		$props();

	let dialogElement: HTMLDialogElement;

	$effect(() => {
		if (showModal && dialogElement && !dialogElement.open) {
			dialogElement.showModal();
		} else if (!showModal && dialogElement && dialogElement.open) {
			dialogElement.close();
		}
	});

	function close() {
		dialogElement?.close();
	}

	function onDialogClose() {
		showModal = false;
	}

	function onBackdropClick(e: MouseEvent) {
		if (e.target === dialogElement) {
			close();
		}
	}
</script>

<dialog
	bind:this={dialogElement}
	onclose={onDialogClose}
	onclick={onBackdropClick}
	class="m-auto rounded-lg border border-gray-100 p-0 shadow-2xl backdrop:bg-black/50">
	<div class="flex flex-col bg-white">
		<div class="flex w-full justify-end px-3 pt-3">
			<button
			onclick={close}
			class="border-none text-gray-400 outline-none transition-colors duration-200 hover:text-teal-600 focus:outline-none"
			aria-label="Cerrar">
				<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>
		<div class="px-6 pb-6">
			{@render children?.()}
		</div>
	</div>
</dialog>
