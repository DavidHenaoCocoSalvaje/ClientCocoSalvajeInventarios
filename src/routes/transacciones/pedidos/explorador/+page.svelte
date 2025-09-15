<script lang="ts">
	import { CSRequest } from '$lib';
	import Button from '$lib/components/Button.svelte';
	import DataGrid from '$lib/components/DataGrid.svelte';
	import { TransaccionesFormat, type Pedido } from '$lib/routes/transacciones/index.js';

	let { data } = $props();

	let pedidos = $state(data.pedidos);
	let rows = $state(200);
	let sortColumns = ['fecha', 'numero', 'pago', 'factura_numero', 'contabilizado', 'log'];
	let loading = $state(false);

	async function refresh() {
		loading = true;
		try {
			const request = new CSRequest(data.backendUrlCsr);
			pedidos = await request.get<Array<Pedido>>(
				'/transacciones',
				'/pedidos',
				data.access_token,
				undefined,
				{
					skip: '0',
					limit: `${rows}`,
					sort: 'desc'
				}
			);
			pedidos = TransaccionesFormat.pedidos(pedidos);
		} finally {
			loading = false;
		}
	}

	async function facturar_pendientes() {
		const request = new CSRequest(data.backendUrlCsr);
		request.post('/transacciones', '/facturar-pendientes', data.access_token);
	}
</script>

<section class="sticky top-0 z-20 flex w-full flex-col items-center gap-5 bg-white">
	<h1 class="w-full text-center text-lg font-bold">Explorador de pedidos</h1>
	<div class="flex w-full justify-between">
		<Button action={facturar_pendientes} style="bg-teal-700 text-white">Facturar pendientes</Button>
		<Button action={refresh} style="bg-teal-700 text-white">
			{#if loading}
				Cargando...
			{:else}
				Refrescar
			{/if}
		</Button>
	</div>
</section>

{#if pedidos}
	<DataGrid data={pedidos} columns={sortColumns} bind:rows />
{/if}
