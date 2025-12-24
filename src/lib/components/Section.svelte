<script lang="ts">
	let { children } = $props();
</script>

<section class="sticky top-0 z-20 flex w-full flex-col items-center gap-5 bg-white pt-5">
	{@render children()}
</section>