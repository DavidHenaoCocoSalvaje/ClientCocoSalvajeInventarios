<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';

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
		// Al cerrar el dialog nativo, se dispara el evento 'close'
		dialogElement?.close();
	}

	function onDialogClose() {
		// Sincronizamos la prop cuando el dialog se cierra (por tecla ESC o método close)
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
	<div class="flex flex-col gap-4 bg-white p-6">
		{@render children?.()}
		<div class="flex justify-end">
			<Button action={close} style="bg-teal-700 text-white hover:bg-teal-800">Cerrar</Button>
		</div>
	</div>
</dialog>
