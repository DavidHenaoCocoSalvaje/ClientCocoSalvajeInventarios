<script lang="ts">
	import { SortDirection, getMessageType, type MessageType } from '$lib';
	import { goto } from '$app/navigation';
	import Section from '$lib/components/MainSection.svelte';
	import Title from '$lib/components/Title.svelte';
	import Button from '$lib/components/Button.svelte';
	import DataGrid from '$lib/components/DataGrid.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import InputText from '$lib/components/InputText.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import Message from '$lib/components/Message.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import ShieldIcon from '$lib/components/svg/ShieldIcon.svelte';
	import RefreshIcon from '$lib/components/svg/RefreshIcon.svelte';
	import TrashIcon from '$lib/components/svg/TrashIcon.svelte';
	import { User, UserFormat, type IUser } from '$lib/models/user.js';

	let { data } = $props();

	let users: IUser[] = $state([]);
	let formattedUsers = $derived(UserFormat.users(users));
	let rows = $state(100);
	let columns = ['id', 'username', 'is_active', 'created_at'];

	let showCreateModal = $state(false);
	let showMessageModal = $state(false);
	let showConfirmResetModal = $state(false);
	let showConfirmDeleteModal = $state(false);

	let messageModalContent = $state('');
	let messageModalTitle = $state('');
	let isMessageError = $state(false);

	let newUsername = $state('');
	let selectedUser: IUser | null = $state(null);
	let loading = $state(true);
	let error = $state('');
	let errorType: MessageType = $state('error');

	function showMessage(title: string, content: string, isError = false) {
		messageModalTitle = title;
		messageModalContent = content;
		isMessageError = isError;
		showMessageModal = true;
	}

	async function loadUsers() {
		loading = true;
		error = '';
		const response = await User.getList({
			url: data.backendUrlCsr,
			accessToken: data.access_token,
			skip: 0,
			limit: rows,
			sort: SortDirection.DESC
		});
		if (response.ok) {
			users = response.data || [];
		} else {
			error = response.error || 'Error desconocido';
			errorType = getMessageType(response.status);
		}
		loading = false;
	}

	async function createUser() {
		if (!newUsername.trim()) {
			showMessage('Error', 'El nombre de usuario es requerido', true);
			return;
		}
		const response = await User.create({
			url: data.backendUrlCsr,
			accessToken: data.access_token,
			username: newUsername.trim()
		});
		if (response.ok && response.data?.user) {
			showCreateModal = false;
			newUsername = '';
			showMessage('Usuario Creado', `Contraseña temporal: ${response.data.temp_password}`);
			await loadUsers();
		} else {
			showMessage('Error', response.error || 'Error al crear usuario', true);
		}
	}

	function confirmDeleteUser(user: Record<string, any>) {
		selectedUser = user as IUser;
		showConfirmDeleteModal = true;
	}

	async function executeDeleteUser() {
		if (!selectedUser) return;
		showConfirmDeleteModal = false;
		const response = await User.delete({
			url: data.backendUrlCsr,
			accessToken: data.access_token,
			userId: selectedUser.id
		});
		if (response.ok) {
			showMessage('Éxito', 'Usuario eliminado correctamente');
			await loadUsers();
		} else {
			showMessage('Error', response.error || 'Error al eliminar usuario', true);
		}
		selectedUser = null;
	}

	function confirmResetPassword(user: Record<string, any>) {
		selectedUser = user as IUser;
		showConfirmResetModal = true;
	}

	async function executeResetPassword() {
		if (!selectedUser) return;
		showConfirmResetModal = false;
		const response = await User.resetPassword({
			url: data.backendUrlCsr,
			accessToken: data.access_token,
			userId: selectedUser.id
		});
		if (response.ok && response.data?.new_password) {
			showMessage('Contraseña Restablecida', `Nueva contraseña: ${response.data.new_password}`);
		} else {
			showMessage('Error', response.error || 'Error al restablecer contraseña', true);
		}
		selectedUser = null;
	}

	function goToPermissions(user: Record<string, any>) {
		goto(`/permisos?user_id=${user.id}`);
	}

	$effect(() => {
		loadUsers();
	});
