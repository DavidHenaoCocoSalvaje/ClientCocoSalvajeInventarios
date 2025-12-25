<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// Recibir parámetros de ruta usando Svelte 5 $props
	interface Props {
		params: {
			app_name: string;
		};
	}

	let { params }: Props = $props();
	
	// Obtener el nombre de la app desde los parámetros de ruta
	const appName = $derived(params.app_name || 'aplicación');

	onMount(() => {
		// Guardar en localStorage que la app fue autorizada
		const connectedApps = JSON.parse(localStorage.getItem('connectedApps') || '[]');
		if (!connectedApps.includes(appName)) {
			connectedApps.push(appName);
			localStorage.setItem('connectedApps', JSON.stringify(connectedApps));
		}

		// Redirigir inmediatamente a aplicaciones
		goto('/aplicaciones');
	});
</script>
