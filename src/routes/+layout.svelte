<script>
	let { children } = $props();
	import '../app.css';
	import { page } from '$app/state';
</script>

{#if !page.url.pathname.startsWith('/login')}
	<header
		class="fixed top-0 z-30 flex h-14 w-full items-center gap-5 bg-teal-700 px-10 text-sm font-semibold text-white">
		<a href="/">Inicio</a>
		<a href="/inventario">Inventario</a>
		<a href="/transacciones">Transacciones</a>
		<form class="ml-auto" method="POST" action="/logout">
			<button class="cursor-pointer border-none bg-transparent"> Cerrar sesión </button>
		</form>
	</header>
{/if}

<main class="relative flex h-screen w-screen text-sm">
	{@render children()}
</main>

<style lang="postcss">
	@reference 'tailwindcss';
</style>
