<script lang="ts">
	import {
		addFilter,
		addSort,
		alfanumericRandom,
		filterByCriteria,
		sortByProperties,
		SortDirection,
		StringUtils,
		type FilterCriteria,
		type SortCriteria
	} from '$lib';
	import Button from './Button.svelte';
	import InputText from './InputText.svelte';
	import RefreshSVG from './RefreshSVG.svelte';

	interface Props {
		data: Array<Record<string, any>>;
		refresh_data?: () => Promise<void>;
		columns?: Array<string>;
		rows?: number;
	}

	const inputRowsId = alfanumericRandom();
	const pageSizeId = alfanumericRandom();
	const inputPageNumberId = alfanumericRandom();

	let { data, refresh_data, columns, rows = $bindable<number>() }: Props = $props();
	let loading = $state(false);

	interface Cursor {
		pageSize: number;
		page: number;
		lastIndex: number;
	}

	let dataColumns = $derived.by(() => {
		if (columns && columns.length > 0) {
			return columns;
		}
		if (data.length > 0) {
			return Object.keys(data[0]);
		}
		return [];
	});

	let filterCriteria: FilterCriteria = $state({});

	let filteredData: Array<Record<string, any>> = $derived.by(() => {
		return filterByCriteria<Record<string, any>>(data, filterCriteria);
	});

	let sortCriteria: SortCriteria = $state({});

	let sortedData: Array<Record<string, any>> = $derived.by(() => {
		return sortByProperties<Record<string, any>>(filteredData, sortCriteria);
	});

	let cursor: Cursor = $state({
		pageSize: 20,
		page: 1,
		lastIndex: 0
	});

	let pages = $derived.by(() => {
		return Math.ceil(filteredData.length / cursor.pageSize);
	});

	function paginate(data: Array<Record<string, any>>, cursor: Cursor) {
		const startIndex = (cursor.page - 1) * cursor.pageSize;
		const endIndex = startIndex + cursor.pageSize;
		return data.slice(startIndex, endIndex);
	}

	let paginatedData: Array<Record<string, any>> = $derived.by(() => {
		return paginate(sortedData, cursor);
	});

	async function refresh() {
        if (refresh_data != undefined) {
            loading = true;
            await refresh_data();
            loading = false;
        }
	}
</script>

<div class="flex w-full flex-col gap-5 rounded-md border border-gray-300 p-5">
	<div class="h-140 w-full overflow-auto">
		<table class="w-full text-center">
			<thead class="sticky top-0 z-10 bg-white">
				<tr>
					{#each dataColumns as column}
						<th class="px-2 pb-2 font-semibold">
							<div class="flex w-full justify-between gap-5 px-2">
								<span>{StringUtils.capitilize(column, '_')}</span>
								<div class="flex gap-2">
									<button
										aria-label="ascending"
										onclick={() => addSort(sortCriteria, column, SortDirection.ASC)}>
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
									<button
										aria-label="descending"
										onclick={() => addSort(sortCriteria, column, SortDirection.DESC)}>
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
							<InputText
								placeholder="filtro"
								onInput={(v: string) => {
									addFilter(filterCriteria, column, v);
								}}></InputText>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each paginatedData as row, i}
					<tr class="hover:bg-gray-100">
						{#each dataColumns as key}
							<td
								class="max-w-sm overflow-hidden border-gray-300 px-4 py-1 text-justify text-nowrap"
								class:border-t={i > 0}>
								<button
									ondblclick={() => {
										navigator.clipboard.writeText(row[key]);
									}}>{row[key]}</button>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<section class="flex w-full items-center justify-between gap-5 px-4">
		<div class="flex items-center gap-5">
            {#if rows}
            <label for={inputRowsId}>Número de registros</label>
                <input
                    id={inputRowsId}
                    class="w-16 rounded-sm border border-gray-300 px-2 py-1 focus:outline-gray-300"
                    type="number"
                    min="20"
                    max="1000"
                    step="20"
                    bind:value={rows}
                    placeholder={`${rows}`} />
            {/if}
            {#if refresh_data}
                <Button action={refresh} style="bg-teal-700 text-white">
                    <RefreshSVG {loading}></RefreshSVG>
                </Button>
            {/if}
		</div>
		<div class="flex items-center gap-5">
			<label for={pageSizeId}>Tamaño de página</label>
			<input
				id={pageSizeId}
				class="w-16 rounded-sm border border-gray-300 px-2 py-1 focus:outline-gray-300"
				type="number"
				min="20"
				max="1000"
				step="20"
				bind:value={cursor.pageSize}
				placeholder={`${cursor.pageSize}`} />
		</div>
		<div class="flex items-center gap-5">
			<span>{cursor.page} de {pages}</span>
			<Button
				style="bg-teal-700 text-white"
				action={() => {
					if (cursor.page > 1) cursor.page--;
				}}>Anterior</Button>
			<input
				id={inputPageNumberId}
				class="w-12 rounded-sm border border-gray-300 px-2 py-1 focus:outline-gray-300"
				type="number"
				min={1}
				max={pages}
				bind:value={cursor.page}
				placeholder={`${cursor.page}`} />
			<Button
				style="bg-teal-700 text-white"
				action={() => {
					if (cursor.page < pages) cursor.page++;
				}}>Siguiente</Button>
		</div>
	</section>
</div>
