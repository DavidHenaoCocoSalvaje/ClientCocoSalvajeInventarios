<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import Title from '$lib/components/Title.svelte';
	import { jwtDecode } from 'jwt-decode';
	import { onMount } from 'svelte';
	let { data } = $props();

	// Estado de apps conectadas
	let connectedApps = $state<string[]>([]);

	onMount(() => {
		// Cargar apps conectadas desde localStorage
		connectedApps = JSON.parse(localStorage.getItem('connectedApps') || '[]');
	});

	// Verificar si una app está conectada
	function isConnected(app: string): boolean {
		return connectedApps.includes(app);
	}

	function handleAuthorization(app: string) {
		const user_id = jwtDecode(data.access_token).sub; 
    	window.location.href = `${data.backendUrl}/oauth/${app}/authorize/${user_id}`;
	}
</script>

<Section>
	<Title>Aplicaciones y Servicios</Title>
	<p class="mt-2 mb-8 text-gray-500">Conecta y gestiona los permisos de tus aplicaciones externas.</p>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		<!-- Gmail Card -->
		<div class="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all p-4 flex flex-col">
			<!-- Header con icono y título -->
			<div class="flex items-center gap-3 mb-3">
				<!-- Icono de Gmail mejorado -->
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="w-10 h-10 flex-shrink-0">
					<path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"></path>
					<path fill="#1e88e5" d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"></path>
					<polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"></polygon>
					<path fill="#c62828" d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"></path>
					<path fill="#fbc02d" d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z"></path>
				</svg>
				<div class="flex-grow">
					<h3 class="text-base font-semibold text-gray-900">Gmail</h3>
					<p class="text-xs text-gray-500">Correo electrónico</p>
				</div>
			</div>
			
			<p class="text-sm text-gray-600 mb-4 flex-grow">
				Permite el acceso a tu bandeja de entrada para lectura y procesamiento automático de facturas.
			</p>
			
			<!-- Botón o estado conectado -->
			{#if isConnected('gmail')}
				<div class="flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-green-50 border border-green-200">
					<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
					</svg>
					<span class="text-sm font-medium text-green-700">Conectado</span>
				</div>
			{:else}
				<button 
					onclick={() => handleAuthorization('gmail')}
					class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-9 px-4 w-full bg-teal-700 text-white hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
				>
					Conectar Gmail
				</button>
			{/if}
		</div>
	</div>
</Section>
