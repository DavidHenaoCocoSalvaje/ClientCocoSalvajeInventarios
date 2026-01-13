<script lang="ts">
	import Section from '$lib/components/MainSection.svelte';
	import Title from '$lib/components/Title.svelte';
	import Button from '$lib/components/Button.svelte';
	import InputText from '$lib/components/InputText.svelte';
	import { User, type IUser } from '$lib/models/user.js';

	let { data } = $props();

	let currentUser: IUser | null = $state(null);
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);
	let message = $state('');
	let isError = $state(false);

	async function loadUser() {
		const response = await User.getMe({
			url: data.backendUrlCsr,
			accessToken: data.access_token
		});
		if (response.ok) {
			currentUser = response.data || null;
		}
	}

	async function changePassword() {
		message = '';
		isError = false;

		if (!currentPassword || !newPassword || !confirmPassword) {
			message = 'Todos los campos son requeridos';
			isError = true;
			return;
		}

		if (newPassword !== confirmPassword) {
			message = 'Las contraseñas no coinciden';
			isError = true;
			return;
		}

		if (newPassword.length < 8) {
			message = 'La contraseña debe tener al menos 8 caracteres';
			isError = true;
			return;
		}

		loading = true;
		try {
			const response = await User.updatePassword({
				url: data.backendUrlCsr,
				accessToken: data.access_token,
				currentPassword,
				newPassword
			});

			if (response.ok && response.data?.id) {
				message = 'Contraseña actualizada correctamente';
				isError = false;
				currentPassword = '';
				newPassword = '';
				confirmPassword = '';
			} else {
				message = response.error || 'Error al actualizar la contraseña';
				isError = true;
			}
		} catch {
			message = 'Error al actualizar la contraseña';
			isError = true;
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		loadUser();
	});
</script>

<Section>
	<Title>Perfil de Usuario</Title>
</Section>

<div class="flex w-full justify-center px-4">
	<div class="w-full max-w-md space-y-6">
		{#if currentUser}
			<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-gray-700">Información</h2>
				<div class="space-y-2">
					<p class="text-gray-600">
						<span class="font-medium">Usuario:</span>
						{currentUser.username}
					</p>
					<p class="text-gray-600">
						<span class="font-medium">Estado:</span>
						<span class={currentUser.is_active ? 'text-green-600' : 'text-red-600'}>
							{currentUser.is_active ? 'Activo' : 'Inactivo'}
						</span>
					</p>
				</div>
			</div>

			<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-gray-700">Cambiar Contraseña</h2>
				<form class="space-y-4" onsubmit={(e) => { e.preventDefault(); changePassword(); }}>
					<div>
						<label for="current" class="mb-1 block text-sm text-gray-600">Contraseña actual</label>
						<InputText
							id="current"
							type="password"
							bind:value={currentPassword}
							placeholder="Contraseña actual"
							width="w-full" />
					</div>
					<div>
						<label for="new" class="mb-1 block text-sm text-gray-600">Nueva contraseña</label>
						<InputText
							id="new"
							type="password"
							bind:value={newPassword}
							placeholder="Nueva contraseña"
							width="w-full" />
					</div>
					<div>
						<label for="confirm" class="mb-1 block text-sm text-gray-600">Confirmar contraseña</label>
						<InputText
							id="confirm"
							type="password"
							bind:value={confirmPassword}
							placeholder="Confirmar contraseña"
							width="w-full" />
					</div>

					{#if message}
						<p class={isError ? 'text-sm text-red-600' : 'text-sm text-green-600'}>
							{message}
						</p>
					{/if}

					<Button
						action={changePassword}
						style="w-full bg-teal-700 text-white hover:bg-teal-800 {loading ? 'opacity-50 cursor-not-allowed' : ''}">
						{loading ? 'Actualizando...' : 'Cambiar Contraseña'}
					</Button>
				</form>
			</div>
		{:else}
			<div class="text-center text-gray-500">Cargando información del usuario...</div>
		{/if}
	</div>
</div>
