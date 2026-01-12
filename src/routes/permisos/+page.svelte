<script lang="ts">
	import { page } from '$app/state';
	import { SortDirection } from '$lib';
	import Section from '$lib/components/MainSection.svelte';
	import Title from '$lib/components/Title.svelte';
	import Subtitle from '$lib/components/Subtitle.svelte';
	import DataGrid from '$lib/components/DataGrid.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Button from '$lib/components/Button.svelte';
	import Select from '$lib/components/Select.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import TrashIcon from '$lib/components/svg/TrashIcon.svelte';
	import PlusIcon from '$lib/components/svg/PlusIcon.svelte';
	import {
		User,
		UserPermissions,
		Permission,
		Role,
		Group,
		type IUser,
		type IPermission,
		type IRole,
		type IGroup
	} from '$lib/models/user.js';

	let { data } = $props();

	// Estado para el usuario seleccionado
	let users: IUser[] = $state([]);
	let selectedUserId: number = $state(0);
	let userOptions = $derived(users.map((u) => ({ value: u.id, text: u.username })));

	// Datos de permisos
	let directPermissions: IPermission[] = $state([]);
	let userRoles: IRole[] = $state([]);
	let userGroups: IGroup[] = $state([]);

	// Datos disponibles para asignar
	let allPermissions: IPermission[] = $state([]);
	let allRoles: IRole[] = $state([]);
	let allGroups: IGroup[] = $state([]);

	// Estados de carga
	let loadingUsers = $state(true);
	let loadingPermissions = $state(false);

	// Modales
	let showAssignPermissionModal = $state(false);
	let showAssignRoleModal = $state(false);
	let showAssignGroupModal = $state(false);
	let showMessageModal = $state(false);

	let messageModalTitle = $state('');
	let messageModalContent = $state('');
	let isMessageError = $state(false);

	let selectedPermissionId: number = $state(0);
	let selectedRoleId: number = $state(0);
	let selectedGroupId: number = $state(0);

	function showMessage(title: string, content: string, isError = false) {
		messageModalTitle = title;
		messageModalContent = content;
		isMessageError = isError;
		showMessageModal = true;
	}

	function getUserIdFromToken(): number {
		try {
			const token = data.access_token;
			if (!token) return 0;
			const payload = JSON.parse(atob(token.split('.')[1]));
			return parseInt(payload.sub) || 0;
		} catch {
			return 0;
		}
	}

	async function loadUsers() {
		loadingUsers = true;
		users = await User.getList({
			url: data.backendUrlCsr,
			accessToken: data.access_token,
			skip: 0,
			limit: 1000,
			sort: SortDirection.ASC
		});

		const urlUserId = parseInt(page.url.searchParams.get('user_id') || '0');
		if (urlUserId && users.some((u) => u.id === urlUserId)) {
			selectedUserId = urlUserId;
		} else {
			const tokenUserId = getUserIdFromToken();
			if (tokenUserId && users.some((u) => u.id === tokenUserId)) {
				selectedUserId = tokenUserId;
			} else if (users.length > 0) {
				selectedUserId = users[0].id;
			}
		}

		loadingUsers = false;
	}

	async function loadUserPermissions() {
		if (!selectedUserId) return;
		loadingPermissions = true;

		const [permissions, roles, groups] = await Promise.all([
			UserPermissions.getDirect({
				url: data.backendUrlCsr,
				accessToken: data.access_token,
				userId: selectedUserId
			}),
			UserPermissions.getRoles({
				url: data.backendUrlCsr,
				accessToken: data.access_token,
				userId: selectedUserId
			}),
			UserPermissions.getGroups({
				url: data.backendUrlCsr,
				accessToken: data.access_token,
				userId: selectedUserId
			})
		]);

		directPermissions = permissions || [];
		userRoles = roles || [];
		userGroups = groups || [];
		loadingPermissions = false;
	}

	async function openAssignPermissionModal() {
		allPermissions = await Permission.getAll({
			url: data.backendUrlCsr,
			accessToken: data.access_token
		});
		selectedPermissionId = allPermissions[0]?.id || 0;
		showAssignPermissionModal = true;
	}

	async function openAssignRoleModal() {
		allRoles = await Role.getAll({
			url: data.backendUrlCsr,
			accessToken: data.access_token
		});
		selectedRoleId = allRoles[0]?.id || 0;
		showAssignRoleModal = true;
	}

	async function openAssignGroupModal() {
		allGroups = await Group.getAll({
			url: data.backendUrlCsr,
			accessToken: data.access_token
		});
		selectedGroupId = allGroups[0]?.id || 0;
		showAssignGroupModal = true;
	}

	async function assignPermission() {
		if (!selectedUserId || !selectedPermissionId) return;
		const response = await UserPermissions.assign({
			url: data.backendUrlCsr,
			accessToken: data.access_token,
			userId: selectedUserId,
			permissionId: selectedPermissionId
		});
		showAssignPermissionModal = false;
		if (response) {
			showMessage('Éxito', 'Permiso asignado correctamente');
			await loadUserPermissions();
		} else {
			showMessage('Error', 'Error al asignar permiso', true);
		}
	}

	async function assignRole() {
		if (!selectedUserId || !selectedRoleId) return;
		const response = await UserPermissions.assignRole({
			url: data.backendUrlCsr,
			accessToken: data.access_token,
			userId: selectedUserId,
			roleId: selectedRoleId
		});
		showAssignRoleModal = false;
		if (response) {
			showMessage('Éxito', 'Rol asignado correctamente');
			await loadUserPermissions();
		} else {
			showMessage('Error', 'Error al asignar rol', true);
		}
	}

	async function assignGroup() {
		if (!selectedUserId || !selectedGroupId) return;
		const response = await UserPermissions.assignGroup({
			url: data.backendUrlCsr,
			accessToken: data.access_token,
			userId: selectedUserId,
			groupId: selectedGroupId
		});
		showAssignGroupModal = false;
		if (response) {
			showMessage('Éxito', 'Grupo asignado correctamente');
			await loadUserPermissions();
		} else {
			showMessage('Error', 'Error al asignar grupo', true);
		}
	}

	async function unassignPermission(row: Record<string, any>) {
		await UserPermissions.unassign({
			url: data.backendUrlCsr,
			accessToken: data.access_token,
			userId: selectedUserId,
			permissionId: row.id
		});
		showMessage('Éxito', 'Permiso desasignado');
		await loadUserPermissions();
	}

	async function unassignRole(row: Record<string, any>) {
		await UserPermissions.unassignRole({
			url: data.backendUrlCsr,
			accessToken: data.access_token,
			userId: selectedUserId,
			roleId: row.id
		});
		showMessage('Éxito', 'Rol desasignado');
		await loadUserPermissions();
	}

	async function unassignGroup(row: Record<string, any>) {
		await UserPermissions.unassignGroup({
			url: data.backendUrlCsr,
			accessToken: data.access_token,
			userId: selectedUserId,
			groupId: row.id
		});
		showMessage('Éxito', 'Grupo desasignado');
		await loadUserPermissions();
	}

	$effect(() => {
		loadUsers();
	});

	$effect(() => {
		if (selectedUserId) {
			loadUserPermissions();
		}
	});
