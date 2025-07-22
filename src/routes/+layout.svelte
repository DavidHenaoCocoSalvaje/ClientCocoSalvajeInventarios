<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { userStore, setUser, clearUser } from '$lib/stores/userStore'; // Importa el store y sus funciones

	let { children } = $props();

	let errorMessage: string | null = $state<string | null>(null);

	// Sincroniza el userStore con el $page.data.user cuando cambie (ej. al cargar la página o navegar)
	$effect(() => {
		if (page.data?.user) {
			setUser(page.data.user);
		} else {
			clearUser();
		}
	});

	const login = async (event: SubmitEvent) => {
		event.preventDefault();
		errorMessage = null;

		const form = event.target as HTMLFormElement;
		const formData = new URLSearchParams();

		const username = (form.elements.namedItem('username') as HTMLInputElement).value;
		const password = (form.elements.namedItem('password') as HTMLInputElement).value;

		if (!username || !password) {
			errorMessage = 'Por favor, introduce usuario y contraseña.';
			return;
		}

		formData.append('grant_type', 'password');
		formData.append('username', username);
		formData.append('password', password);
		formData.append('scope', '');
		formData.append('client_id', '');	
		formData.append('client_secret', '');

		try {
			const res = await fetch('http://localhost:8000/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: formData
			});

			if (!res.ok) {
				const errorData = await res.json().catch(() => ({}));
				errorMessage = errorData.detail || `Error al iniciar sesión: ${res.statusText}`;
				console.error('Error en login:', res.status, errorData);
				return;
			}

			const data = await res.json();
			console.log('Login exitoso:', data);

			// **Si tu backend devuelve información del usuario en el cuerpo de la respuesta**
			// podrías actualizar el store directamente aquí, por ejemplo:
			// setUser({ id: data.user_id, username: data.username });
			// Sin embargo, si confías en la cookie HttpOnly y hooks.server.ts,
			// el `goto('/')` ya se encargará de esto al recargar la página.

			// Redirige para que SvelteKit re-evalúe hooks.server.ts y actualice el estado del usuario
			goto('/');
		} catch (err) {
			errorMessage = 'Error de red o servidor no disponible. Inténtalo de nuevo.';
			console.error('Error en login:', err);
		}
	};

	// Puedes usar $userStore para controlar la visibilidad o mostrar información del usuario
</script>

{#if !$userStore}
	<div class="flex w-screen h-screen items-center justify-center bg-neutral-100">
		<form class="block" onsubmit={login}>
			<div
				class="flex flex-col p-6 gap-2 bg-neutral-50 w-md rounded-xl font-semibold text-xl"
				id="login-form">
				<label for="username">Usuario</label>
				<input
					class="border rounded-md py-2 px-4"
					type="text"
					name="username"
					placeholder="Usuario"
					autocomplete="username"
					required />
				<label for="password">Contraseña</label>
				<input
					class="border rounded-md py-2 px-4"
					type="password"
					name="password"
					placeholder="Contraseña"
					autocomplete="current-password"
					required />
				<button type="submit" class="bg-teal-400 p-2 w-1/2 rounded-md self-center mt-3">
					Iniciar sesión
				</button>
				{#if errorMessage}
					<p class="text-red-500 text-center mt-2">{errorMessage}</p>
				{/if}
			</div>
		</form>
	</div>
{:else}
	<div class="flex w-screen h-screen items-center justify-center bg-neutral-100">
		<!-- Aquí se renderizará el contenido de la página -->
		{@render children()}
	</div>
{/if}
