<script lang="ts">
	import { CSRequest, SortDirection } from '$lib';
	import Button from '$lib/components/Button.svelte';
	import DataGrid from '$lib/components/DataGrid.svelte';
	import InputText from '$lib/components/InputText.svelte';
	import { Pedido, TransaccionesFormat } from '$lib/routes/transacciones/index.js';

	let { data } = $props();
	let pedidos = $state(data.pedidos);
	let f_pedidos = $derived(TransaccionesFormat.pedidos(pedidos));
	let rows = $state(200);
	let sortColumns = ['fecha', 'numero', 'pago', 'factura_numero', 'contabilizado', 'log'];

	async function refresh() {
		pedidos = await Pedido.get_list({
			url: data.backendUrlCsr,
			access_token: data.access_token,
			skip: 0,
			limit: rows,
			sort: SortDirection.DESC
		});
	}

	let pedido_numero = $state('');
	async function facturar_pedido() {
		if (!pedido_numero) {
			alert('Por favor, ingrese un número de pedido.');
			return;
		}
		const request = new CSRequest(data.backendUrlCsr);
		const response = await request.post<boolean>({
			primaryRoute: '/transacciones',
			path: `/facturar`,
			accessToken: data.access_token,
			params: [pedido_numero]
		});
		if (response) {
			alert(`Pedido ${pedido_numero} facturado correctamente.`);
		} else {
			alert(`Error al facturar el pedido ${pedido_numero}.`);
		}
	}

	async function facturar_pendientes() {
		const request = new CSRequest(data.backendUrlCsr);
		request.post({
			primaryRoute: '/transacciones',
			path: '/facturar-pendientes',
			accessToken: data.access_token
		});
	}
</script>

<section class="sticky top-0 z-20 flex w-full flex-col items-center gap-5 bg-white pt-5">
	<h1 class="w-full text-center text-lg font-bold">Explorador de pedidos</h1>
	<h2 class="w-full text-lg font-semibold">Pedidos facturados</h2>
	<div class="justify-left flex w-full items-center gap-5">
		<Button action={facturar_pendientes} style="bg-teal-700 text-white">Facturar pendientes</Button>
		<InputText
			width="w-fit"
			id="facturar_pedido"
			placeholder="Número de pedido"
			bind:value={pedido_numero} />
		<Button action={facturar_pedido} style="bg-teal-700 text-white">Facturar pedido</Button>
	</div>
</section>

{#if f_pedidos}
	<DataGrid data={f_pedidos} columns={sortColumns} bind:rows refresh_data={refresh} />
{/if}
