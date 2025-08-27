// src/features/todo/components/Todo.tsx
import { useState } from "react";
import type { Todo as TodoType } from "../types/todo";
import { Button } from "../../../components/button/button";
import { Input } from "../../../components/input/input";

type Props = {
  todo: TodoType;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
};

export const Todo = ({ todo, onDelete, onToggle, onEdit }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const submitEdit = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== todo.text) onEdit(todo.id, trimmed);
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitEdit();
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  return (
    <div
      className={`border border-[#ccc] rounded-md p-3 mb-2 ${
        isEditing ? "flex flex-col" : "flex items-center justify-between"
      }`}
    >
      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="編集するTODOを入力"
            className="flex-1"
          />
          <Button variant="primary" type="submit">保存</Button>
          <Button variant="secondary" type="button" onClick={handleCancel}>
            取消
          </Button>
        </form>
      ) : (
        <>
          <span
            onClick={() => onToggle(todo.id)}
            className={`flex-1 ${todo.done ? "line-through" : ""} cursor-pointer`}
          >
            {todo.text}
          </span>
          <div className="flex items-center gap-3 ml-3">
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              編集
            </Button>
            <Button variant="danger" onClick={() => onDelete(todo.id)}>
              削除
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
