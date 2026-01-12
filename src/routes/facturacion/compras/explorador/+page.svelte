<script lang="ts">
	import { SortDirection } from '$lib';
	import DataGrid from '$lib/components/DataGrid.svelte';
	import Section from '$lib/components/MainSection.svelte';
	import Title from '$lib/components/Title.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import { Compra, FacturacionFormat } from '$lib/routes/facturacion/index.js';

	let { data } = $props();

	let compras: Awaited<ReturnType<typeof Compra.get_list>> = $state([]);
	let f_compras = $derived(FacturacionFormat.compras(compras));
	let rows = $state(200);
	let sortColumns = ['fecha', 'proveedor', 'factura_proveedor', 'factura_numero', 'contabilizado', 'log'];
	let loading = $state(true);

	async function loadCompras() {
		loading = true;
		compras = await Compra.get_list({
			url: data.backendUrlCsr,
			access_token: data.access_token,
			skip: 0,
			limit: rows,
			sort: SortDirection.DESC
		});
		loading = false;
	}

	async function refresh() {
		await loadCompras();
	}

	$effect(() => {
		loadCompras();
	});
</script>

<Section className="px-10 py-5 gap-5">
	<Title>Explorador de compras</Title>
	<h2 class="w-full text-lg font-semibold">Compras facturadas</h2>
	{#if loading}
		<Loader message="Cargando compras..." />
	{:else}
		<DataGrid data={f_compras} columns={sortColumns} bind:rows refresh_data={refresh} />
	{/if}
</Section>