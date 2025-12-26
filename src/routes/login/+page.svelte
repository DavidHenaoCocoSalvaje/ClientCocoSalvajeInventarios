<script lang="ts">
	import InputText from '$lib/components/InputText.svelte';
	import Button from '$lib/components/Button.svelte';
	import Logo from '$lib/components/Logo.svelte';
	// let { form } = $props();
</script>

<div class="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-neutral-100 font-sans">
	<!-- Fondo decorativo con Logo -->
	<div class="absolute -right-20 -bottom-20 z-0 opacity-[0.03] grayscale transition-all duration-700 hover:scale-110">
		<Logo class="h-[600px] w-auto rotate-12" />
	</div>
	<div class="absolute -top-40 -left-40 z-0 opacity-[0.02] grayscale">
		<Logo class="h-[800px] w-auto -rotate-12" />
	</div>

	<form method="POST" class="relative z-10 w-full max-w-md px-4">
		<div class="flex w-md flex-col gap-4 rounded-2xl border border-white/50 bg-white/80 p-8 shadow-2xl">
			<div class="flex flex-col gap-2">
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
			</div>

			<Button
				type="submit"
				style="mt-2 w-full bg-teal-700 text-white shadow-lg transition-all duration-300 hover:bg-teal-800 hover:shadow-teal-700/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-400">
				Iniciar sesión
			</Button>

			<div class="mt-4 text-center">
				<p class="text-xs text-neutral-400">COCO SALVAJE</p>
			</div>
		</div>
	</form>
</div>
