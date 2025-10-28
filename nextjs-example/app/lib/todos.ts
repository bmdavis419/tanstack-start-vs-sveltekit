"use server"
import { cacheTag, updateTag } from "next/cache";
import "server-only";

import z from 'zod';

export type Todo = {
	id: string;
	name: string;
	completed: boolean;
};

const getDefaultTodos = () => {
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
	return DEFAULT_TODOS;
};

let todos: Todo[] = [];

export async function resetTodos() {
	const defaultTodos = getDefaultTodos();
	todos = [...defaultTodos];
	return { success: true };
}

export async function getTodos() {
    "use cache"
    cacheTag("todos")
	if (todos.length === 0) {
		const defaultTodos = getDefaultTodos();
		todos = [...defaultTodos];
	}
	return { todos };
}

const toggleTodoInputSchema = z.object({
	id: z.string()
});

type ToggleTodoInput = z.infer<typeof toggleTodoInputSchema>;

export async function toggleTodo(input: ToggleTodoInput) {
    updateTag("todos")
	const { id } = toggleTodoInputSchema.parse(input);
	const todo = todos.find((t) => t.id === id);
	if (!todo) {
		throw new Error('Todo not found');
	}
	todo.completed = !todo.completed;
	return todo;
}

const addTodoInputSchema = z.object({
	name: z.string().min(1, 'name is required').max(100, 'name is too long')
});

export async function addTodo(formData: FormData) {
    updateTag("todos")
	const rawFormData = {
		name: formData.get('name')
	};
	const { name } = addTodoInputSchema.parse(rawFormData);
	const todo: Todo = {
		id: crypto.randomUUID(),
		name,
		completed: false
	};
	todos.push(todo);
	return todo;
}
