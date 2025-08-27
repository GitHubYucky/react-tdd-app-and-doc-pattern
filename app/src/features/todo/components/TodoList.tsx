// src/features/todo/components/TodoList.tsx
import { Todo } from "./Todo";
import type { Todo as TodoType } from "../types/todo";

type Props = {
  todos: TodoType[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
};

export const TodoList = ({ todos, onDelete, onToggle, onEdit }: Props) => {
  if (todos.length === 0) {
    return <p>TODOがありません</p>;
  }

  return (
    <ul className="list-none p-0 m-0">
      {todos.map((todo) => (
        <li key={todo.id} className="mb-2">
          <Todo
            todo={todo}
            onDelete={onDelete}
            onToggle={onToggle}
            onEdit={onEdit}
          />
        </li>
      ))}
    </ul>
  );
};
