<!-- Se utiliza para renderizar el contenido debajo del header -->

<script lang="ts">
	interface Props {
		children?: any;
		className?: string;
	}
	let { children, className }: Props = $props();
</script>

<section class="flex w-full flex-col overflow-auto  bg-white mt-14 {className}">
	{@render children()}
</section>