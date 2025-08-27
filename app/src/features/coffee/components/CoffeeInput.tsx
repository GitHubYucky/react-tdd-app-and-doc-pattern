// src/features/coffee/components/CoffeeInput.tsx
import { useState } from "react";
import { Button } from "@/components/button/button";
import { Input } from "@/components/input/input";
import { ListBox } from "@/components/listbox/listbox";

type Props = {
  onSearch: (type: string, title: string) => void;
  disabled?: boolean;
};

export const CoffeeInput = ({ onSearch, disabled = false }: Props) => {
  const [type, setType] = useState<"hot" | "iced">("hot");
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(type, title.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="coffee-search"
      className="
        grid gap-3 mb-4
        grid-cols-1
        sm:[grid-template-columns:200px_1fr_auto]  /* ← 列幅: 固定/伸びる/自動 */
        items-end
      "
    >
      {/* Type */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">Type</label>
        <ListBox
          value={type}
          onChange={(e) => setType((e.target.value as "hot" | "iced"))}
          disabled={disabled}
          className="w-full"   // 横幅は親の200pxにフィット
        >
          <option value="hot">hot</option>
          <option value="iced">iced</option>
        </ListBox>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">Title</label>
        <Input
          type="text"
          placeholder="Search CoffeeTitle..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={disabled}
        />
      </div>

      {/* Search */}
      <Button type="submit" disabled={disabled}>
        Search
      </Button>
    </form>
  );
};
