// src/features/todo/components/TodoList.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TodoList } from "./TodoList";
import type { Todo } from "../types/todo";

describe("TodoList", () => {
  const sampleTodos: Todo[] = [
    { id: 1, text: "ランニング", done: false },
    { id: 2, text: "読書", done: true },
  ];

  it("todosが表示される", () => {
    render(
      <TodoList
        todos={sampleTodos}
        onDelete={() => {}}
        onToggle={() => {}}
        onEdit={()=>{}}
      />
    );

    expect(screen.getByText("ランニング")).toBeInTheDocument();
    expect(screen.getByText("読書")).toBeInTheDocument();
  });

  it("todosが空のとき、代わりのメッセージが表示される", () => {
    render(
      <TodoList todos={[]} onDelete={() => {}} onToggle={() => {}} onEdit={()=>{}}/>
    );

    expect(screen.getByText("TODOがありません")).toBeInTheDocument();
  });
});
