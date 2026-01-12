<script lang="ts">
	import { CSRequest, SortDirection } from '$lib';
	import Section from '$lib/components/MainSection.svelte';
	import Title from '$lib/components/Title.svelte';
	import Button from '$lib/components/Button.svelte';
	import DataGrid from '$lib/components/DataGrid.svelte';
	import InputText from '$lib/components/InputText.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import { Venta, FacturacionFormat } from '$lib/routes/facturacion/index.js';

	let { data } = $props();

	let ventas: Awaited<ReturnType<typeof Venta.get_list>> = $state([]);
	let f_ventas = $derived(FacturacionFormat.ventas(ventas));
	let rows = $state(200);
	let sortColumns = ['fecha', 'numero_pedido', 'pago', 'factura_numero', 'contabilizado', 'log'];
	let loading = $state(true);

	let showMessageModal = $state(false);
	let messageModalTitle = $state('');
	let messageModalContent = $state('');
	let isMessageError = $state(false);

	function showMessage(title: string, content: string, isError = false) {
		messageModalTitle = title;
		messageModalContent = content;
		isMessageError = isError;
		showMessageModal = true;
	}

	async function loadVentas() {
		loading = true;
		ventas = await Venta.get_list({
			url: data.backendUrlCsr,
			access_token: data.access_token,
			skip: 0,
			limit: rows,
			sort: SortDirection.DESC
		});
		loading = false;
	}

	async function refresh() {
		await loadVentas();
	}

	let numero_pedido = $state('');
	async function facturarVenta() {
		if (!numero_pedido) {
			showMessage('Error', 'Por favor, ingrese un número de pedido.', true);
			return;
		}
		const request = new CSRequest(data.backendUrlCsr);
		const response = await request.post<boolean>({
			primaryRoute: '/facturacion',
			path: `/facturar`,
			accessToken: data.access_token,
			params: [numero_pedido]
		});
		if (response) {
			showMessage('Éxito', `Pedido ${numero_pedido} facturado correctamente.`);
		} else {
			showMessage('Error', `Error al facturar el pedido ${numero_pedido}.`, true);
		}
	}

	async function facturarVentasPendientes() {
		const request = new CSRequest(data.backendUrlCsr);
		request.post({
			primaryRoute: '/facturacion',
			path: '/facturar-ventas-pendientes',
			accessToken: data.access_token
		});
	}

	$effect(() => {
		loadVentas();
	});
</script>

<Modal bind:showModal={showMessageModal}>
	<div class="flex min-w-64 flex-col gap-4 p-2">
		<h3 class="text-lg font-semibold" class:text-red-600={isMessageError}>{messageModalTitle}</h3>
		<p class="text-gray-600">{messageModalContent}</p>
	</div>
</Modal>

<Section className="px-10 py-5 gap-5">
	<Title>Explorador de ventas</Title>
	<h2 class="w-full text-lg font-semibold">Ventas facturadas</h2>
	<div class="justify-left flex w-full items-center gap-5">
		<Button action={facturarVentasPendientes} style="bg-teal-700 text-white">Facturar pendientes</Button>
		<InputText
			width="w-fit"
			id="facturar_pedido"
			placeholder="Número de pedido"
			bind:value={numero_pedido} />
		<Button action={facturarVenta} style="bg-teal-700 text-white">Facturar pedido</Button>
	</div>
	{#if loading}
		<Loader message="Cargando ventas..." />
	{:else}
		<DataGrid data={f_ventas} columns={sortColumns} bind:rows refresh_data={refresh} />
	{/if}
</Section>

