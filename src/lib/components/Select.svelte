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
		class="box-border rounded-md border px-2"
		bind:value
		{required}>
		{#each options as option}
			<option value={option.value}>{option.text}</option>
		{/each}
	</select>
</div>
