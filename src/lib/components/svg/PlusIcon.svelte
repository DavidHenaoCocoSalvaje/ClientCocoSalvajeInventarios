<script lang="ts">
	interface Props {
		class?: string;
	}
	let { class: className = 'h-5 w-5' }: Props = $props();
</script>

<svg
	class={className}
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg">
	<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>
