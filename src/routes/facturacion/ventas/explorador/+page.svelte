<script lang="ts">
	import { CSRequest, SortDirection } from '$lib';
	import Button from '$lib/components/Button.svelte';
	import DataGrid from '$lib/components/DataGrid.svelte';
	import InputText from '$lib/components/InputText.svelte';
	import { Venta, FacturacionFormat} from '$lib/routes/facturacion/index.js';

	let { data } = $props();
	let ventas = $derived(data.ventas);
	let f_ventas = $derived(FacturacionFormat.ventas(ventas));
	let rows = $state(200);
	let sortColumns = ['fecha', 'numero_pedido', 'pago', 'factura_numero', 'contabilizado', 'log'];

	async function refresh() {
		ventas = await Venta.get_list({
			url: data.backendUrlCsr,
			access_token: data.access_token,
			skip: 0,
			limit: rows,
			sort: SortDirection.DESC
		});
	}

	let numero_pedido = $state('');
	async function facturarVenta() {
		if (!numero_pedido) {
			alert('Por favor, ingrese un número de pedido.');
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
			alert(`Pedido ${numero_pedido} facturado correctamente.`);
		} else {
			alert(`Error al facturar el pedido ${numero_pedido}.`);
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
</script>

<section class="sticky top-0 z-20 flex w-full flex-col items-center gap-5 bg-white pt-5">
	<h1 class="w-full text-center text-lg font-bold">Explorador de ventas</h1>
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
</section>

{#if f_ventas}
	<DataGrid data={f_ventas} columns={sortColumns} bind:rows refresh_data={refresh} />
{/if}
