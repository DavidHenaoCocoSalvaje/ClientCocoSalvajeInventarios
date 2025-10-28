<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import Subtitle from '$lib/components/Subtitle.svelte';
	import { alfanumericRandom, formatDate } from '$lib';
	import imgTransaccionesAddi from '$lib/assets/images/transacciones-addi-csv.png';
	import DataGrid from '$lib/components/DataGrid.svelte';
	let { data } = $props();

	let files = $state<FileList>();
	const inputId = alfanumericRandom();
	let uploading = $state(false);
	let message = $state('');
	let messageType = $state<'success' | 'error' | 'info'>('info');
	let responseData = $state<any>(null);

	// Función para enviar el archivo a FastAPI
	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!files || files.length === 0) {
			message = '✗ Por favor selecciona un archivo';
			messageType = 'error';
			return;
		}

		uploading = true;
		message = 'Subiendo archivo...';
		messageType = 'info';
		responseData = null;

		try {
			const formData = new FormData();
			// FastAPI espera el parámetro "files" (plural)
			formData.append('files', files[0]);

			const response = await fetch(`${data.backendUrlCsr}/transacciones/csv-addi`, {
				method: 'POST',
				headers: {
					accept: 'application/json',
					authorization: `Bearer ${data.access_token}`
				},
				body: formData
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
			}

			responseData = await response.json();
            responseData.forEach((row: any) => {
                row.fecha = formatDate(row.fecha);
            });
			message = '✓ Archivo procesado exitosamente';
			messageType = 'success';

			// Limpiar la selección
			files = undefined;
		} catch (error) {
			console.error('Error al subir archivo:', error);
			message = `✗ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`;
			messageType = 'error';
		} finally {
			uploading = false;
		}
	}

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
	<Title>Pagos Addi</Title>
	<Subtitle>Verificar forma de pago Crédito</Subtitle>
	<div class="w-full">
		<p>
			Por medio de está sección se pueden verificar cúales son las Órdenes a crédito que están relacionadas
			con el identificador de pago proporcionado por Addi.
		</p>
		<p>
			Se debe obtener el archvio CSV desde el <a
				class="text-blue-600 hover:text-blue-800"
				href="https://aliados.addi.com/"
				target="_blank"
				rel="noreferrer noopener">Portal Addi</a> (Se recomienda filtrar por fechas recientes para consultar
			una cantidad menor de ordenes y que se procese más rápido al solicitud), y subirlo para obtener
			el listados de órdenes correspondientes.
		</p>
	</div>
	<img class="aspect-square w-md" src={imgTransaccionesAddi} alt="Transacciones Addi" />
	<div class="flex w-full max-w-md flex-col gap-2 self-start rounded-md border border-gray-300 p-4">
		<Subtitle>Subir archivo</Subtitle>
		<form
			class="flex flex-col gap-2"
			method="POST"
			action="?/upload"
			enctype="multipart/form-data"
			onsubmit={handleSubmit}>
			<div>
				<label
					class="inline-block cursor-pointer rounded-md bg-teal-700 px-4 py-2 text-white"
					for={inputId}>
					Seleccionar archivo
				</label>
				<input
					id={inputId}
					name="file"
					type="file"
					bind:files
					disabled={uploading}
					required
					class="h-0 w-0 opacity-0" />
			</div>

			<div class="rounded border border-gray-200 bg-gray-50 p-2">
				<p class="text-gray-800">Archivo seleccionado:</p>
				<p class="text-sm text-gray-600">
					<span class="font-medium">Archivo:</span>
					{files && files.length > 0 ? files[0].name : 'Ningún archivo seleccionado'}
				</p>
				<p class="text-sm text-gray-600">
					<span class="font-medium">Tamaño:</span>
					{files && files.length > 0 ? (files[0].size / 1024).toFixed(2) : '0'} KB
				</p>
			</div>

			<button
				type="submit"
				disabled={!files || uploading}
				class="rounded bg-teal-600 px-4 py-2 font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-gray-300">
				{uploading ? 'Subiendo...' : 'Enviar'}
			</button>
		</form>
	</div>
    {#if responseData}
        <DataGrid data={responseData}></DataGrid>
    {/if}
</section>
