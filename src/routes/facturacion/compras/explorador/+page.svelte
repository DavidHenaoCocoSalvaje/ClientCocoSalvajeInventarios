<script lang="ts">
	import { SortDirection } from '$lib';
	import DataGrid from '$lib/components/DataGrid.svelte';
	import { Compra, FacturacionFormat } from '$lib/routes/facturacion/index.js';

	let { data } = $props();
	let compras = $derived(data.compras);
	let f_compras = $derived(FacturacionFormat.compras(compras));
	let rows = $state(200);
	let sortColumns = ['fecha', 'numero_factura_proveedor', 'factura_numero', 'contabilizado', 'log'];

	async function refresh() {
		compras = await Compra.get_list({
			url: data.backendUrlCsr,
			access_token: data.access_token,
			skip: 0,
			limit: rows,
			sort: SortDirection.DESC
		});
	}
</script>

<section class="sticky top-0 z-20 flex w-full flex-col items-center gap-5 bg-white pt-5">
	<h1 class="w-full text-center text-lg font-bold">Explorador de compras</h1>
	<h2 class="w-full text-lg font-semibold">Compras facturadas</h2>
</section>

{#if f_compras}
	<DataGrid data={f_compras} columns={sortColumns} bind:rows refresh_data={refresh} />
{/if}
