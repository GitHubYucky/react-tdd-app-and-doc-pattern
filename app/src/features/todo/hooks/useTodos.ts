// src/features/todo/hooks/useTodos.ts
import { useState } from "react";
import type { Todo } from "../types/todo";

// useTodosでは
// state todos や　todoにかかわる操作を他でも使えるようにする
// そしてそれをexport するのだ
export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      done: false,
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };
  const editTodoText=(id:number,newTodoText:string)=>{
    setTodos((prev)=>
      prev.map((todo)=>todo.id===id?{...todo,text:newTodoText}:todo
      )
    )
  }

  return {
    todos,
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodoText
  };
};
