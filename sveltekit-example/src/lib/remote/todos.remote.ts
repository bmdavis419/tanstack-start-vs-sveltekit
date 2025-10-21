import { command, form, query } from '$app/server';
import z from 'zod';

type Todo = {
	id: string;
	name: string;
	completed: boolean;
};

const DEFAULT_TODOS: Todo[] = [
	{
		id: crypto.randomUUID(),
		name: 'Buy groceries',
		completed: false
	},
	{
		id: crypto.randomUUID(),
		name: 'Buy mobile phone',
		completed: false
	},
	{
		id: crypto.randomUUID(),
		name: 'Buy laptop',
		completed: false
	}
];

let todos: Todo[] = [...DEFAULT_TODOS];

export const remoteResetTodos = command(async () => {
	todos = [...DEFAULT_TODOS];
	todos.forEach((t) => (t.completed = false));
	await remoteGetTodos().refresh();
	return { success: true };
});

export const remoteGetTodos = query(async () => {
	return { todos };
});

const toggleTodoInputSchema = z.object({
	id: z.string()
});

export const remoteToggleTodo = command(toggleTodoInputSchema, async ({ id }) => {
	const todo = todos.find((t) => t.id === id);
	if (!todo) {
		throw new Error('Todo not found');
	}
	todo.completed = !todo.completed;

	await remoteGetTodos().refresh();

	return todo;
});

const addTodoInputSchema = z.object({
	name: z.string()
});

export const remoteAddTodo = form(addTodoInputSchema, async ({ name }) => {
	const todo: Todo = {
		id: crypto.randomUUID(),
		name,
		completed: false
	};
	todos.push(todo);

	await remoteGetTodos().refresh();

	return todo;
});
