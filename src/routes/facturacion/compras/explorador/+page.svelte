<script lang="ts">
	import { SortDirection } from '$lib';
	import DataGrid from '$lib/components/DataGrid.svelte';
	import Section from '$lib/components/Section.svelte';
	import Title from '$lib/components/Title.svelte';
	import { Compra, FacturacionFormat } from '$lib/routes/facturacion/index.js';

	let { data } = $props();
	let compras = $derived(data.compras);
	let f_compras = $derived(FacturacionFormat.compras(compras));
	let rows = $state(200);
	let sortColumns = ['fecha', 'proveedor', 'factura_proveedor', 'factura_numero', 'contabilizado', 'log'];

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

<Section>
	<Title>Explorador de compras</Title>
	<h2 class="w-full text-lg font-semibold">Compras facturadas</h2>
</Section>

{#if f_compras}
	<DataGrid data={f_compras} columns={sortColumns} bind:rows refresh_data={refresh} />
{/if}
