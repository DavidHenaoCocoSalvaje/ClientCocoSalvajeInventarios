<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	// Función para manejar el envío del formulario
	const handleSubmit: SubmitFunction = () => {
		uploading = true;
		message = 'Subiendo archivo...';
		messageType = 'info';

		return async ({ result, update }) => {
			uploading = false;

			if (result.type === 'success') {
				message = '✓ Archivo subido exitosamente';
				messageType = 'success';
				files = undefined; // Limpiar la selección
			} else if (result.type === 'failure') {
				message = `✗ Error: ${result.data?.message || 'Error al subir el archivo'}`;
				messageType = 'error';
			} else if (result.type === 'error') {
				message = '✗ Error inesperado al subir el archivo';
				messageType = 'error';
			}

			await update();
		};
	};

	let files = $state<FileList>();
	let uploading = $state(false);
	let message = $state('');
	let messageType = $state<'success' | 'error' | 'info'>('info');

	// Mostrar información del archivo cuando se selecciona
	$effect(() => {
		if (files && files.length > 0) {
			const file = files[0];
			message = `Archivo seleccionado: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
			messageType = 'info';
		}
	});
</script>

<section class="sticky top-0 z-20 flex w-full flex-col items-center gap-5 bg-white pt-5">
	<h1 class="w-full text-center text-lg font-bold">Pagos Addi</h1>
	<h2 class="w-full text-lg font-semibold">Verificar forma de pago Crédito/Debito</h2>
	<div class="mx-auto mt-8 max-w-lg rounded-lg border border-gray-200 p-8">
		<h2 class="w-full text-2xl font-bold text-gray-800">Subir Archivo</h2>

		<form method="POST" action="?/upload" enctype="multipart/form-data" use:enhance={handleSubmit}>
			<div class="flex flex-col gap-4">
				<div>
					<label for="file" class="mb-2 block text-sm font-medium text-gray-700">
						Selecciona un archivo:
					</label>
					<input
						id="file"
						name="file"
						type="file"
						bind:files
						disabled={uploading}
						required
						class="w-full cursor-pointer rounded border-2 border-dashed border-gray-300 p-3 file:mr-4 file:rounded file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-gray-700 hover:file:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50" />
				</div>

				{#if files && files.length > 0}
					<div class="rounded border border-gray-200 bg-gray-50 p-3">
						<p class="text-sm text-gray-600">
							<span class="font-medium">Archivo:</span>
							{files[0].name}
						</p>
						<p class="text-sm text-gray-600">
							<span class="font-medium">Tamaño:</span>
							{(files[0].size / 1024).toFixed(2)} KB
						</p>
					</div>
				{/if}

				<button
					type="submit"
					disabled={!files || uploading}
					class="rounded bg-green-500 px-6 py-3 font-medium text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-300">
					{uploading ? 'Subiendo...' : 'Subir Archivo'}
				</button>
			</div>
		</form>

		{#if message}
			<div
				class="mt-4 rounded p-4 {messageType === 'success'
					? 'border border-green-200 bg-green-100 text-green-800'
					: messageType === 'error'
						? 'border border-red-200 bg-red-100 text-red-800'
						: 'border border-blue-200 bg-blue-100 text-blue-800'}">
				{message}
			</div>
		{/if}
	</div>
</section>
