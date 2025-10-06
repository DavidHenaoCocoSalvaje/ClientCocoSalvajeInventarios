<script lang="ts">
	import { addFilter, filterByCriteria, type FilterCriteria } from '$lib';

	interface Option {
		value: string;
		label: string;
		selected: boolean;
	}

	interface Props {
		options: Option[];
		todos: boolean;
		placeholderFiltro?: string;
		onToogle?: () => void;
	}

	let { options, todos, placeholderFiltro, onToogle }: Props = $props();
	let filtredCriteria: FilterCriteria = $state({});
	let checkAll = $state(todos);

	let filtredOptions = $derived.by(() => {
		return filterByCriteria(options, filtredCriteria);
	});

	function toggle(option: Option) {
		const item = options.find((o) => o.value === option.value);
		if (item) {
			item.selected = !item.selected;
		}
		if (item?.selected === false) {
			checkAll = false;
		}
		if (options.every((o) => o.selected === true)) {
			checkAll = true;
		}
		onToogle?.();
	}

	function isSelected(option: Option) {
		return options.find((item) => item.value === option.value)?.selected || false;
	}

	function selectALl() {
		checkAll = !checkAll;
		filtredOptions.forEach((option) => {
			option.selected = checkAll;
		});
		onToogle?.();
	}
</script>

<div
	class="box-border flex w-full flex-col items-center gap-2 rounded-md border border-gray-300 p-5">
	<div class="flex w-full items-center gap-5">
		<input
			id="filtro-select-box"
			type="text"
			class="rounded-md border border-gray-300 px-2"
			oninput={(e) => addFilter(filtredCriteria, 'label', (e.target as HTMLInputElement).value)}
			placeholder={placeholderFiltro || 'filtro'} />
		<button
			class="intems-center flex w-fit cursor-pointer items-center gap-2"
			type="button"
			onclick={selectALl}>
			<input checked={checkAll} type="checkbox" class="h-4 w-4 rounded border-gray-300" />
			<span class="hover:text-indigo-600">Todos</span>
		</button>
	</div>
	<div class="flex w-full flex-wrap gap-5">
		{#each filtredOptions as option}
			<button
				class="intems-center flex w-fit cursor-pointer items-center gap-2"
				type="button"
				onclick={() => toggle(option)}>
				<input
					type="checkbox"
					class="h-4 w-4 rounded border-gray-300"
					checked={isSelected(option)}
					tabindex="-1" />
				<span class="hover:text-indigo-600">{option.label}</span>
			</button>
		{/each}
	</div>
</div>
