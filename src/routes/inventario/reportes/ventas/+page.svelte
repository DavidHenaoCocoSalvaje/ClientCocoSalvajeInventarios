<script lang="ts">
	import { formatCop, SortDirection, startEndMonthString, yearStartAndMonthEndString } from '$lib';
	import Button from '$lib/components/Button.svelte';
	import DataGrid from '$lib/components/DataGrid.svelte';
	import DateRange from '$lib/components/DateRange.svelte';
	import LineChartComponent from '$lib/components/LineChartComponent.svelte';
	import RefreshSVG from '$lib/components/RefreshSVG.svelte';
	import Select from '$lib/components/Select.svelte';
	import {
		InventarioFormat,
		IFrecuencia,
		Movimiento,
		type IVenta
	} from '$lib/routes/Inventario/index.js';

	let { data } = $props();
	let ventasPorReferencia: Array<IVenta> = $state(data.ventas);
	const defaultDatesReferencia = startEndMonthString(new Date());
	let datesReference = $state({
		startDate: defaultDatesReferencia[0],
		endDate: defaultDatesReferencia[1]
	});
	let fVentasReferencia = $derived(InventarioFormat.ventas(ventasPorReferencia));

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

	let loadingRefreshVentasPorReferencia = $state(false);
	async function refreshVentasPorReferencia() {
		loadingRefreshVentasPorReferencia = true;
		ventasPorReferencia = await Movimiento.getVentasAgrupadas({
			url: data.backendUrlCsr,
			access_token: data.access_token,
			start_date: datesReference.startDate,
			end_date: datesReference.endDate,
			sort: SortDirection.DESC,
			frequency: frecuenciaPorReferenciaSelected
		});
		loadingRefreshVentasPorReferencia = false;
	}

	let historicoVentas: Array<IVenta> = $state([]);
	let fVentasTotales = $derived(InventarioFormat.ventas(historicoVentas));
	let defaultDatesHistorico = yearStartAndMonthEndString(new Date());
	let datesHistorico = $state({
		startDate: defaultDatesHistorico[0],
		endDate: defaultDatesHistorico[1]
	});
	let frecuencyHistoricoSelected = $state(IFrecuencia.MENSUAL);
	let loadingRefreshHistoricoVentas = $state(false);
	async function refreshHistoricoVentas() {
		loadingRefreshHistoricoVentas = true;
		historicoVentas = await Movimiento.getVentasAgrupadas({
			url: data.backendUrlCsr,
			access_token: data.access_token,
			start_date: datesHistorico.startDate,
			end_date: datesHistorico.endDate,
			sort: SortDirection.DESC,
			frequency: frecuencyHistoricoSelected,
			metaValorIds: []
		});
		loadingRefreshHistoricoVentas = false;
	}
</script>

<section class="sticky top-0 z-20 flex w-full flex-col items-center gap-5 bg-white pt-5">
	<h1 class="w-full text-center text-xl font-bold">Ventas</h1>
</section>

{#if fVentasReferencia}
	<section class="flex w-full flex-col gap-5">
		<h2 class="w-full text-justify text-xl font-semibold">Ventas por referencia</h2>
		<form action="" class="flex items-center gap-5">
			<DateRange dateRange={datesReference} />
			<Select
				options={frecuenciaOptions()}
				label={'Frecuencia'}
				bind:value={frecuenciaPorReferenciaSelected}></Select>
			<Button action={refreshVentasPorReferencia} style="bg-teal-700 text-white">
				<RefreshSVG loading={loadingRefreshVentasPorReferencia}></RefreshSVG>
			</Button>
		</form>
		<DataGrid
			data={fVentasReferencia}
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
{/if}

<section class="flex w-full flex-col gap-5">
	<h2 class="w-full text-justify text-xl font-semibold">Historico de ventas</h2>
	<form action="" class="flex items-center gap-5">
		<DateRange dateRange={datesHistorico} />
		<Select
			options={frecuenciaOptions()}
			label={'Frecuencia'}
			bind:value={frecuencyHistoricoSelected}></Select>
		<Button action={refreshHistoricoVentas} style="bg-teal-700 text-white">
			<RefreshSVG loading={loadingRefreshHistoricoVentas}></RefreshSVG>
		</Button>
	</form>
</section>
<div class="flex w-full justify-start">
	<LineChartComponent
		labels={fVentasTotales.map((venta) => {
			return venta.fecha;
		})}
		labelData="Ventas totales"
		data={historicoVentas.map((venta) => {
			return venta.valor;
		})}
		title="Historico de ventas"></LineChartComponent>
</div>
