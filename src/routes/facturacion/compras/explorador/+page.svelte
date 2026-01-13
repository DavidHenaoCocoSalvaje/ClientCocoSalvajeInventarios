<script lang="ts">
	import { SortDirection, getMessageType, type MessageType } from '$lib';
	import DataGrid from '$lib/components/DataGrid.svelte';
	import Section from '$lib/components/MainSection.svelte';
	import Title from '$lib/components/Title.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import Message from '$lib/components/Message.svelte';
	import { Compra, FacturacionFormat } from '$lib/routes/facturacion/index.js';

	let { data } = $props();

	let compras: Awaited<ReturnType<typeof Compra.get_list>>['data'] = $state([]);
	let f_compras = $derived(FacturacionFormat.compras(compras || []));
	let rows = $state(200);
	let sortColumns = ['fecha', 'proveedor', 'factura_proveedor', 'factura_numero', 'contabilizado', 'log'];
	let loading = $state(true);
	let error = $state('');
	let errorType: MessageType = $state('error');

	async function loadCompras() {
		loading = true;
		error = '';
		const response = await Compra.get_list({
			url: data.backendUrlCsr,
			access_token: data.access_token,
			skip: 0,
			limit: rows,
			sort: SortDirection.DESC
		});
		if (response.ok) {
			compras = response.data;
		} else {
			error = response.error || 'Error desconocido';
			errorType = getMessageType(response.status);
		}
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
	{:else if error}
		<Message title={errorType === 'info' ? 'Información' : 'Error'} message={error} type={errorType} />
	{:else}
		<DataGrid data={f_compras} columns={sortColumns} bind:rows refresh_data={refresh} />
	{/if}
</Section>