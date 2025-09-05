<script lang="ts">
	import type { Section } from '$lib/models/aside';
	import { slide } from 'svelte/transition';
	let { sections, root }: { sections: Array<Section>; root: string } = $props();
</script>

<!-- shring-0 evita que el elemento se compima-->
<aside
	class="sticky top-0 left-0 h-screen w-60 shrink-0 border-r-1 border-r-gray-400 px-10 pt-21 pb-5 font-semibold">
	<div class="flex flex-col gap-2">
		{#each sections as section}
			<button
				class="flex w-full items-center justify-between"
				onclick={() => (section.open = !section.open)}>
				{section.title}
				<svg
					class="h-4 w-4 transform transition-transform {section.open ? 'rotate-90' : ''}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 18 6-6-6-6" />
				</svg>
			</button>
			{#if section.open}
				<ul class="my-2 ml-4 space-y-1" transition:slide={{ duration: 100 }}>
					{#each section.items as item}
						<li>
							<a href="{root}/{section.title.toLocaleLowerCase()}/{item.title.toLocaleLowerCase()}"
								>{item.title}</a>
						</li>
					{/each}
				</ul>
			{/if}
		{/each}
	</div>
</aside>
