<script lang="ts">
	let { loading }: { loading: Boolean } = $props();
</script>

<svg
	class="h-5 w-5 {loading ? 'animate-spin' : ''}"
	fill="none"
	stroke="currentColor"
	viewBox="0 0 20 20"
	xmlns="http://www.w3.org/2000/svg">
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="2"
		d="M13.35 7.79h4.16v-.001M2.49 16.37v-4.16m0 0h4.16m-4.16 0 2.65 2.65a6.88 6.88 0 0 0 11.5-3.08M3.36 8.22a6.88 6.88 0 0 1 11.5-3.08l2.65 2.65m0-4.16v4.16" />
</svg>
