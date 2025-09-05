<script lang="ts">
	// let { form } = $props();
</script>

<div class="flex h-screen w-screen items-center justify-center bg-neutral-100">
	<form method="POST">
		<div
			class="flex w-md flex-col gap-2 rounded-xl bg-neutral-50 p-6 text-xl font-semibold"
			id="login-form">
			<label for="username">Usuario</label>
			<input
				class="rounded-md border px-4 py-2"
				type="text"
				name="username"
				placeholder="Usuario"
				autocomplete="username"
				required />

			<label for="password">Contraseña</label>
			<input
				class="rounded-md border px-4 py-2"
				type="password"
				name="password"
				placeholder="Contraseña"
				autocomplete="current-password"
				required />
			<button
				type="submit"
				class="mt-3 w-1/2 self-center rounded-md bg-teal-400 p-2 disabled:cursor-not-allowed disabled:bg-gray-400">
				Iniciar sesion
			</button>
		</div>
	</form>
</div>
