<script>
	let { children } = $props();
	import '../app.css';
	import { page } from '$app/state';
	// Supports weights 100-900
	import '@fontsource-variable/roboto';
</script>

{#if !page.url.pathname.startsWith('/login')}
	<header
		class="font-[Roboto Variable] fixed top-0 z-30 flex h-14 w-full items-center gap-5 bg-teal-700 px-10 font-sans text-sm font-semibold text-white">
		<a class:text-teal-300={page.url.pathname === '/'} href="/">Inicio</a>
		<a class:text-teal-300={page.url.pathname.startsWith('/inventario')} href="/inventario">Inventario</a>
		<a class:text-teal-300={page.url.pathname.startsWith('/transacciones')} href="/transacciones">Transacciones</a>
		<form class="ml-auto" method="POST" action="/logout">
			<button class="cursor-pointer border-none bg-transparent"> Cerrar sesión </button>
		</form>
	</header>
{/if}

<main class="font-[Roboto Variable] relative flex h-screen w-screen font-sans text-sm">
	{@render children()}
</main>

<style lang="postcss">
	@reference 'tailwindcss';
</style>
