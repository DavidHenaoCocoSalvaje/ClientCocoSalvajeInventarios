<script lang="ts">
	import DataGrid from '$lib/components/DataGrid.svelte';
	import { Slado, type ISaldo } from '$lib/routes/Inventario/index.js';

	let { data } = $props();

	let saldos: Array<ISaldo> = $state(data.saldos);
	let rows = $state(200);

	async function refresh() {
		const saldo = new Slado();
		saldos = await saldo.get_list({
			url: data.backendUrlCsr,
			access_token: data.access_token
		});
	}
</script>

<section class="sticky top-0 z-20 flex w-full flex-col items-center gap-5 bg-white pt-5">
	<h1 class="w-full text-center text-lg font-bold">Saldos</h1>
</section>

{#if saldos}
	<DataGrid data={saldos} bind:rows refresh_data={refresh} />
{/if}