</script>

<!-- Modal de mensaje -->
<Modal bind:showModal={showMessageModal}>
	<div class="flex min-w-64 flex-col gap-4 p-2">
		<h3 class="text-lg font-semibold" class:text-red-600={isMessageError}>{messageModalTitle}</h3>
		<p class="text-gray-600">{messageModalContent}</p>
	</div>
</Modal>

<!-- Modal de confirmación para restablecer contraseña -->
<Modal bind:showModal={showConfirmResetModal}>
	<div class="flex flex-col gap-4 p-2">
		<h3 class="text-lg font-semibold">Confirmar Restablecimiento</h3>
		<p class="text-gray-600">¿Desea restablecer la contraseña de "{selectedUser?.username}"?</p>
		<div class="flex justify-end gap-2">
			<Button action={() => (showConfirmResetModal = false)} style="bg-gray-300 text-gray-700"
				>Cancelar</Button>
			<Button action={executeResetPassword} style="bg-yellow-500 text-white hover:bg-yellow-600"
				>Restablecer</Button>
		</div>
	</div>
</Modal>

<!-- Modal de confirmación para eliminar -->
<Modal bind:showModal={showConfirmDeleteModal}>
	<div class="flex flex-col gap-4 p-2">
		<h3 class="text-lg font-semibold text-red-600">Confirmar Eliminación</h3>
		<p class="text-gray-600">¿Está seguro de eliminar al usuario "{selectedUser?.username}"?</p>
		<div class="flex justify-end gap-2">
			<Button action={() => (showConfirmDeleteModal = false)} style="bg-gray-300 text-gray-700"
				>Cancelar</Button>
			<Button action={executeDeleteUser} style="bg-red-500 text-white hover:bg-red-600"
				>Eliminar</Button>
		</div>
	</div>
</Modal>

<Modal bind:showModal={showCreateModal}>
	<div class="flex flex-col gap-4 p-2">
		<h3 class="text-lg font-semibold">Crear Usuario</h3>
		<InputText bind:value={newUsername} placeholder="Nombre de usuario" />
		<div class="flex justify-end gap-2">
			<Button action={() => (showCreateModal = false)} style="bg-gray-300 text-gray-700"
				>Cancelar</Button>
			<Button action={createUser} style="bg-teal-700 text-white">Crear</Button>
		</div>
	</div>
</Modal>

<Section className="px-10 py-5 gap-5">
	<Title>Administración de Usuarios</Title>
	<div class="flex w-full justify-start">
		<Button action={() => (showCreateModal = true)} style="bg-teal-700 text-white"
			>Crear Usuario</Button>
	</div>
	{#if loading}
		<Loader message="Cargando usuarios..." />
	{:else if error}
		<Message title={errorType === 'info' ? 'Información' : 'Error'} message={error} type={errorType} />
	{:else}
		<DataGrid data={formattedUsers} {columns} refresh_data={loadUsers} showPagination={false} showRowCount={false}>
			{#snippet actions(row)}
				<Tooltip text="Gestionar permisos">
					<button
						onclick={() => goToPermissions(row)}
						class="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-teal-600">
						<ShieldIcon class="h-4 w-4" />
					</button>
				</Tooltip>
				<Tooltip text="Restablecer contraseña">
					<button
						onclick={() => confirmResetPassword(row)}
						class="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-yellow-600">
						<RefreshIcon class="h-4 w-4" />
					</button>
				</Tooltip>
				<Tooltip text="Eliminar">
					<button
						onclick={() => confirmDeleteUser(row)}
						class="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-red-600">
						<TrashIcon class="h-4 w-4" />
					</button>
				</Tooltip>
			{/snippet}
		</DataGrid>
	{/if}
</Section>