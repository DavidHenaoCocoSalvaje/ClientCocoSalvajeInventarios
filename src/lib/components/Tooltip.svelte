<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		text: string;
		position?: 'top' | 'bottom' | 'left' | 'right';
		children: Snippet;
	}

	let { text, position = 'top', children }: Props = $props();

	const positionClasses = {
		top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
		bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
		left: 'right-full top-1/2 -translate-y-1/2 mr-2',
		right: 'left-full top-1/2 -translate-y-1/2 ml-2'
	};
</script>

<div class="group relative inline-block">
	{@render children()}
	<span
		class="pointer-events-none absolute z-50 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 {positionClasses[position]}">
		{text}
	</span>
</div>
