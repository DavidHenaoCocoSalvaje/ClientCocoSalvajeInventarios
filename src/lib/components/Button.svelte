<script lang="ts">
	interface Props {
		action?: () => void;
		style?: string;
		children?: any;
		type?: 'button' | 'submit' | 'reset';
	}

	let { action, style, children, type = 'button' }: Props = $props();
</script>

<button {type} class="w-fit cursor-pointer rounded-md px-4 py-1 {style}" onclick={action}
	>{@render children()}</button>
