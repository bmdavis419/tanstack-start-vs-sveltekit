"use client";

import { useState, useTransition } from "react";
import type { Todo } from "../lib/todos";
import { addTodo, getTodos, resetTodos, toggleTodo } from "../lib/todos";

type TodoListProps = {
  initialTodos: Todo[];
};

type TodoStatsProps = {
  totalCount: number;
  completedCount: number;
  onReset: () => void;
};

function TodoStats({ totalCount, completedCount, onReset }: TodoStatsProps) {
  return (
    <div className="mb-2 flex items-center justify-start gap-2 border-b border-white/20 pb-1 text-lg font-bold">
      <span>Total: {totalCount}</span>
      <span>Completed: {completedCount}</span>
      <button type="button" onClick={onReset}>
        HARD RESET
      </button>
    </div>
  );
}

export default function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;

  const fireToggleTodo = async (id: string) => {
    startTransition(async () => {
      try {
        setError(null);
        const updatedTodo = await toggleTodo({ id });
        setTodos((prev) => prev.map((t) => (t.id === id ? updatedTodo : t)));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to toggle todo");
      }
    });
  };

  const fireResetTodos = async () => {
    startTransition(async () => {
      try {
        setError(null);
        await resetTodos();
        const { todos: updatedTodos } = await getTodos();
        setTodos(updatedTodos);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to reset todos");
      }
    });
  };

  const handleAddTodo = async (formData: FormData) => {
    startTransition(async () => {
      try {
        setError(null);
        const newTodo = await addTodo(formData);
        setTodos((prev) => [...prev, newTodo]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add todo");
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 via-slate-800 to-black p-4 text-white">
      <div className="w-full max-w-2xl rounded-xl border-8 border-black/10 bg-black/50 p-8 shadow-xl backdrop-blur-md">
        <h1 className="mb-4 text-2xl">Next.js Todos list</h1>
        <TodoStats
          totalCount={totalCount}
          completedCount={completedCount}
          onReset={fireResetTodos}
        />
        {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
        <div className="mb-4 flex flex-col gap-2 space-y-2">
          {todos.map((t) => (
            <button
              key={t.id}
              className="flex flex-row items-center justify-between rounded-lg border border-white/20 bg-white/10 p-3 shadow-md backdrop-blur-sm"
              onClick={() => fireToggleTodo(t.id)}
              type="button"
              disabled={isPending}
            >
              <span className="text-lg text-white">{t.name}</span>
              <span className="text-sm text-white">
                {t.completed ? "Completed" : "Not completed"}
              </span>
            </button>
          ))}
        </div>
        <form action={handleAddTodo} className="flex flex-col gap-2">
          <input
            name="name"
            placeholder="Enter a new todo..."
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/60 backdrop-blur-sm focus:border-transparent focus:ring-2 focus:ring-gray-400 focus:outline-none"
            disabled={isPending}
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-black px-4 py-3 font-bold text-white transition-colors hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-black/50"
          >
            Add todo
          </button>
        </form>
      </div>
    </div>
  );
}
