<script lang="ts">
	import { formatCop, SortDirection, startEndMonth } from '$lib';
	import DataGrid from '$lib/components/DataGrid.svelte';
	import DateRange from '$lib/components/DateRange.svelte';
	import SelectBox from '$lib/components/SelectBox.svelte';
	import { Format, IFrecuencia, Movimiento, type IVenta } from '$lib/routes/Inventario/index.js';
	import * as echarts from 'echarts/core';
	import { get } from 'svelte/store';

	let { data } = $props();
	let ventas: Array<IVenta> = $state(data.ventas);
	const defaultDates = startEndMonth(new Date());
	let startDatePorReferencia = $state(defaultDates[0]);
	let endDatePorReferencia = $state(defaultDates[1]);
    let startDatePorMetadato = $state(defaultDates[0]);
    let endDatePorMetadato = $state(defaultDates[1]);
	let f_ventas = $derived(Format.ventas(ventas));
	let rows = $state(200);

	const sortColumns = ['fecha', 'sku', 'variante', 'cantidad', 'valor'];
	let frecuenciaPorReferenciaSelected = $state(IFrecuencia.DIARIO);
    let frecuenciaPorMetadatoSelected = $state(IFrecuencia.DIARIO);

	async function refresh() {
		ventas = await Movimiento.getVentas(
			data.backendUrlCsr,
			data.access_token,
			startDatePorReferencia,
			endDatePorReferencia,
			SortDirection.DESC,
			frecuenciaPorReferenciaSelected
		);
	}

	const metaAtributosDistinct = $derived(
		data.metadatosDistinct.reduce(
			(acc: Array<{ meta_atributo_id: number; meta_atributo: string }>, metadato) => {
				if (acc.some((item) => item.meta_atributo === metadato.meta_atributo)) {
					return acc;
				} else {
					acc.push(metadato);
					return acc;
				}
			},
			[]
		)
	);

	function getOptionsMetaAtributos() {
		return metaAtributosDistinct.map((metadato) => ({
			value: String(metadato.meta_atributo_id),
			label: metadato.meta_atributo,
			selected: true
		}));
	}

	const optionsMetaAtributos = $state(getOptionsMetaAtributos());


	function getOptionsMetavalores() {
		const options = [];
		for (const metadato of data.metadatosDistinct) {
			if (
				optionsMetaAtributos.find(
					(option) => option.value === String(metadato.meta_atributo_id) && option.selected
				)
			) {
				options.push({
					value: String(metadato.meta_valor_id),
					label: metadato.meta_valor,
					selected: false
				});
			}
		}
		return options;
	}

	let optionsMetaVaroles = $state(getOptionsMetavalores());
</script>

<section class="sticky top-0 z-20 flex w-full flex-col items-center gap-5 bg-white pt-5">
	<h1 class="w-full text-center text-xl font-bold">Ventas</h1>
</section>

{#if f_ventas}
	<section class="flex w-full flex-col gap-5">
		<h2 class="w-full text-justify text-xl font-semibold">Ventas por referencia</h2>
		<form action="" class="flex items-center gap-5">
            <DateRange start_date={startDatePorReferencia} end_date={endDatePorReferencia} />
			<div>
				<label for="select-frecuencia-referencia" class="mr-2">Frecuencia:</label>
				<select
					id="select-frecuencia-referencia"
					class="box-border rounded-md border px-2"
					bind:value={frecuenciaPorReferenciaSelected}>
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
        <h2 class="w-full text-justify text-xl">Ventas por metadato</h2>
        <form action="" class="flex items-center gap-5">
            <DateRange start_date={startDatePorMetadato} end_date={endDatePorMetadato} />
        </form>
		<SelectBox options={optionsMetaAtributos} todos={true} onToogle={() => {optionsMetaVaroles = getOptionsMetavalores()}}/>
		<SelectBox options={optionsMetaVaroles} todos={false} />
	</section>
	<section class="flex w-full flex-col items-start gap-5"></section>
{/if}
