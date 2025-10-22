<script lang="ts">
	import {
		remoteAddTodo,
		remoteGetTodos,
		remoteResetTodos,
		remoteToggleTodo
	} from '$lib/remote/todos.remote';

	const todosQuery = $derived(await remoteGetTodos());

	const fireToggleTodo = async (id: string) => {
		await remoteToggleTodo({ id });
	};

	const fireResetTodos = async () => {
		await remoteResetTodos();
	};

	const totalCount = $derived(todosQuery.todos.length);
	const completedCount = $derived(todosQuery.todos.filter((t) => t.completed).length);

	type TodoStatsProps = {
		totalCount: number;
		completedCount: number;
	};
</script>

{#snippet TodoStats(props: TodoStatsProps)}
	<div
		class="mb-2 flex items-center justify-start gap-2 border-b border-white/20 pb-1 text-lg font-bold"
	>
		<span>Total: {props.totalCount}</span>
		<span>Completed: {props.completedCount}</span>
		<button type="button" onclick={fireResetTodos}>HARD RESET</button>
	</div>
{/snippet}

<div
	class="flex min-h-screen items-center justify-center bg-linear-to-br from-orange-900 via-orange-800 to-black p-4 text-white"
>
	<div
		class="w-full max-w-2xl rounded-xl border-8 border-black/10 bg-black/50 p-8 shadow-xl backdrop-blur-md"
	>
		<h1 class="mb-4 text-2xl">SvelteKit Todos list</h1>
		{@render TodoStats({ totalCount, completedCount })}
		<div class="mb-4 flex flex-col gap-2 space-y-2">
			{#each todosQuery.todos as t}
				<button
					class="flex flex-row items-center justify-between rounded-lg border border-white/20 bg-white/10 p-3 shadow-md backdrop-blur-sm"
					onclick={() => fireToggleTodo(t.id)}
					type="button"
				>
					<span class="text-lg text-white">{t.name}</span>
					<span class="text-sm text-white">
						{t.completed ? 'Completed' : 'Not completed'}
					</span>
				</button>
			{/each}
		</div>
		<form class="flex flex-col gap-2" {...remoteAddTodo}>
			<input
				{...remoteAddTodo.fields.name.as('text')}
				placeholder="Enter a new todo..."
				class="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/60 backdrop-blur-sm focus:border-transparent focus:ring-2 focus:ring-orange-400 focus:outline-none"
			/>
			{#each remoteAddTodo.fields.name.issues() as issue}
				<p class="text-sm text-red-500">{issue.message}</p>
			{/each}
			<button
				type="submit"
				class="rounded-lg bg-orange-500 px-4 py-3 font-bold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-500/50"
			>
				Add todo
			</button>
		</form>
	</div>
</div>
