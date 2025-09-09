<script lang="ts">
	import type { Section } from '$lib/models/aside';
	import AsideLeft from '../../lib/components/AsideLeft.svelte';

	let { children } = $props();

	let sections: Array<Section> = $state([
		{
			title: 'Elementos',
			open: false,
			items: [
				{
					title: 'Explorador',
					selected: false
				}
			]
		},
		{
			title: 'Movimientos',
			open: false,
			items: [
				{
					title: 'Explorador',
					selected: false
				},
				{
					title: 'Saldos',
					selected: false
				}
			]
		}
	]);
</script>

<AsideLeft {sections} root="/inventario" />
<div class="flex flex-col items-center gap-5 px-10">
	{@render children()}
</div>
