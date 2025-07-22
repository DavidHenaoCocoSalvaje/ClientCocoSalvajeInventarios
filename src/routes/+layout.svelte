<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="flex w-screen h-screen items-center justify-center bg-neutral-100">
	<form class="block" method="POST" action="/login">
		<div
			class="flex flex-col p-6 gap-2 bg-neutral-50 w-md rounded-xl font-semibold text-xl"
			id="login-form">
			<label for="username">Usuario</label>
			<input
				class="border rounded-md py-2 px-4"
				type="text"
				name="username"
				placeholder="Usuario"
				autocomplete="username" />
			<label for="password">Contraseña</label>
			<input
				class="border rounded-md py-2 px-4"
				type="password"
				name="password"
				placeholder="Contraseña"
				autocomplete="current-password" />
			<button class="bg-teal-400 p-2 w-1/2 rounded-md self-center mt-3"> Iniciar sesión </button>
		</div>
	</form>
</div>

{@render children()}
