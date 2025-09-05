<script lang="ts">
	import type { Section } from '$lib/models/aside';
	import AsideLeft from '../../components/AsideLeft.svelte';

	let { children } = $props();

	let sections: Array<Section> = $state([
		{
			title: 'Pedidos',
			open: false,
			items: [
				{
					title: 'Explorador',
					selected: false
				}
			]
		}
	]);
</script>

<AsideLeft root="/transacciones" {sections} />
<div class="flex w-full flex-col items-center gap-5 overflow-hidden px-10">
	{@render children()}
</div>
