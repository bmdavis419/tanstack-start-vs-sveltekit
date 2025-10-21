import { createServerFn } from "@tanstack/react-start";
import { randomUUID } from "crypto";
import z from "zod";

type Todo = {
	id: string;
	name: string;
	completed: boolean;
};

const todos: Todo[] = [
	{
		id: randomUUID(),
		name: "Buy groceries",
		completed: false,
	},
	{
		id: randomUUID(),
		name: "Buy mobile phone",
		completed: false,
	},
	{
		id: randomUUID(),
		name: "Buy laptop",
		completed: false,
	},
];

export const getServerTodos = createServerFn({ method: "GET" }).handler(() => {
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
			id: randomUUID(),
			name: data.name,
			completed: false,
		};
		todos.push(todo);
		return todo;
	});
