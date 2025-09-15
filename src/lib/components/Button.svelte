<script lang="ts">
	interface Props {
		action: () => void;
		style?: string;
		children?: any;
	}

	let { action, style, children }: Props = $props();
</script>

<button class="w-fit cursor-pointer rounded-md px-4 py-1     {style}" onclick={action}
	>{@render children()}</button>
