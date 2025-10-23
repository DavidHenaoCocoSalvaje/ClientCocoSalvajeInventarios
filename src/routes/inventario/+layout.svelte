<script lang="ts">
	import type { Section } from '$lib/models/aside';
	import AsideLeft from '../../lib/components/AsideLeft.svelte';

	let { children } = $props();

	let sections: Array<Section> = $state([
		{
            title: 'Reportes',
            open: true,
            items: [
                {
                    title: 'Saldos',
                    selected: false
                },{
                    title: 'Ventas',
                    selected: true
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
                }
            ]
        }
	]);
</script>

<AsideLeft root="/inventario" {sections} />
<div
	class="flex w-full flex-col items-center gap-5 overflow-x-hidden overflow-y-auto px-10 pt-14 pb-5">
	{@render children()}
</div>

