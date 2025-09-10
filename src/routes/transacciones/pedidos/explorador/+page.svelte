<script lang="ts">
	import { GetArray } from '$lib';
	import DataGrid from '$lib/components/DataGrid.svelte';

	let { data } = $props();

	let pedidos = $state(data.pedidos);
	let sortColumns = ['fecha', 'numero', 'pago', 'factura_numero', 'contabilizado', 'log'];
	let loading = $state(false);

	async function refresh() {
		loading = true;
		try {
			pedidos = await GetArray(data.backendUrlCsr, '/transacciones', '/pedidos', data.access_token);
			pedidos = pedidos.map((pedido: any) => ({
				...pedido,
				fecha: new Date(pedido.fecha).toLocaleString('es-CO'),
				factura_numero: pedido.factura_numero ? pedido.factura_numero : '-',
				log: pedido.log ? pedido.log : '-'
			}));
		} finally {
			loading = false;
		}
	}
</script>

<section class="sticky top-0 z-20 flex w-full flex-col items-center gap-5 bg-white pt-16">
	<h1 class="w-full text-center text-xl font-bold">Explorador de pedidos</h1>
	<div class="flex w-full">
		<div class="flex w-full flex-col">
			<button
				onclick={refresh}
				class="btn cursor-pointer self-end rounded-2xl bg-teal-700 px-4 py-2 font-bold text-white"
				disabled={loading}>
				{#if loading}
					Refrescando...
				{:else}
					Refrescar
				{/if}
			</button>
		</div>
	</div>
</section>

{#if pedidos}
	<DataGrid data={pedidos} columns={sortColumns} />
{/if}
