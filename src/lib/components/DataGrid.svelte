<script lang="ts">
	import { filterByProperties, StringUtils } from '$lib';

	interface Props {
		data: Array<Record<string, any>>;
		columns?: Array<string>;
	}

	let { data, columns }: Props = $props();

	let dataColumns = $derived.by(() => {
		if (columns && columns.length > 0) {
			return columns;
		}
		if (data.length > 0) {
			return Object.keys(data[0]).map((key) => key.toUpperCase().split('_').join(' '));
		}
		return [];
	});

	let filtredCriteria: Record<string, string> = $state({});
	let filteredData = $state(data);

	$effect(() => {
		if (filtredCriteria) {
			filteredData = filterByProperties<Record<string, any>>(
				data,
				Object.entries(filtredCriteria).map(([key, value]) => ({ key, value }))
			);
		}
	});

	function filtrar(key: string, value: string) {
		filtredCriteria = { ...filtredCriteria, [key]: value };
	}
</script>

<div
	class="flex h-160 w-full flex-col gap-5 overflow-auto rounded-md border border-gray-300 px-4 py-2">
	<table class="w-full text-center text-sm">
		<thead>
			<tr>
				{#each dataColumns as column}
					<th class="px-2 py-1">{StringUtils.capitilize(column)}</th>
				{/each}
			</tr>
			<tr>
				{#each dataColumns as column}
					<th class="px-2 py-1">
						<input
							type="text"
							class="w-full rounded-sm border border-gray-300 px-2 py-1 font-normal focus:outline-gray-300"
							placeholder="filtro"
							oninput={(e) => filtrar(column, (e.target as HTMLInputElement).value)} />
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each filteredData as row}
				<tr>
					{#each dataColumns as key}
						<td class="max-w-40 border-t border-gray-300 px-2 py-1 wrap-break-word">{row[key]}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
