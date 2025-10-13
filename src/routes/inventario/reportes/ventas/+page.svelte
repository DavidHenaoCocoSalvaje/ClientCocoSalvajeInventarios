<script lang="ts">
	import { formatCop, SortDirection, startEndMonth } from '$lib';
	import Button from '$lib/components/Button.svelte';
	import DataGrid from '$lib/components/DataGrid.svelte';
	import DateRange from '$lib/components/DateRange.svelte';
	import RefreshSVG from '$lib/components/RefreshSVG.svelte';
	import Select from '$lib/components/Select.svelte';
	import SelectBox from '$lib/components/SelectBox.svelte';
	import WordsBox from '$lib/components/WordsBox.svelte';
	import { Format, IFrecuencia, Movimiento, type IVenta } from '$lib/routes/Inventario/index.js';
	import * as echarts from 'echarts/core';

	let { data } = $props();
	let ventasPorReferencia: Array<IVenta> = $state(data.ventas);
	let ventasPorMetadato: Array<IVenta> = $state([]);
	const defaultDates = startEndMonth(new Date());
    let datesReference = $state({
        startDate: defaultDates[0],
        endDate: defaultDates[1]
    })
    let datesMetadato = $state({
        startDate: defaultDates[0],
        endDate: defaultDates[1]
    })
	let fVentas = $derived(Format.ventas(ventasPorReferencia));
    let loadingRefreshVentasPorMetadato = $state(false);

	const columnsVentasPorReferencia = [
		'fecha',
		'sku',
		'variante',
		'cantidad',
		'cantidad_%',
		'valor',
		'valor_%'
	];
	let frecuenciaPorReferenciaSelected = $state(IFrecuencia.DIARIO);
	let frecuenciaOptions = () => {
		const keys = Object.keys(IFrecuencia);
		return keys.map((key) => ({
			value: IFrecuencia[key as keyof typeof IFrecuencia].valueOf(),
			text: key
		}));
	};

	const columnsVentasPorMetadato = [
		'fecha',
		'meta_valor',
		'cantidad',
		'cantidad_%',
		'valor',
		'valor_%'
	];
	let frecuenciaPorMetadatoSelected = $state(IFrecuencia.DIARIO);

	async function refreshVentasPorReferencia() {
        // console.log(startDatePorReferencia, endDatePorReferencia);
		ventasPorReferencia = await Movimiento.getVentasAgrupadas(
			data.backendUrlCsr,
			data.access_token,
			datesReference.startDate,
			datesReference.endDate,
			SortDirection.DESC,
			frecuenciaPorReferenciaSelected
		);
	}

	async function refreshVentasPorMetadato() {
        loadingRefreshVentasPorMetadato = true;
		const groupBy = ['meta_valor'];
		const metaValorIds = optionsMetaVaroles
			.filter((option) => option.selected)
			.map((option) => parseInt(option.value));
		ventasPorMetadato = await Movimiento.getVentasAgrupadas(
			data.backendUrlCsr,
			data.access_token,
			datesMetadato.startDate,
			datesMetadato.endDate,
			SortDirection.DESC,
			frecuenciaPorMetadatoSelected,
			groupBy,
			metaValorIds
		);
        loadingRefreshVentasPorMetadato = false;
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

    function getMetaValores() {
        return data.metadatosDistinct.map((metadato) => metadato.meta_valor);
    }

	const optionsMetaAtributos = $state(getOptionsMetaAtributos());
    const metaValores = $state(getMetaValores());
    let filterWordMetaValor = $state('');

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

	let agrupacionPorMetadatoSelected = $state('valor');
	const optionsAgrupacionMetadato = $state([
		{
			value: 'valor',
			text: 'Por valor/es'
		},
		{
			value: 'palabra',
			text: 'Por palabra'
		}
	]);
</script>

<section class="sticky top-0 z-20 flex w-full flex-col items-center gap-5 bg-white pt-5">
	<h1 class="w-full text-center text-xl font-bold">Ventas</h1>
</section>

{#if fVentas}
	<section class="flex w-full flex-col gap-5">
		<h2 class="w-full text-justify text-xl font-semibold">Ventas por referencia</h2>
		<form action="" class="flex items-center gap-5">
			<DateRange dateRange={datesReference} />
			<Select
				options={frecuenciaOptions()}
				label={'Frecuencia'}
				bind:value={frecuenciaPorReferenciaSelected}></Select>
		</form>
		<DataGrid
			data={fVentas}
			columns={columnsVentasPorReferencia}
			refresh_data={refreshVentasPorReferencia} />
		<h2 class="w-full text-justify text-lg">Kpi ventas generales</h2>
		<div class="flex w-full flex-wrap gap-5">
			<div class="flex w-fit flex-col items-center gap-2 rounded-md bg-teal-100 px-4 py-2">
				<span class="font-bold">Ventas totales</span>
				{#if ventasPorReferencia}
					{formatCop(
						ventasPorReferencia.reduce((sum, v) => {
							return sum + v.valor;
						}, 0)
					)}
				{/if}
			</div>
		</div>
	</section>

	<section class="flex w-full flex-col gap-5">
		<h2 class="w-full text-justify text-xl font-semibold">Ventas por metadato</h2>
		<form action="" class="flex items-center gap-5">
			<DateRange dateRange={datesMetadato} />
			<Select
				options={frecuenciaOptions()}
				label={'Frecuencia'}
				bind:value={frecuenciaPorMetadatoSelected}></Select>
			<Select
				options={optionsAgrupacionMetadato}
				label="Agrupación"
				bind:value={agrupacionPorMetadatoSelected}></Select>
            <Button action={refreshVentasPorMetadato} style="bg-teal-700 text-white">
                <RefreshSVG loading={loadingRefreshVentasPorMetadato}></RefreshSVG>
            </Button>
		</form>
        {#if agrupacionPorMetadatoSelected == 'valor'}
            <SelectBox
                options={optionsMetaAtributos}
                todos={true}
                onToogle={() => {
                    optionsMetaVaroles = getOptionsMetavalores();
                }} />
            <SelectBox options={optionsMetaVaroles} todos={false} />
            {#if ventasPorMetadato.length > 0}
                <DataGrid
                    data={ventasPorMetadato}
                    columns={columnsVentasPorMetadato}
                    refresh_data={refreshVentasPorMetadato}></DataGrid>
            {/if}
        {:else if agrupacionPorMetadatoSelected == 'palabra'}
            <WordsBox words={metaValores} bind:filterWord={filterWordMetaValor}></WordsBox>
        {/if}
	</section>
{/if}
