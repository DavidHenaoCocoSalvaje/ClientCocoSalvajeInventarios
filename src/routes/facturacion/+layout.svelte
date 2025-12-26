<script lang="ts">
	import AsideLeft from '$lib/components/AsideLeft.svelte';
	import { sections as initialSections } from '$lib/routes/facturacion/navigation';

	let { children } = $props();
	let sections = $state(initialSections);
</script>

<AsideLeft root="/facturacion" {sections} />
<div
	class="flex w-full flex-col items-center gap-5 overflow-x-hidden overflow-y-auto px-10 pt-14 pb-5">
	{@render children()}
</div>
