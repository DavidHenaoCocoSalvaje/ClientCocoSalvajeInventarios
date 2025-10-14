<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		Chart,
		LineController,
		LineElement,
		PointElement,
		LinearScale,
		Title,
		CategoryScale,
		Tooltip,
		Legend,
		Filler
	} from 'chart.js';

	// Registrar los módulos necesarios
	Chart.register(
		LineController,
		LineElement,
		PointElement,
		LinearScale,
		Title,
		CategoryScale,
		Tooltip,
		Legend,
		Filler
	);

	// Declaramos las props usando la nueva API de Svelte 5
	interface Props {
		labels: string[];
        labelData: string;
		data: number[];
		color?: string;
		title?: string;
	}

	let { labels, labelData, data, color = '#4F46E5', title = '' }: Props = $props();

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	onMount(() => {
		if (!canvas) return;

		chart = new Chart(canvas, {
			type: 'line',
			data: {
				labels,
				datasets: [
					{
                        label: labelData,
						data,
						borderColor: color,
						backgroundColor: `${color}33`, // color transparente
						tension: 0.3,
						fill: true,
						pointRadius: 4,
						pointBackgroundColor: color
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					legend: { display: true },
					title: { display: true, text: title }
				},
				scales: {
					y: { beginAtZero: true }
				}
			}
		});
	});

	onDestroy(() => {
		chart?.destroy();
	});

	// Si cambian props dinámicamente, actualizamos el gráfico sin recrearlo
	$effect(() => {
		if (chart) {
			chart.data.labels = labels;
			chart.data.datasets[0].data = data;
			chart.data.datasets[0].borderColor = color;
			chart.data.datasets[0].backgroundColor = `${color}33`;
			chart.update();
		}
	});
</script>

<div class="w-full max-w-3xl rounded-md border border-gray-300 bg-white p-4">
	<canvas bind:this={canvas}></canvas>
</div>
