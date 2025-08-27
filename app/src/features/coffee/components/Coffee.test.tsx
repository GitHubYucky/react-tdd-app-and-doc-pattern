// src/features/coffee/components/Coffee.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Coffee } from "@/features/coffee/components/Coffee";
import type { CoffeeType } from "@/features/coffee/type/coffee";

const sample: CoffeeType = {
  id: 42,
  title: "Iced Latte",
  description: "Smooth and refreshing.",
  image: "https://example.com/iced-latte.jpg",
  ingredients: ["Espresso", "Milk", "Ice"],
};

describe("<Coffee />", () => {
  it("タイトル、画像、説明、材料、IDが表示される", () => {
    render(<Coffee coffee={sample} />);

    // 見出し
    expect(
      screen.getByRole("heading", { level: 2, name: sample.title })
    ).toBeInTheDocument();

    // 画像
    const img = screen.getByRole("img", { name: sample.title });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", sample.image);

    // 説明
    expect(screen.getByText(sample.description)).toBeInTheDocument();

    // 材料の見出し
    expect(screen.getByText(/ingredients:/i)).toBeInTheDocument();

    // 材料リスト
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(sample.ingredients.length);
    sample.ingredients.forEach((ing) =>
      expect(screen.getByText(ing)).toBeInTheDocument()
    );

    // ID 表示
    expect(screen.getByText(new RegExp(`ID:\\s*${sample.id}`))).toBeInTheDocument();
  });

  it("材料が空配列でもエラーなく描画できる", () => {
    const emptyIngredients: CoffeeType = { ...sample, ingredients: [] };
    render(<Coffee coffee={emptyIngredients} />);

    // リスト項目が0件
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
