// src/features/coffee/components/CoffeeList.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { CoffeeList } from "@/features/coffee/components/CoffeeList";
import type { CoffeeType } from "@/features/coffee/type/coffee";

// テスト用データ
const coffees: CoffeeType[] = [
  {
    id: 1,
    title: "Espresso",
    description: "Strong and bold.",
    image: "https://example.com/espresso.jpg",
    ingredients: ["Espresso"],
  },
  {
    id: 2,
    title: "Iced Latte",
    description: "Smooth and refreshing.",
    image: "https://example.com/iced-latte.jpg",
    ingredients: ["Espresso", "Milk", "Ice"],
  },
];

describe("<CoffeeList />", () => {
  it("渡したコーヒー配列の件数分、カード(article)が表示される", () => {
    render(<CoffeeList coffees={coffees} />);

    // <Coffee /> が <article> を使っている想定（あなたの Coffee コンポーネントに合わせる）
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(coffees.length);

    // タイトルが表示されていること
    coffees.forEach((c) => {
      expect(screen.getByRole("heading", { level: 2, name: c.title })).toBeInTheDocument();
    });
  });

  it("画像(alt=title)も各カードに表示される", () => {
    render(<CoffeeList coffees={coffees} />);

    coffees.forEach((c) => {
      const img = screen.getByRole("img", { name: c.title });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", c.image);
    });
  });

  it("空配列のときはカードが表示されない（必要なら空メッセージも検証）", () => {
    render(<CoffeeList coffees={[]} />);

    // article が 0 件
    expect(screen.queryAllByRole("article")).toHaveLength(0);

    // もし空状態メッセージを出す実装なら、以下のように検証
    // expect(screen.getByText(/no coffees/i)).toBeInTheDocument();
  });
});
