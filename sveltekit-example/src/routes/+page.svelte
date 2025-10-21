<script lang="ts">
	import Todos from '$lib/components/Todos.svelte';
</script>

<!-- With the boundary we will load the todos on the client and await them, kinda like react suspense -->

<!-- <svelte:boundary>
	{#snippet pending()}
		<div class="flex h-screen items-center justify-center bg-neutral-900">
			<div class="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
		</div>
	{/snippet}
	<Todos />
</svelte:boundary> -->

<!-- Without the boundary we will load the todos on the server and SSR them down kinda like a load function -->

<Todos />
