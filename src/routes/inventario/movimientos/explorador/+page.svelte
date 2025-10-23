<script lang="ts">
	import { CSRequest } from '$lib';
	import Button from '$lib/components/Button.svelte';
	import DataGrid from '$lib/components/DataGrid.svelte';
	import { InventarioFormat, type IMovimiento } from '$lib/routes/Inventario/index.js';

	let { data } = $props();

	let movimientos = $state(data.movimientos);
	let f_movimientos = $derived(InventarioFormat.movimientos(movimientos));
	let rows = $state(200);
	let sortColumns = ['fecha', 'soporte_id', 'cantidad', 'valor'];

	async function refresh() {
		const request = new CSRequest(data.backendUrlCsr);
		movimientos = await request.get<Array<IMovimiento>>(
			'/inventario',
			'/movimientos',
			data.access_token,
			undefined,
			{
				skip: '0',
				limit: `${rows}`,
				sort: 'desc'
			}
		);
	}
</script>

<section class="sticky top-0 z-20 flex w-full flex-col items-center gap-5 bg-white pt-5">
	<h1 class="w-full text-center text-lg font-bold">Explorador de movimientos</h1>
</section>

{#if f_movimientos}
	<DataGrid data={f_movimientos} columns={sortColumns} bind:rows refresh_data={refresh} />
{/if}
