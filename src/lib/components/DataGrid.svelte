<script lang="ts">
	import type { Snippet } from 'svelte';
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
	import Modal from './Modal.svelte';
	import Button from './Button.svelte';
	import InputText from './InputText.svelte';

	interface Props {
		data: Array<Record<string, any>>;
		refresh_data?: () => Promise<void>;
		columns?: Array<string>;
		rows?: number;
		selectable?: boolean;
		selectedItems?: Array<Record<string, any>>;
		actions?: Snippet<[Record<string, any>]>;
		showPagination?: boolean;
		showRowCount?: boolean;
	}

	const inputRowsId = alfanumericRandom();
	const pageSizeId = alfanumericRandom();
	const inputPageNumberId = alfanumericRandom();

	let {
		data,
		refresh_data,
		columns,
		rows = $bindable<number>(),
		selectable = false,
		selectedItems = $bindable<Array<Record<string, any>>>([]),
		actions,
		showPagination = true,
		showRowCount = true
	}: Props = $props();

	let loading = $state(false);
	let showModal = $state(false);
	let modalContent = $state('');

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
		return filterByCriteria<Record<string, any>>({ records: data, filterCriteria });
	});

	let sortCriteria: SortCriteria = $state({});

	let sortedData: Array<Record<string, any>> = $derived.by(() => {
		return sortByProperties<Record<string, any>>({ records: filteredData, sortCriteria });
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

	let allSelected = $derived(
		paginatedData.length > 0 && paginatedData.every((row) => selectedItems.includes(row))
	);

	function toggleSelectAll() {
		if (allSelected) {
			selectedItems = selectedItems.filter((item) => !paginatedData.includes(item));
		} else {
			const newItems = paginatedData.filter((row) => !selectedItems.includes(row));
			selectedItems = [...selectedItems, ...newItems];
		}
	}

	function toggleSelectRow(row: Record<string, any>) {
		if (selectedItems.includes(row)) {
			selectedItems = selectedItems.filter((item) => item !== row);
		} else {
			selectedItems = [...selectedItems, row];
		}
	}

	async function refresh() {
		if (refresh_data != undefined) {
			loading = true;
			await refresh_data();
			loading = false;
		}
	}
</script>

<Modal bind:showModal>
	<p class="text-justify text-gray-600">
		{modalContent}
	</p>
</Modal>

<div class="flex w-full flex-col gap-5 rounded-md border border-gray-300 p-5">
	<div class="h-140 w-full overflow-auto">
		<table class="w-full text-center">
			<thead class="sticky top-0 z-10 bg-white">
				<tr>
					{#if selectable}
						<th class="px-2 pb-2">
							<input
								type="checkbox"
								class="h-4 w-4 cursor-pointer accent-teal-600"
								checked={allSelected}
								onchange={toggleSelectAll}
								aria-label="Seleccionar todos" />
						</th>
					{/if}
					{#each dataColumns as column}
						<th class="px-2 pb-2 font-semibold">
							<div class="flex w-full justify-between gap-5 px-2">
							<span>{StringUtils.capitilize({ str: column, sep: '_' })}</span>
								<div class="flex gap-2">
									<button
										aria-label="ascending"
										onclick={() => addSort({ sortCriteria, key: column, direction: SortDirection.ASC })}>
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
										onclick={() => addSort({ sortCriteria, key: column, direction: SortDirection.DESC })}>
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
					{#if actions}
						<th class="px-2 pb-2 font-semibold">Acciones</th>
					{/if}
				</tr>
				<tr>
					{#if selectable}
						<th class="px-2 pb-5"></th>
					{/if}
					{#each dataColumns as column}
						<th class="content-between px-2 pb-5">
							<InputText
								placeholder="filtro"
								onInput={(v: string) => {
									addFilter({ filterCriteria, key: column, value: v });
								}}></InputText>
						</th>
					{/each}
					{#if actions}
						<th class="px-2 pb-5"></th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each paginatedData as row, i}
					<tr class="hover:bg-gray-100">
						{#if selectable}
							<td class="border-gray-300 px-4 py-1" class:border-t={i > 0}>
								<input
									type="checkbox"
									class="h-4 w-4 cursor-pointer accent-teal-600"
									checked={selectedItems.includes(row)}
									onchange={() => toggleSelectRow(row)}
									aria-label="Seleccionar fila" />
							</td>
						{/if}
						{#each dataColumns as key}
							<td
								class="max-w-sm overflow-hidden border-gray-300 px-4 py-1 text-justify text-nowrap"
								class:border-t={i > 0}>
								<button
									class="w-full text-start"
									ondblclick={() => {
										modalContent = row[key];
										showModal = true;
									}}>{row[key]}</button>
							</td>
						{/each}
						{#if actions}
							<td class="border-gray-300 px-4 py-1 text-center" class:border-t={i > 0}>
								<div class="flex items-center justify-center gap-1">
									{@render actions(row)}
								</div>
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<section class="flex w-full items-center justify-between gap-5 px-4">
		<div class="flex items-center gap-5">
			{#if showRowCount && rows}
				<label for={inputRowsId}>Número de registros</label>
				<input
					id={inputRowsId}
					class="w-24 rounded-sm border border-gray-300 px-2 py-1 focus:outline-gray-300"
					type="number"
					min="20"
					max="1000"
					step="20"
					bind:value={rows}
					placeholder={`${rows}`} />
			{:else if !showRowCount}
				<span class="text-sm text-gray-500">{data.length} registros</span>
			{/if}
			{#if refresh_data}
				<button
					onclick={refresh}
					class="rounded p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-teal-600"
					title="Refrescar">
					<svg
						class="h-5 w-5 {loading ? 'animate-spin' : ''}"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
					</svg>
				</button>
			{/if}
		</div>
		{#if showPagination}
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
		{/if}
	</section>
</div>
