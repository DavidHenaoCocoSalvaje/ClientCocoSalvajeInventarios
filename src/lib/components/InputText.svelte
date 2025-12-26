<script lang="ts">
	import { alfanumericRandom } from '$lib';

	interface Props {
		label?: string;
		width?: string;
		value?: string;
		placeholder?: string;
		onInput?: (v: string) => void;
		type?: string;
		id?: string;
		name?: string;
		autocomplete?: any;
		required?: boolean;
	}

	let {
		label,
		placeholder,
		onInput,
		width = 'w-full',
		value = $bindable(),
		type = 'text',
		id = alfanumericRandom(),
		name,
		autocomplete,
		required = false
	}: Props = $props();

	let showPassword = $state(false);
	let currentType = $derived(type === 'password' && showPassword ? 'text' : type);
</script>

{#if label}
	<label for={id}>{label}</label>
{/if}
<div class="relative {width}">
	<input
		{id}
		type={currentType}
		{name}
		{autocomplete}
		{required}
		class="w-full rounded-md border border-gray-300 px-2 py-1 font-normal transition-colors duration-200 hover:border-teal-500 focus:border-teal-500 focus:outline-none {type === 'password' ? 'pr-9' : ''}"
		bind:value
		{placeholder}
		oninput={() => onInput?.(value || '')} />

	{#if type === 'password'}
		<button
			type="button"
			class="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition-colors hover:text-teal-600 focus:outline-none"
			onclick={() => (showPassword = !showPassword)}
			aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
			{#if showPassword}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-5">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-5">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
				</svg>
			{/if}
		</button>
	{/if}
</div>
