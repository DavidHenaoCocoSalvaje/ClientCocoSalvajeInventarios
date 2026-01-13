<script lang="ts">
	import { CSRequest, formatDate } from '$lib';
	import Section from '$lib/components/MainSection.svelte';
	import Title from '$lib/components/Title.svelte';
	import Button from '$lib/components/Button.svelte';
	import InputText from '$lib/components/InputText.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { User, type IUser } from '$lib/models/user.js';

	let { data } = $props();

	let currentUser: IUser | null = $state(null);
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);
	let message = $state('');
	let isError = $state(false);

	// API Key state
	interface IApiKey {
		id: number;
		created_at: string;
		is_active: boolean;
	}
	interface IApiKeyCreated extends IApiKey {
		key: string;
	}
	let apiKey: IApiKey | null = $state(null);
	let apiKeyLoading = $state(false);
	let apiKeyMessage = $state('');
	let apiKeyIsError = $state(false);
	let showNewKeyModal = $state(false);
	let newKeyValue = $state('');
	let showConfirmDeleteModal = $state(false);

	async function loadUser() {
		const response = await User.getMe({
			url: data.backendUrlCsr,
			accessToken: data.access_token
		});
		if (response.ok) {
			currentUser = response.data || null;
		}
	}

	async function loadApiKey() {
		apiKeyLoading = true;
		apiKeyMessage = '';
		const request = new CSRequest(data.backendUrlCsr);
		const response = await request.get<IApiKey[]>({
			primaryRoute: '/api-keys',
			path: '/',
			accessToken: data.access_token
		});
		if (response.ok && response.data) {
			apiKey = response.data.length > 0 ? response.data[0] : null;
		} else {
			// Si es 401/403 es que no tiene permisos, no mostrar error
			if (response.status !== 401 && response.status !== 403) {
				apiKeyMessage = response.error || 'Error al cargar API key';
				apiKeyIsError = true;
			}
		}
		apiKeyLoading = false;
	}

	async function createApiKey() {
		apiKeyLoading = true;
		apiKeyMessage = '';
		const request = new CSRequest(data.backendUrlCsr);
		const response = await request.post<IApiKeyCreated>({
			primaryRoute: '/api-keys',
			path: '/',
			accessToken: data.access_token
		});
		if (response.ok && response.data) {
			newKeyValue = response.data.key;
			showNewKeyModal = true;
			await loadApiKey();
		} else {
			apiKeyMessage = response.error || 'Error al crear API key';
			apiKeyIsError = true;
		}
		apiKeyLoading = false;
	}

	async function inactivateApiKey() {
		if (!apiKey) return;
		apiKeyLoading = true;
		apiKeyMessage = '';
		const request = new CSRequest(data.backendUrlCsr);
		const response = await request.patch<IApiKey>({
			primaryRoute: '/api-keys',
			path: `/inactivate/${apiKey.id}`,
			accessToken: data.access_token
		});
		if (response.ok) {
			apiKeyMessage = 'API key inactivada correctamente';
			apiKeyIsError = false;
			await loadApiKey();
		} else {
			apiKeyMessage = response.error || 'Error al inactivar API key';
			apiKeyIsError = true;
		}
		apiKeyLoading = false;
	}

	async function deleteApiKey() {
		if (!apiKey) return;
		showConfirmDeleteModal = false;
		apiKeyLoading = true;
		apiKeyMessage = '';
		const request = new CSRequest(data.backendUrlCsr);
		const response = await request.delete<void>({
			primaryRoute: '/api-keys',
			path: `/${apiKey.id}`,
			accessToken: data.access_token
		});
		if (response.ok || response.status === 204) {
			apiKeyMessage = 'API key eliminada correctamente';
			apiKeyIsError = false;
			apiKey = null;
		} else {
			apiKeyMessage = response.error || 'Error al eliminar API key';
			apiKeyIsError = true;
		}
		apiKeyLoading = false;
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
		loadApiKey();
	});
</script>

<!-- Modal para mostrar nueva API key -->
<Modal bind:showModal={showNewKeyModal}>
	<div class="flex min-w-80 flex-col gap-4 p-2">
		<h3 class="text-lg font-semibold text-gray-700">API Key Creada</h3>
		<p class="text-sm text-gray-600">Guarda esta clave, no podrás verla nuevamente:</p>
		<div class="rounded bg-gray-100 p-3 font-mono text-sm break-all select-all">{newKeyValue}</div>
		<p class="text-xs text-amber-600">⚠️ Esta clave solo se muestra una vez. Cópiala ahora.</p>
	</div>
</Modal>

<!-- Modal de confirmación para eliminar -->
<Modal bind:showModal={showConfirmDeleteModal}>
	<div class="flex min-w-64 flex-col gap-4 p-2">
		<h3 class="text-lg font-semibold text-red-600">Eliminar API Key</h3>
		<p class="text-gray-600">¿Estás seguro de que deseas eliminar esta API key? Esta acción no se puede deshacer.</p>
		<div class="flex justify-end gap-2">
			<Button action={() => (showConfirmDeleteModal = false)} style="bg-gray-300 text-gray-700">Cancelar</Button>
			<Button action={deleteApiKey} style="bg-red-600 text-white">Eliminar</Button>
		</div>
	</div>
</Modal>

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

			<!-- Sección API Key -->
			<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-semibold text-gray-700">API Key</h2>
				{#if apiKeyLoading}
					<p class="text-sm text-gray-500">Cargando...</p>
				{:else if apiKey}
					<div class="space-y-3">
						<div class="space-y-1">
							<p class="text-gray-600">
								<span class="font-medium">Estado:</span>
								<span class={apiKey.is_active ? 'text-green-600' : 'text-red-600'}>
									{apiKey.is_active ? 'Activa' : 'Inactiva'}
								</span>
							</p>
							<p class="text-gray-600 text-sm">
								<span class="font-medium">Creada:</span>
								{formatDate({ date: apiKey.created_at, hora: true })}
							</p>
						</div>
						<div class="flex gap-2">
							{#if apiKey.is_active}
								<Button 
									action={inactivateApiKey} 
									style="bg-amber-600 text-white text-sm">
									Inactivar
								</Button>
							{/if}
							<Button 
								action={() => (showConfirmDeleteModal = true)} 
								style="bg-red-600 text-white text-sm">
								Eliminar
							</Button>
						</div>
					</div>
				{:else}
					<div class="space-y-3">
						<p class="text-sm text-gray-500">No tienes una API key.</p>
						<Button action={createApiKey} style="bg-teal-700 text-white">
							Crear API Key
						</Button>
					</div>
				{/if}
				{#if apiKeyMessage}
					<p class="mt-3 text-sm {apiKeyIsError ? 'text-red-600' : 'text-green-600'}">
						{apiKeyMessage}
					</p>
				{/if}
			</div>
		{:else}
			<div class="text-center text-gray-500">Cargando información del usuario...</div>
		{/if}
	</div>
</div>

