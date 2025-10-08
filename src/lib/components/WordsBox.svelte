<script lang="ts">
	import InputText from './InputText.svelte';

	let { words, filterWord = $bindable() }: { words: Array<string>; filterWord: string } = $props();

	let filtredWords = $state(filtrarPalabras(words, ''));

	function filtrarPalabras(words: Array<string>, filtro: string) {
		if (!filtro) return words;
		return words.filter((word) => word.toLowerCase().includes(filtro.toLowerCase()));
	}
</script>

<div
	class="box-border flex w-full flex-col items-center gap-2 rounded-md border border-gray-300 p-5">
	<div class="flex w-full flex-wrap gap-5">
		<InputText
			bind:value={filterWord}
			width="w-40"
			placeholder="filtro"
			onInput={(v: string) => {
				filtredWords = filtrarPalabras(words, v);
			}}></InputText>
		{#each filtredWords as word}
			<span>{word}</span>
		{/each}
	</div>
</div>
