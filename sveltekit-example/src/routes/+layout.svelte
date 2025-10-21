<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>TanStack vs SvelteKit | SVELTE</title>
</svelte:head>

<header class="flex items-center justify-center bg-neutral-900 p-4 text-2xl font-bold text-white">
	<h2>Svelte Example</h2>
</header>

{@render children?.()}
