<script lang="ts">
	import { alfanumericRandom } from '$lib';

	interface Option {
		value: string | number;
		text: string;
	}

	interface Props {
		label?: string;
		options: Option[];
		value?: string | number;
		required?: boolean;
		width?: string;
		id?: string;
	}

	let {
		label,
		options,
		value = $bindable(),
		required = false,
		width = 'w-full',
		id = alfanumericRandom()
	}: Props = $props();
</script>

{#if label}
	<label for={id} class="mr-2">{label}:</label>
{/if}
<select
	{id}
	class="appearance-none rounded-md border border-gray-300 bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-size-[1.25rem] bg-position-[right_0.5rem_center] bg-no-repeat px-2 py-1 pr-8 font-normal transition-colors duration-200 hover:border-teal-500 focus:border-teal-500 focus:outline-none {width}"
	bind:value
	{required}>
	{#each options as option}
		<option value={option.value}>{option.text}</option>
	{/each}
</select>
