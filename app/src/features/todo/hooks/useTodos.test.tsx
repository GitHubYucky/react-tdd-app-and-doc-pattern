// src/features/todo/hooks/__tests__/useTodos.test.ts
import { renderHook, act } from "@testing-library/react";
import { useTodos } from "./useTodos";
import { it,expect,describe  } from "vitest";

// result.current.
  // todos,addTodo,deleteTodo,toggleTodo

describe("useTodos", () => {
  it("初期状態ではtodosは空", () => {
    //
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual([]);
  });

  it("addTodoで新しいTodoが追加される", () => {
    // arrange
    const {result} = renderHook(()=>useTodos());

    // act
    act(()=>{
      result.current.addTodo("hoge")
    })

    // arrange
    expect(result.current.todos[0].text).toBe("hoge")
  });

  it("deleteTodoで指定したTodoが削除される", () => {
    //act
    const {result} = renderHook(()=>useTodos());
    act(()=>{
      result.current.addTodo("hoge")
    })
    const id=result.current.todos[0].id;
    // arrange
    // 状態更新はActで囲む
    act(()=>{
      result.current.deleteTodo(id);
    });
    // assert
    // toEqual is for objects, tobe is for value
    expect(result.current.todos).toEqual([])
  });

  it("toggleTodoでdoneが反転する", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("運動");
    });

    const id = result.current.todos[0].id;

    act(() => {
      result.current.toggleTodo(id);
    });

    expect(result.current.todos[0].done).toBe(true);

    act(() => {
      result.current.toggleTodo(id);
    });

    expect(result.current.todos[0].done).toBe(false);
  });

  it("editTodoTextでtodoTextが変わる",()=>{
    const {result}=renderHook(()=>useTodos())

    act(()=>{
      result.current.addTodo("hoge")
    })
    const id=result.current.todos[0].id;

    act(()=>{
      result.current.editTodoText(id,"foo");
    })

    expect(result.current.todos[0].text).toBe("foo")
  })
});
