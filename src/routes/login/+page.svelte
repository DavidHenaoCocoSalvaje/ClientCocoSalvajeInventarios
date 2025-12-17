<script lang="ts">
	// let { form } = $props();
</script>

<div class="flex h-screen w-screen items-center justify-center bg-neutral-100">
	<form method="POST">
		<div class="flex w-md flex-col gap-2 rounded-xl bg-neutral-50 p-6 text-lg font-semibold">
			<label for="login-username">Usuario</label>
			<input
				class="rounded-md border border-gray-300 px-2 py-1 transition-colors duration-200 hover:border-teal-500 focus:border-teal-500 focus:outline-none"
				type="text"
				id="login-username"
				name="username"
				placeholder="Usuario"
				autocomplete="username"
				required />

			<label for="login-password">Contraseña</label>
			<input
				class="rounded-md border border-gray-300 px-2 py-1 transition-colors duration-200 hover:border-teal-500 focus:border-teal-500 focus:outline-none"
				type="password"
				id="login-password"
				name="password"
				placeholder="Contraseña"
				autocomplete="current-password"
				required />
			<button
				type="submit"
				class="mt-3 w-1/2 self-center rounded-md bg-teal-700 p-2 text-white transition-colors duration-200 hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-gray-400">
				Iniciar sesion
			</button>
		</div>
	</form>
</div>
