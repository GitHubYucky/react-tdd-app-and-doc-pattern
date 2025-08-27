// src/features/todo/components/TodoInput.tsx
import { FormEvent, useState } from "react";
import { Button } from "../../../components/button/button";
import { Input } from "../../../components/input/input";

type Props = {
  onAdd: (text: string) => void;
};

export const TodoInput = ({ onAdd }: Props) => {
  const [text, setText] = useState("");

  const handleSubmit = (e:FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    onAdd(trimmed);
    setText("");
  };

  return (
    <form className="flex gap-2 mb-4" onSubmit={handleSubmit}>
      <Input
        type="text"
        value={text}
        placeholder="新しいTODOを入力"
        onChange={(e) => setText(e.target.value)}
      />
      <Button
        variant="primary"

        type="submit"
      >
        追加
      </Button>
    </form>
  );
};
