<script lang="ts">
	import Section from '$lib/components/MainSection.svelte';
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
    	window.location.href = `${data.backendUrlCsr}/oauth/${app}/authorize/${user_id}`;
	}
</script>

<Section className="px-10 py-5 gap-5">
	<Title>Aplicaciones y Servicios</Title>
	<div class="w-full">
		<p>Conecta aplicaciones externas.</p>
	</div>
	
	<div class="flex flex-wrap gap-4 w-full">
		<!-- Gmail Card -->
		<div class="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col relative group w-64">
			<!-- Indicador de conexión (Check) en la esquina superior derecha -->
			{#if isConnected('gmail')}
				<div class="absolute top-3 right-3 bg-green-50 rounded-full p-1 shadow-sm border border-green-100" title="Conectado">
					<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
					</svg>
				</div>
			{/if}

			<!-- Header con icono y título alineados horizontalmente -->
			<div class="flex items-center gap-3 mb-3 pr-6"> <!-- pr-6 para dar espacio al check si está presente -->
				<!-- Icono de Gmail mejorado -->
				<div class="shrink-0">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="w-10 h-10">
						<path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"></path>
						<path fill="#1e88e5" d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"></path>
						<polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"></polygon>
						<path fill="#c62828" d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"></path>
						<path fill="#fbc02d" d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z"></path>
					</svg>
				</div>
				<div class="flex flex-col items-start text-left">
					<h3 class="text-base font-semibold text-gray-900 leading-tight">Gmail</h3>
					<p class="text-xs text-gray-500">Correo electrónico</p>
				</div>
			</div>
			
			<p class="text-xs text-gray-600 mb-4 grow">
				Acceso a la bandeja de entrada.
			</p>
			
			<button 
				onclick={() => handleAuthorization('gmail')}
				class="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors h-8 px-3 w-full bg-teal-700 text-white hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
			>
				{isConnected('gmail') ? 'Reconectar' : 'Conectar'}
			</button>
		</div>
	</div>
</Section>
