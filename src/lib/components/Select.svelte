<script lang="ts">
	interface Options {
		value: string;
		text: string;
	}

	interface Props {
		label: string;
		options: Options[];
		value: any;
		required?: boolean;
	}

	let { label, options, value = $bindable(), required = false }: Props = $props();
</script>

<div>
	<label for="select-frecuencia-referencia" class="mr-2">{label}:</label>
	<select
		id="select-frecuencia-referencia"
		class="box-border rounded-md border border-gray-300 px-2 transition-colors duration-200 hover:border-teal-500 focus:border-teal-500 focus:outline-none"
		bind:value
		{required}>
		{#each options as option}
			<option value={option.value}>{option.text}</option>
		{/each}
	</select>
</div>
