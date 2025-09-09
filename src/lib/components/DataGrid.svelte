<script lang="ts">
	import { filterByProperties, sortByProperties, StringUtils } from '$lib';
	import Button from './Button.svelte';

	interface Props {
		data: Array<Record<string, any>>;
		columns?: Array<string>;
	}

	interface Cursor {
		pageSize: number;
		page: number;
		lastIndex: number;
		pages: number;
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
	let filteredData: Array<Record<string, any>> = $derived.by(() => {
		return filterByProperties<Record<string, any>>(
			data,
			Object.entries(filtredCriteria).map(([key, value]) => ({ key, value }))
		);
	});

	let sortCriteria: Record<string, any> = $state({});
	let sortedData: Array<Record<string, any>> = $derived.by(() => {
		return sortByProperties<Record<string, any>>(
			filteredData,
			Object.entries(sortCriteria).map(([key, value]) => ({ key, direction: value }))
		);
	});

	let cursor: Cursor = $state({ pageSize: 20, page: 1, lastIndex: 0, pages: 1 });

	function filtrar(key: string, value: string) {
		filtredCriteria = { ...filtredCriteria, [key]: value };
	}

	function ordenar(key: string, value: string) {
		sortCriteria[key] === value
			? delete sortCriteria[key]
			: (sortCriteria = { ...sortCriteria, [key]: value });
	}
</script>

<div class="flex w-full flex-col gap-5 rounded-md border border-gray-300 p-5">
	<div class="h-140 w-full overflow-auto">
		<table class="w-full text-center text-sm">
			<thead class="sticky top-0 z-10 bg-white">
				<tr>
					{#each dataColumns as column}
						<th class="px-2 pb-2 font-semibold">
							<div class="flex w-full justify-between gap-5 px-2">
								<span>{StringUtils.capitilize(column, '_')}</span>
								<div class="flex gap-2">
									<button aria-label="ascending" onclick={() => ordenar(column, 'asc')}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5 cursor-pointer {sortCriteria[column] === 'asc'
												? 'fill-teal-400'
												: 'fill-gray-400'}"
											viewBox="0 0 20 20">
											<path
												d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" />
										</svg>
									</button>
									<button aria-label="descending" onclick={() => ordenar(column, 'desc')}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5 rotate-180 transform cursor-pointer {sortCriteria[column] ===
											'desc'
												? 'fill-teal-400'
												: 'fill-gray-400'}"
											viewBox="0 0 20 20">
											<path
												d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" />
										</svg>
									</button>
								</div>
							</div>
						</th>
					{/each}
				</tr>
				<tr>
					{#each dataColumns as column}
						<th class="content-between px-2 pb-5">
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
				{#each sortedData as row, i}
					<tr>
						{#each dataColumns as key}
							<td
								class="max-w-40 border-gray-300 px-2 py-1 text-justify wrap-break-word"
								class:border-t={i > 0}>{row[key]}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<section class="flex w-full items-center justify-end gap-5 px-2">
		<span>{cursor.page} de {cursor.pages}</span>
		<Button
			action={() => {
				if (cursor.page > 1) cursor.page--;
			}}>Anterior</Button>
		<Button
			action={() => {
				if (cursor.page < cursor.pages) cursor.page++;
			}}>Siguiente</Button>
	</section>
</div>
