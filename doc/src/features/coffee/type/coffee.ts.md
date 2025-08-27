# 目次

- [型定義概要](#型定義概要)
- [ソースコード説明](#ソースコード説明)
- [使用例](#使用例)

## 型定義概要

coffee.ts の型定義の概要を記述します。

## ソースコード説明

```tsx
export type CoffeeType = {
  title: string;
  description: string;
  ingredients: string[];
  image: string;
  id: number;
};
export type CoffeeApiType = {
  title: string;
  description: string;
  ingredients: string[] | string;
  image: string;
  id: number;
};
```

このファイルは、コーヒーの型定義を提供します。

## 使用例

```tsx
import { CoffeeType } from "./coffee";

function App() {
  const coffee: CoffeeType = {
    id: 1,
    title: "Coffee",
    description: "Description",
    ingredients: [],
    image: "image",
  };

  return <div>{coffee.title}</div>;
}
```