</script>

<!-- Modal de mensaje -->
<Modal bind:showModal={showMessageModal}>
	<div class="flex min-w-64 flex-col gap-4 p-2">
		<h3 class="text-lg font-semibold" class:text-red-600={isMessageError}>{messageModalTitle}</h3>
		<p class="text-gray-600">{messageModalContent}</p>
	</div>
</Modal>

<!-- Modal asignar permiso -->
<Modal bind:showModal={showAssignPermissionModal}>
	<div class="flex min-w-80 flex-col gap-4 p-2">
		<h3 class="text-lg font-semibold">Asignar Permiso</h3>
		<Select
			bind:value={selectedPermissionId}
			options={allPermissions.map((p) => ({ value: p.id, text: p.slug }))} />
		<div class="flex justify-end gap-2">
			<Button action={() => (showAssignPermissionModal = false)} style="bg-gray-300 text-gray-700"
				>Cancelar</Button>
			<Button action={assignPermission} style="bg-teal-700 text-white">Asignar</Button>
		</div>
	</div>
</Modal>

<!-- Modal asignar rol -->
<Modal bind:showModal={showAssignRoleModal}>
	<div class="flex min-w-80 flex-col gap-4 p-2">
		<h3 class="text-lg font-semibold">Asignar Rol</h3>
		<Select
			bind:value={selectedRoleId}
			options={allRoles.map((r) => ({ value: r.id, text: r.name }))} />
		<div class="flex justify-end gap-2">
			<Button action={() => (showAssignRoleModal = false)} style="bg-gray-300 text-gray-700"
				>Cancelar</Button>
			<Button action={assignRole} style="bg-teal-700 text-white">Asignar</Button>
		</div>
	</div>
