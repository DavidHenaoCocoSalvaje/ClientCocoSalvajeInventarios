<script lang="ts">
	import DataGrid from '$lib/components/DataGrid.svelte';
	import { Slado, type ISaldo } from '$lib/routes/Inventario/index.js';
	
	let { data } = $props();

	let saldos: Array<ISaldo> = $state(data.saldos);
	let rows = $state(200);

	async function refresh() {
		const saldo = new Slado();
		saldos = await saldo.get_list(
			data.backendUrlCsr,
			data.access_token,
		);
	}
</script>

<section class="sticky top-0 pt-5 z-20 flex w-full flex-col items-center gap-5 bg-white">
	<h1 class="w-full text-center text-lg font-bold">Saldos</h1>    
</section>

{#if saldos}
	<DataGrid data={saldos} bind:rows refresh_data={refresh} />
{/if}
