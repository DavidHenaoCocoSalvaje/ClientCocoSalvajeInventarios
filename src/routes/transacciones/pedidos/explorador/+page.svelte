<script lang="ts">
	import { TableHandler, Datatable, ThSort, ThFilter } from '@vincjo/datatables';
	import { GetArray } from '$lib';

	let { data } = $props();
	let pedidos = $state(data.pedidos);

	let table: TableHandler<Record<string, any>> = $state(
		new TableHandler(data.pedidos, { rowsPerPage: 20 })
	);

	async function refresh() {
		pedidos = await GetArray(data.backendUrl, '/transacciones', '/pedidos', data.access_token);
	}
</script>

<section class="sticky top-0 z-10 flex w-full flex-col items-center gap-5 bg-white px-10 pt-21">
	<h1 class="w-full text-center text-2xl font-bold">Explorador de pedidos</h1>
	<div class="flex w-full">
		<div class="flex w-full flex-col">
			<button
				onclick={refresh}
				class="btn cursor-pointer self-end rounded-2xl bg-teal-700 px-4 py-2 font-bold text-white"
				>Refrescar</button>
		</div>
	</div>
</section>

<div class="h-160 w-fit px-10 border-1 rounded-md">
	{#if pedidos}
		<Datatable basic {table}>
			<table>
				<thead class="bg-white!">
					<tr>
						<ThSort {table} field="numero">Numero</ThSort>
						<ThSort {table} field="pago">Pago</ThSort>
						<ThSort {table} field="factura_id">Factura ID</ThSort>
						<ThSort {table} field="contabilizado">Contabilizado</ThSort>
						<ThSort {table} field="log">Log</ThSort>
					</tr>
					<tr>
						<ThFilter {table} field="numero" />
						<ThFilter {table} field="pago" />
						<ThFilter {table} field="factura_id" />
						<ThFilter {table} field="contabilizado" />
						<ThFilter {table} field="log" />
					</tr>
				</thead>
				<tbody>
					{#each table.rows as row}
						<tr>
							<td>{row.numero}</td>
							<td>{row.pago}</td>
							<td>{row.factura_id}</td>
							<td>{row.contabilizado}</td>
							<td>{row.log}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</Datatable>
	{/if}
</div>
