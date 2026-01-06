<script lang="ts">
	let { children } = $props();
</script>

<div
	class="flex w-full flex-col items-center gap-5 overflow-x-hidden overflow-y-auto px-10 pt-14 pb-5">
	{@render children()}
</div>
