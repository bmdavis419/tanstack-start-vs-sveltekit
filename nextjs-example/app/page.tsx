import { getTodos } from "./lib/todos";
import TodoList from "./components/TodoList";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading todos...</div>}>
      <TodosShell />
    </Suspense>
  );
}

const TodosShell = async () => {
  const { todos } = await getTodos();
  return <TodoList initialTodos={todos} />;
};
