import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useState } from "react";
import {
	addServerTodo,
	getServerTodos,
	resetServerTodos,
	toggleServerTodo,
} from "../data/demo.tq-todos";

export const Route = createFileRoute("/")({
	component: TanStackQueryDemo,
	loader: async () => await getServerTodos(),
});

function TodoStats(props: {
	totalCount: number;
	completedCount: number;
	fireResetTodos: () => void;
}) {
	return (
		<div className="flex items-center justify-start gap-2 pb-1 text-lg font-bold border-b border-white/20 mb-2">
			<span>Total: {props.totalCount}</span>
			<span>Completed: {props.completedCount}</span>
			<button type="button" onClick={props.fireResetTodos}>
				HARD RESET
			</button>
		</div>
	);
}

function TanStackQueryDemo() {
	const initTodos = Route.useLoaderData();
	const getTodos = useServerFn(getServerTodos);
	const addTodo = useServerFn(addServerTodo);
	const resetTodos = useServerFn(resetServerTodos);
	const toggleTodo = useServerFn(toggleServerTodo);

	const { data, refetch } = useQuery({
		queryKey: ["todos"],
		queryFn: () => getTodos(),
		initialData: initTodos,
	});

	const { mutate: mutateAddTodo } = useMutation({
		mutationFn: (todo: string) => addTodo({ data: { name: todo } }),
		onSuccess: () => refetch(),
	});

	const { mutate: mutateToggleTodo } = useMutation({
		mutationFn: (id: string) => toggleTodo({ data: { id } }),
		onSuccess: () => refetch(),
	});

	const { mutate: mutateResetTodos } = useMutation({
		mutationFn: () => resetTodos(),
		onSuccess: () => refetch(),
	});

	const [todo, setTodo] = useState("");

	const fireResetTodos = useCallback(async () => {
		await mutateResetTodos();
	}, [mutateResetTodos]);

	const fireAddTodo = useCallback(async () => {
		await mutateAddTodo(todo);
		setTodo("");
	}, [mutateAddTodo, todo]);

	const fireToggleTodo = useCallback(
		async (id: string) => {
			await mutateToggleTodo(id);
		},
		[mutateToggleTodo],
	);

	const totalCount = data?.todos.length ?? 0;
	const completedCount = data?.todos.filter((t) => t.completed).length ?? 0;

	return (
		<div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-900 via-blue-800 to-black p-4 text-white">
			<div className="w-full max-w-2xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10">
				<h1 className="text-2xl mb-4">TanStack Query Todos list</h1>
				<TodoStats
					totalCount={totalCount}
					completedCount={completedCount}
					fireResetTodos={fireResetTodos}
				/>
				<div className="mb-4 space-y-2 flex flex-col gap-2">
					{data?.todos.map((t) => (
						<button
							key={t.id}
							className="bg-white/10 border border-white/20 rounded-lg p-3 backdrop-blur-sm shadow-md flex flex-row items-center justify-between"
							onClick={() => fireToggleTodo(t.id)}
							type="button"
						>
							<span className="text-lg text-white">{t.name}</span>
							<span className="text-sm text-white">
								{t.completed ? "Completed" : "Not completed"}
							</span>
						</button>
					))}
				</div>
				<div className="flex flex-col gap-2">
					<input
						type="text"
						value={todo}
						onChange={(e) => setTodo(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								fireAddTodo();
							}
						}}
						placeholder="Enter a new todo..."
						className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
					/>
					<button
						type="button"
						disabled={todo.trim().length === 0}
						onClick={fireAddTodo}
						className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
					>
						Add todo
					</button>
				</div>
			</div>
		</div>
	);
}
