<script>
	let { children } = $props();
	import '../app.css';
	import { page } from '$app/state';
</script>

{#if !page.url.pathname.startsWith('/login')}
	<header class="fixed top-0 z-20 w-full">
		<div class="flex h-16 min-w-3xs items-center gap-5 bg-teal-700 px-10 py-5 font-bold text-white">
			<a href="/">Inicio</a>
			<a href="/inventario">Inventario</a>
			<a href="/transacciones">Transacciones</a>
			<form class="ml-auto" method="POST" action="/logout">
				<button class="cursor-pointer border-none bg-transparent font-bold text-white">
					Cerrar sesión
				</button>
			</form>
		</div>
	</header>
{/if}

<main class="relative flex h-screen w-screen">
	{@render children()}
</main>

<style lang="postcss">
	@reference 'tailwindcss';
</style>
