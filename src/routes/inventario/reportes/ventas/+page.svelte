<script lang="ts">
	import { formatCop, SortDirection, startEndMonth } from '$lib';
	import DataGrid from '$lib/components/DataGrid.svelte';
	import SelectBox from '$lib/components/SelectBox.svelte';
	import { Format, IFrecuencia, Movimiento, type IVenta } from '$lib/routes/Inventario/index.js';
	import * as echarts from 'echarts/core';

	let { data } = $props();
	let ventas: Array<IVenta> = $state(data.ventas);
	const defaultDates = startEndMonth(new Date());
	let start_date = $state(defaultDates[0]);
	let end_date = $state(defaultDates[1]);
	let f_ventas = $derived(Format.ventas(ventas));
	let rows = $state(200);

	const sortColumns = ['fecha', 'sku', 'variante', 'cantidad', 'valor'];
	let frecuenciaSelected = $state(IFrecuencia.DIARIO);

	async function refresh() {
		ventas = await Movimiento.getVentas(
			data.backendUrlCsr,
			data.access_token,
			start_date,
			end_date,
			SortDirection.DESC,
			frecuenciaSelected
		);
	}

	const options = $state(
		data.metaValores.map((valor) => ({ value: valor, label: valor, selected: false }))
	);
</script>

<section class="sticky top-0 z-20 flex w-full flex-col items-center gap-5 bg-white pt-5">
	<h1 class="w-full text-center text-xl font-bold">Ventas</h1>
</section>

{#if f_ventas}
	<section class="flex w-full flex-col gap-5">
		<h2 class="w-full text-justify text-xl font-semibold">Ventas por referencia</h2>
		<form action="" class="flex items-center gap-5">
			<div>
				<label for="start_date" class="mr-2">Desde:</label>
				<input
					type="date"
					id="start_date"
					name="start_date"
					defaultValue={defaultDates[0]}
					class="box-border rounded-md border px-2"
					bind:value={start_date}
					required />
			</div>
			<div>
				<label for="end_date" class="mr-2">Hasta:</label>
				<input
					type="date"
					id="end_date"
					name="end_date"
					defaultValue={defaultDates[1]}
					class="box-border rounded-md border px-2"
					bind:value={end_date}
					required />
			</div>
			<div>
				<label for="select-frecuencia" class="mr-2">Frecuencia:</label>
				<select
					id="select-frecuencia"
					class="box-border rounded-md border px-2"
					bind:value={frecuenciaSelected}>
					{#each Object.keys(IFrecuencia) as frecuencia}
						<option value={IFrecuencia[frecuencia as keyof typeof IFrecuencia]}
							>{frecuencia}</option>
					{/each}
				</select>
			</div>
		</form>
		<DataGrid data={f_ventas} columns={sortColumns} bind:rows refresh_data={refresh} />
		<h2 class="w-full text-justify text-lg">Kpi ventas generales</h2>
		<div class="flex w-full flex-wrap gap-5">
			<div class="flex w-fit flex-col items-center gap-2 rounded-md bg-teal-100 px-4 py-2">
				<span class="font-bold">Ventas totales</span>
				{#if ventas}
					{formatCop(
						ventas.reduce((sum, v) => {
							return sum + v.valor;
						}, 0)
					)}
				{/if}
			</div>
		</div>
	</section>
	<section class="flex w-full flex-col gap-5">
		<h2 class="w-full text-justify text-xl">Ventas por etiqueta</h2>
		<!-- <form action="" class="flex items-center gap-5">
			<div>
				<label for="select-frecuencia" class="mr-2">Etiqueta:</label>
				<select id="select-frecuencia" class="box-border rounded-md border px-2">
					{#each data.metaValores as valor}
						<option value={valor}>{valor}</option>
					{/each}
				</select>
			</div>
		</form> -->
        <SelectBox options={options} />
	</section>
	<section class="flex w-full flex-col items-start gap-5"></section>
{/if}