</Modal>

<!-- Modal asignar grupo -->
<Modal bind:showModal={showAssignGroupModal}>
	<div class="flex min-w-80 flex-col gap-4 p-2">
		<h3 class="text-lg font-semibold">Asignar Grupo</h3>
		<Select
			bind:value={selectedGroupId}
			options={allGroups.map((g) => ({ value: g.id, text: g.name }))} />
		<div class="flex justify-end gap-2">
			<Button action={() => (showAssignGroupModal = false)} style="bg-gray-300 text-gray-700"
				>Cancelar</Button>
			<Button action={assignGroup} style="bg-teal-700 text-white">Asignar</Button>
		</div>
	</div>
</Modal>

<Section className="px-10 py-5 gap-5">
	<Title>Gestión de Permisos</Title>
	{#if loadingUsers}
		<Loader message="Cargando usuarios..." />
	{:else}
		<!-- Selector de usuario fijo -->
		<div class="flex w-full items-center gap-4">
			<span class="font-medium text-gray-700">Usuario:</span>
			<Select bind:value={selectedUserId} options={userOptions} width="w-64" />
		</div>
	{/if}
	{#if loadingPermissions}
		<Loader message="Cargando permisos..." />
	{:else if selectedUserId}
		<!-- Permisos Directos -->
		<Subtitle>Permisos Directos</Subtitle>
		<DataGrid
			data={directPermissions}
			columns={['id', 'slug', 'access_mode', 'resource']}
			refresh_data={loadUserPermissions}
			showPagination={false}
			showRowCount={false}>
			{#snippet actions(row)}
				<Tooltip text="Asignar permiso">
					<button
						onclick={openAssignPermissionModal}
						class="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-green-600">
						<PlusIcon class="h-4 w-4" />
					</button>
				</Tooltip>
				<Tooltip text="Desasignar">
					<button
						onclick={() => unassignPermission(row)}
						class="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-red-600">
						<TrashIcon class="h-4 w-4" />
					</button>
				</Tooltip>
			{/snippet}
		</DataGrid>
	
		<!-- Roles -->
		<Subtitle>Roles</Subtitle>
		<DataGrid
			data={userRoles}
			columns={['id', 'name', 'description']}
			refresh_data={loadUserPermissions}
			showPagination={false}
			showRowCount={false}>
			{#snippet actions(row)}
				<Tooltip text="Asignar rol">
					<button
						onclick={openAssignRoleModal}
						class="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-green-600">
						<PlusIcon class="h-4 w-4" />
					</button>
				</Tooltip>
				<Tooltip text="Desasignar">
					<button
						onclick={() => unassignRole(row)}
						class="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-red-600">
						<TrashIcon class="h-4 w-4" />
					</button>
				</Tooltip>
			{/snippet}
		</DataGrid>
	
		<!-- Grupos -->
		<Subtitle>Grupos</Subtitle>
		<DataGrid
			data={userGroups}
			columns={['id', 'name', 'description']}
			refresh_data={loadUserPermissions}
			showPagination={false}
			showRowCount={false}>
			{#snippet actions(row)}
				<Tooltip text="Asignar grupo">
					<button
						onclick={openAssignGroupModal}
						class="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-green-600">
						<PlusIcon class="h-4 w-4" />
					</button>
				</Tooltip>
				<Tooltip text="Desasignar">
					<button
						onclick={() => unassignGroup(row)}
						class="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-red-600">
						<TrashIcon class="h-4 w-4" />
					</button>
				</Tooltip>
			{/snippet}
		</DataGrid>
	{/if}
</Section>

