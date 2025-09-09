<script lang="ts">
	interface Props {
		action: () => void;
		bg?: string;
		children?: any;
	}

	let { action, children, bg }: Props = $props();
</script>

<button
	class="cursor-pointer rounded-md bg-teal-700 px-4 py-2 font-semibold text-white"
	onclick={action}>{@render children()}</button>
