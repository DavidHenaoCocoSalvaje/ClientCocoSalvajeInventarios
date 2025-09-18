<script lang="ts">
	import { CSRequest } from '$lib';
	import Button from '$lib/components/Button.svelte';
	import DataGrid from '$lib/components/DataGrid.svelte';
	import { TransaccionesFormat, type Pedido } from '$lib/routes/transacciones/index.js';

	let { data } = $props();

	let pedidos = $state(data.pedidos);
	let rows = $state(200);
	let sortColumns = ['fecha', 'numero', 'pago', 'factura_numero', 'contabilizado', 'log'];

	async function refresh() {
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
	}

    let pedido_numero = $state('');
    async function facturar_pedido() {
        if (!pedido_numero) {
            alert('Por favor, ingrese un número de pedido.');
            return;
        }
        const request = new CSRequest(data.backendUrlCsr);
        const response = await request.post<boolean>('/transacciones', `/facturar`, data.access_token, [pedido_numero]);
        if (response) {
            alert(`Pedido ${pedido_numero} facturado correctamente.`);
        } else {
            alert(`Error al facturar el pedido ${pedido_numero}.`);
        }
    }

	async function facturar_pendientes() {
		const request = new CSRequest(data.backendUrlCsr);
		request.post('/transacciones', '/facturar-pendientes', data.access_token);
	}
</script>

<section class="sticky top-0 z-20 flex w-full flex-col items-center gap-5 bg-white">
	<h1 class="w-full text-center text-lg font-bold">Explorador de pedidos</h1>
	<div class="flex w-full justify-left gap-5">
		<Button action={facturar_pendientes} style="bg-teal-700 text-white">Facturar pendientes</Button>
        <label for="facturar_pedido"></label>
        <input class="rounded-sm border border-gray-300 px-2 py-1 font-normal focus:outline-gray-300" id="facturar_pedido" type="text" placeholder="Número de pedido" bind:value={pedido_numero} />
        <Button action={facturar_pedido} style="bg-teal-700 text-white">Facturar pedido</Button>
	</div>
</section>

{#if pedidos}
	<DataGrid data={pedidos} columns={sortColumns} bind:rows refresh_data={refresh} />
{/if}
