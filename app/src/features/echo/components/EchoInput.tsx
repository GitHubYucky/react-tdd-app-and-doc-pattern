import { useState } from "react";
import { Input } from "../../../components/input/input";
import { Button } from "../../../components/button/button";

type Props = {
  onEcho: (message: string) => void;
  disabled?: boolean;
};

export const EchoInput = ({ onEcho, disabled = false }: Props) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // ページリロード防止
    const trimmed = text.trim();
    if (!trimmed) return;

    onEcho(trimmed);
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 items-center"
    >
      <Input
        type="text"
        placeholder="新しいEchoを入力"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
      />
      <Button type="submit" disabled={disabled}>
        Echo
      </Button>
    </form>
  );
};
