<script lang="ts">
	const { data } = $props();
	const columns = $derived(
		Object.keys(data?.at(0)).map((key) => key.toUpperCase().split('_').join(' '))
	);
	const rows = $derived(data || []);
</script>

<table class="w-full rounded-lg border border-gray-400 text-center text-sm">
	<thead>
		<tr>
			{#each columns as column}
				<th class="px-4">{column}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each rows as row}
			<tr>
				{#each Object.values(row) as celda}
					<td class="border-t border-gray-300 px-4">{celda}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
