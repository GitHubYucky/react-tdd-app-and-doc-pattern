// src/components/mp3-input.tsx
import { useState, type FormEvent } from "react";
import { Input } from "../../../components/input/input";
import { Button } from "../../../components/button/button";

export type props = {
  /** 送信時に呼ばれる。YouTubeのURLまたは動画ID（trim 済み）が渡される */
  onSubmit: (value: string) => void;
};

export const Mp3Input = ({onSubmit}: props) => {
  const [url, setUrl] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return; // 空白のみは送信しない
    onSubmit(trimmed);
  };
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="mp3-url">YouTube URL/ID</label>
      <Input
        id="mp3-url"
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="input"
      />
      <Button type="submit">
        Download
      </Button>
    </form>
  );
};
