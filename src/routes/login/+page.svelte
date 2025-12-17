<script lang="ts">
	import InputText from '$lib/components/InputText.svelte';
	import Button from '$lib/components/Button.svelte';
	// let { form } = $props();
</script>

<div class="flex h-screen w-screen items-center justify-center bg-neutral-100">
	<form method="POST">
		<div class="flex w-md flex-col gap-2 rounded-xl bg-neutral-50 p-6 text-lg font-semibold">
			<InputText
				label="Usuario"
				type="text"
				id="login-username"
				name="username"
				placeholder="Usuario"
				autocomplete="username"
				required />

			<InputText
				label="Contraseña"
				type="password"
				id="login-password"
				name="password"
				placeholder="Contraseña"
				autocomplete="current-password"
				required />

			<Button
				type="submit"
				style="mt-3 w-1/2 self-center bg-teal-700 text-white transition-colors duration-200 hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-gray-400">
				Iniciar sesion
			</Button>
		</div>
	</form>
</div>
