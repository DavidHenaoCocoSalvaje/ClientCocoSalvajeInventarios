<script lang="ts">
	import AsideLeft from '$lib/components/AsideLeft.svelte';
	import { sections as initialSections } from '$lib/routes/facturacion/navigation';

	let { children } = $props();
	let sections = $state(initialSections);
</script>

<AsideLeft root="/facturacion" {sections} />
{@render children()}
