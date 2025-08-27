# 目次

- [コンポーネント概要](#コンポーネント概要)
- [ソースコード説明](#ソースコード説明)
- [使用例](#使用例)

## コンポーネント概要

Coffee コンポーネントの概要を記述します。

## ソースコード説明

```tsx
// src/features/coffee/components/Coffee.tsx
import type { CoffeeType } from "../type/coffee";

// Propsの型定義
type Props = {
  coffee: CoffeeType; // CoffeeType型のcoffeeを受け取る
};

// Coffeeコンポーネント
export const Coffee = ({ coffee }: Props) => {
  return (
    // article要素：コーヒーアイテム全体を囲む、スタイルはTailwind CSSを使用
    <article className="group h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* 画像（比率を安定させる） */}
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          src={coffee.image}
          alt={coffee.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
        />
      </div>

      {/* 本文（flex-1 で下のIDをフッターに追いやる） */}
      <div className="flex flex-col p-5 gap-3 flex-1">
        <h2 className="m-0 text-xl font-semibold leading-tight tracking-tight text-slate-900">
          {coffee.title}
        </h2>

        <p className="text-sm leading-6 text-slate-600">{coffee.description}</p>

        <div className="mt-1">
          <div className="mb-2 text-xs font-semibold tracking-wide text-slate-700">
            Ingredients:
          </div>
          {/* チップを小さめ＆間隔控えめでスッキリ */}
          <ul className="flex flex-wrap gap-2">
            {coffee.ingredients.map((ing, i) => (
              <li
                key={i}
                className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
              >
                {ing}
              </li>
            ))}
          </ul>
        </div>

        {/* 区切り線＋メタ行を最下部へ */}
        <div className="mt-auto pt-3 border-t border-slate-100">
          <small className="block text-right text-xs text-slate-400">
            ID: {coffee.id}
          </small>
        </div>
      </div>
    </article>
  );
};
```

このコンポーネントは、コーヒーに関する情報を表示します。

## 使用例

```tsx
import Coffee from "./Coffee";
import { CoffeeType } from "../type/coffee";

function App() {
  const sampleCoffee: CoffeeType = {
    id: 1,
    title: "Sample Coffee",
    description: "This is a sample coffee description.",
    ingredients: ["water", "coffee beans"],
    image: "https://example.com/sample-coffee.jpg",
  };

  return <Coffee coffee={sampleCoffee} />;
}
```
