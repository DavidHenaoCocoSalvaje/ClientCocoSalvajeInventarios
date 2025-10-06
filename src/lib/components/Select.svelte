<script lang="ts">
	interface Props {
		label: string;
		options: string[];
		value: any;
	}

	let { label, options, value = $bindable() }: Props = $props();
</script>

<div>
	<label for="select-frecuencia-referencia" class="mr-2">{label}:</label>
	<select id="select-frecuencia-referencia" class="box-border rounded-md border px-2" bind:value>
		{#each options as option}
			<option {value}>{option}</option>
		{/each}
	</select>
</div>
