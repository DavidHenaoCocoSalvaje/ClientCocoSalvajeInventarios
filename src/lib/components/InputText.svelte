<script lang="ts">
	import { alfanumericRandom } from '$lib';

	interface Props {
		label?: string;
		width?: string;
		value?: string;
		placeholder?: string;
		onInput?: (v: string) => void;
		type?: string;
		id?: string;
		name?: string;
		autocomplete?: any;
		required?: boolean;
	}

	let {
		label,
		placeholder,
		onInput,
		width = 'w-full',
		value = $bindable(),
		type = 'text',
		id = alfanumericRandom(),
		name,
		autocomplete,
		required = false
	}: Props = $props();
</script>

{#if label}
	<label for={id}>{label}</label>
{/if}
<input
	{id}
	{type}
	{name}
	{autocomplete}
	{required}
	class="{width} rounded-sm border border-gray-300 px-2 font-normal transition-colors duration-200 hover:border-teal-500 focus:border-teal-500 focus:outline-none"
	bind:value
	{placeholder}
	oninput={() => onInput?.(value || '')} />
