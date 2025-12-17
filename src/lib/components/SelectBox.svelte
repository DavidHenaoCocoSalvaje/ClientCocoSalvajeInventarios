<script lang="ts">
	import { addFilter, alfanumericRandom, filterByCriteria, type FilterCriteria } from '$lib';
	import InputText from './InputText.svelte';

	interface Option {
		value: string;
		label: string;
		selected: boolean;
	}

	interface Props {
		options: Option[];
		todos: boolean;
		onToogle?: () => void;
	}

	let { options, todos, onToogle }: Props = $props();
	let filtredCriteria: FilterCriteria = $state({});
	let checkAll = $state(todos);
	const input_id = alfanumericRandom();

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
		<InputText
			width=""
			placeholder="filtro"
			onInput={(v: string) => addFilter(filtredCriteria, 'label', v)}></InputText>
		<button
			class="intems-center flex w-fit cursor-pointer items-center gap-2"
			type="button"
			onclick={selectALl}>
			<input checked={checkAll} type="checkbox" class="h-4 w-4 rounded border-gray-300" />
			<span class="hover:text-teal-600">Todos</span>
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
				<span class="hover:text-teal-600">{option.label}</span>
			</button>
		{/each}
	</div>
</div>
