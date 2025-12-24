<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Section from '$lib/components/Section.svelte';

	// Obtener el nombre de la app desde los parámetros de ruta
	const appName = $page.params.app_name || 'aplicación';
	
	// Capitalizar primera letra para mostrar
	const appDisplayName = appName.charAt(0).toUpperCase() + appName.slice(1);

	let countdown = 3;

	onMount(() => {
		// Guardar en localStorage que la app fue autorizada
		const connectedApps = JSON.parse(localStorage.getItem('connectedApps') || '[]');
		if (!connectedApps.includes(appName)) {
			connectedApps.push(appName);
			localStorage.setItem('connectedApps', JSON.stringify(connectedApps));
		}

		// Countdown para redirect automático
		const interval = setInterval(() => {
			countdown--;
			if (countdown === 0) {
				clearInterval(interval);
				goto('/aplicaciones');
			}
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<Section>
	<div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
		<div class="mb-6">
			<svg
				class="w-20 h-20 text-green-500 mx-auto"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
		</div>

		<h1 class="text-3xl font-bold text-gray-900 mb-4">✅ ¡Autorización Exitosa!</h1>

		<p class="text-lg text-gray-600 mb-2">
			Tu cuenta de {appDisplayName} ha sido conectada correctamente.
		</p>

		<p class="text-sm text-gray-500 mb-8">
			Serás redirigido automáticamente en <span class="font-semibold text-teal-700"
				>{countdown}</span
			> segundos...
		</p>

		<a
			href="/aplicaciones"
			class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-teal-700 text-white hover:bg-teal-800 h-10 px-6 py-2"
		>
			Volver a Aplicaciones
		</a>
	</div>
</Section>
