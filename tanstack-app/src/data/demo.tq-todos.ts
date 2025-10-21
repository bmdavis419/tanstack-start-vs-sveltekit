import { createServerFn } from "@tanstack/react-start";
import z from "zod";

type Todo = {
	id: string;
	name: string;
	completed: boolean;
};

const getDefaultTodos = () => {
	const DEFAULT_TODOS: Todo[] = [
		{
			id: crypto.randomUUID(),
			name: "Buy groceries",
			completed: false,
		},
		{
			id: crypto.randomUUID(),
			name: "Buy mobile phone",
			completed: false,
		},
		{
			id: crypto.randomUUID(),
			name: "Buy laptop",
			completed: false,
		},
	];
	return DEFAULT_TODOS;
};

let todos: Todo[] = [];

export const resetServerTodos = createServerFn({ method: "POST" }).handler(
	() => {
		const defaultTodos = getDefaultTodos();
		todos = [...defaultTodos];
		return { success: true };
	},
);

export const getServerTodos = createServerFn({ method: "GET" }).handler(() => {
	if (todos.length === 0) {
		const defaultTodos = getDefaultTodos();
		todos = [...defaultTodos];
	}
	return { todos };
});

const toggleTodoInputSchema = z.object({
	id: z.string(),
});

export const toggleServerTodo = createServerFn({ method: "POST" })
	.inputValidator(toggleTodoInputSchema)
	.handler(async ({ data }) => {
		const todo = todos.find((t) => t.id === data.id);
		if (!todo) {
			throw new Error("Todo not found");
		}
		todo.completed = !todo.completed;
		return todo;
	});

const addTodoInputSchema = z.object({
	name: z.string(),
});

export const addServerTodo = createServerFn({ method: "POST" })
	.inputValidator(addTodoInputSchema)
	.handler(async ({ data }) => {
		const todo = {
			id: crypto.randomUUID(),
			name: data.name,
			completed: false,
		};
		todos.push(todo);
		return todo;
	});
