# 目次

- [コンポーネント概要](#コンポーネント概要)
- [ソースコード説明](#ソースコード説明)
- [使用例](#使用例)

## コンポーネント概要

CoffeeInput コンポーネントの概要を記述します。

## ソースコード説明

```tsx
// src/features/coffee/components/CoffeeInput.tsx
import { useState } from "react"; // useStateフックをインポート
import { Button } from "@/components/button/button"; // Buttonコンポーネントをインポート
import { Input } from "@/components/input/input"; // Inputコンポーネントをインポート
import { ListBox } from "@/components/listbox/listbox"; // ListBoxコンポーネントをインポート

// Propsの型定義
type Props = {
  onSearch: (type: string, title: string) => void; // 検索処理を行う関数
  disabled?: boolean; // disabled属性
};

// CoffeeInputコンポーネント
export const CoffeeInput = ({ onSearch, disabled = false }: Props) => {
  const [type, setType] = useState<"hot" | "iced">("hot"); // typeの状態を管理
  const [title, setTitle] = useState(""); // titleの状態を管理

  // フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // デフォルトのフォーム送信を停止
    onSearch(type, title.trim()); // 検索処理を行う関数を呼び出す
  };

  return (
    // フォーム
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
          onChange={(e) => setType(e.target.value as "hot" | "iced")}
          disabled={disabled}
          className="w-full" // 横幅は親の200pxにフィット
        >
          <option value="hot">hot</option>
          <option value="iced">iced</option>
        </ListBox>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">
          Title
        </label>
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
```

このコンポーネントは、コーヒーを検索するための入力フィールドを提供します。

## 使用例

```tsx
import CoffeeInput from "./CoffeeInput";

function App() {
  // CoffeeInputコンポーネントを表示
  return <CoffeeInput onSearch={() => {}} />;
}
```
