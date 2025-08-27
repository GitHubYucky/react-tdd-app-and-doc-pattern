// src/features/todo/components/Todo.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Todo } from "./Todo";
import userEvent from "@testing-library/user-event";


describe("Todo", () => {
  const sample = {
    id: 1,
    text: "散歩する",
    done: false,
  };

  it("テキストが表示される", () => {
    render(
      <Todo
        todo={sample}
        onDelete={() => {}}
        onToggle={() => {}}
        onEdit={()=>{}}
      />
    );
    expect(screen.getByText("散歩する")).toBeInTheDocument();
  });

  it("完了済みの時は取り消し線が表示される", () => {
    render(
      <Todo
        todo={{ ...sample, done: true }}
        onDelete={() => {}}
        onEdit={()=>{}}
        onToggle={() => {}}
      />
    );
    const item = screen.getByText("散歩する");
    expect(item).toHaveClass("line-through")
  });

  it("削除ボタンを押すとonDeleteが呼ばれる", () => {
    const handleDelete = vi.fn();
    render(
      <Todo
        todo={sample}
        onDelete={handleDelete}
        onToggle={() => {}}
        onEdit={()=>{}}
      />
    );

    const btn = screen.getByRole("button", { name: /削除/i });
    fireEvent.click(btn);

    expect(handleDelete).toHaveBeenCalledWith(1);
  });

  it("テキストクリックでonToggleが呼ばれる", () => {
    const handleToggle = vi.fn();
    render(
      <Todo
        todo={sample}
        onDelete={() => {}}
        onToggle={handleToggle}
        onEdit={()=>{}}
      />
    );

    fireEvent.click(screen.getByText("散歩する"));
    expect(handleToggle).toHaveBeenCalledWith(1);
  });

});

describe("TodoEdit",()=>{
  const sample = { id: 1, text: "掃除", done: false };

  it("編集ボタンを押すと入力欄が表示される",()=>{
    render(
      <Todo todo={sample} onDelete={()=>{}} onToggle={()=>{}} onEdit={()=>{}} />
    )
    fireEvent.click(screen.getByText("編集"))
    expect(screen.getByDisplayValue("掃除")).toBeInTheDocument();
  })
  it("保存ボタンを押すとonEditが呼ばれる", () => {
    const onEdit = vi.fn();
    render(
      <Todo todo={sample} onDelete={() => {}} onToggle={() => {}} onEdit={onEdit} />
    );

    fireEvent.click(screen.getByText("編集"));
    const input = screen.getByDisplayValue("掃除");
    fireEvent.change(input, { target: { value: "買い物" } });
    fireEvent.click(screen.getByText("保存"));

    expect(onEdit).toHaveBeenCalledWith(1, "買い物");
  });

  it("Enterキーで保存される", async () => {
    const onEdit = vi.fn();
    render(
      <Todo todo={sample} onDelete={() => {}} onToggle={() => {}} onEdit={onEdit} />
    );

    fireEvent.click(screen.getByText("編集"));
    const input = screen.getByDisplayValue("掃除");
    await userEvent.clear(input);
    await userEvent.type(input, "勉強{enter}");

    expect(onEdit).toHaveBeenCalledWith(1, "勉強");
  });

  it("キャンセルボタン押下で値が戻る",()=>{
    // arrange
    render(
      <Todo todo={sample} onDelete={() => {}} onToggle={() => {}} onEdit={()=>{}} />
    );
    //act
    fireEvent.click(screen.getByText("編集"))
    const input = screen.getByDisplayValue("掃除");
    fireEvent.change(input, { target: { value: "勉強" } });
    const button=screen.getByText("取消")
    fireEvent.click(button)
    //assert
    // DisplayValue=InputValue, Text= textNode
    expect(screen.getByText("掃除")).toBeInTheDocument();
    // ないものを探すときはQuery
    expect(screen.queryByDisplayValue("勉強")).not.toBeInTheDocument();

  })

})
