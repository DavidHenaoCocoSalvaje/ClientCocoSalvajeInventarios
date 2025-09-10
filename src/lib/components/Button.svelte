<script lang="ts">
	interface Props {
		action: () => void;
		bg?: string;
		children?: any;
	}

	let { action, children, bg }: Props = $props();
	bg = bg ? bg : 'bg-teal-700';
</script>

<button class="cursor-pointer rounded-md px-4 py-2 font-semibold text-white {bg}" onclick={action}
	>{@render children()}</button>
