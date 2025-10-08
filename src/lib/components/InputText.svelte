<script lang="ts">
	import { alfanumericRandom } from "$lib";

    
	interface Props {
        label?: string;
        width?: string;
        value?: string;
		placeholder: string;
		onInput: (v: string) => void;
	}
    
    const inputId = alfanumericRandom();
	let { label, placeholder, onInput, width = 'w-full', value=$bindable()}: Props = $props();
</script>

{#if label}
    <label for={inputId}>{label}</label>
{/if}
<input
	id={inputId}
	type="text"
	class="{width} rounded-sm border border-gray-300 px-2 font-normal focus:outline-gray-300"
	bind:value
	{placeholder}
	oninput={onInput.bind(null, value || '')} />
