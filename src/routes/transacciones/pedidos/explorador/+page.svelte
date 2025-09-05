<script lang="ts">
	import { TableHandler, Datatable, ThSort, ThFilter } from '@vincjo/datatables';
	import { GetArray } from '$lib';

	let { data } = $props();
	let pedidos = $state(data.pedidos);
	let loading = $state(false);

	let table: TableHandler<Record<string, any>> = $state(
		new TableHandler(data.pedidos, { rowsPerPage: 20 })
	);
	let sort_columns = ['fecha', 'pago', 'factura numero', 'numero', 'contabilizado', 'log'];
	let columns = $derived(
		Object.keys(pedidos?.at(0)).map((key) => key.toLowerCase().split('_').join(' '))
	);

	async function refresh() {
		loading = true;
		try {
			pedidos = await GetArray(data.backendUrl, '/transacciones', '/pedidos', data.access_token);
		} finally {
			loading = false;
		}
	}
</script>

<section class="sticky top-0 z-10 flex w-full flex-col items-center gap-5 bg-white pt-21">
	<h1 class="w-full text-center text-2xl font-bold">Explorador de pedidos</h1>
	<div class="flex w-full">
		<div class="flex w-full flex-col">
			<button
				onclick={refresh}
				class="btn cursor-pointer self-end rounded-2xl bg-teal-700 px-4 py-2 font-bold text-white"
				disabled={loading}>
				{#if loading}
					Refrescando...
				{:else}
					Refrescar
				{/if}
			</button>
		</div>
	</div>
</section>

<div class="h-165 w-full rounded-md border-1 border-gray-400 p-5">
	{#if pedidos}
		<Datatable basic {table}>
			<table>
				<thead class="bg-white!">
					<tr>
						{#each sort_columns as column}
							<ThSort {table} field={column}>{column}</ThSort>
						{/each}
					</tr>
					<tr>
						{#each sort_columns as column}
							<ThFilter {table} field={column} />
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each table.rows as row}
						<tr>
							{#each sort_columns as column}
								<td>{row[column]}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</Datatable>
	{/if}
</div>
