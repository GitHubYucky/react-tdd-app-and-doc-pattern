// src/features/coffee/components/CoffeeInput.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { CoffeeInput } from "./CoffeeInput";

describe("<CoffeeInput />", () => {
  beforeEach(() => vi.clearAllMocks());

  it("入力してボタンを押すと onSearch(type, title) が呼ばれる", () => {
    const handleSearch = vi.fn();
    render(<CoffeeInput onSearch={handleSearch} />);

    // Type セレクト（初期値: "hot"）を取得して "iced" に変更
    const typeSelect = screen.getByDisplayValue("hot"); // <select> を想定
    const titleInput = screen.getByPlaceholderText("Search CoffeeTitle...", {
      exact: true,
    });
    const button = screen.getByRole("button", { name: /search/i });

    fireEvent.change(typeSelect, { target: { value: "iced" } });
    fireEvent.change(titleInput, { target: { value: "latte" } });
    fireEvent.click(button);

    expect(handleSearch).toHaveBeenCalledTimes(1);
    expect(handleSearch).toHaveBeenCalledWith("iced", "latte");
  });

  it("Enter（form submit）でも onSearch(type, title) が呼ばれる", () => {
    const handleSearch = vi.fn();
    render(<CoffeeInput onSearch={handleSearch} />);

    // 初期 type は "hot" のまま
    const titleInput = screen.getByPlaceholderText("Search CoffeeTitle...", {
      exact: true,
    });

    fireEvent.change(titleInput, { target: { value: "espresso" } });

    // <form aria-label="coffee-search"> を submit
    const form = screen.getByRole("form", { name: /coffee-search/i });
    fireEvent.submit(form);

    expect(handleSearch).toHaveBeenCalledTimes(1);
    expect(handleSearch).toHaveBeenCalledWith("hot", "espresso");
  });

  it("空白タイトルは trim されて空文字で渡される", () => {
    const handleSearch = vi.fn();
    render(<CoffeeInput onSearch={handleSearch} />);

    // type はデフォルト "hot"
    const titleInput = screen.getByPlaceholderText("Search CoffeeTitle...", {
      exact: true,
    });
    const button = screen.getByRole("button", { name: /search/i });

    fireEvent.change(titleInput, { target: { value: "   " } });
    fireEvent.click(button);

    expect(handleSearch).toHaveBeenCalledTimes(1);
    expect(handleSearch).toHaveBeenCalledWith("hot", "");
  });

  it("type を 'iced' に変更し、空白タイトルを trim して送信", () => {
    const handleSearch = vi.fn();
    render(<CoffeeInput onSearch={handleSearch} />);

    const typeSelect = screen.getByDisplayValue("hot");
    const titleInput = screen.getByPlaceholderText("Search CoffeeTitle...", {
      exact: true,
    });
    const button = screen.getByRole("button", { name: /search/i });

    fireEvent.change(typeSelect, { target: { value: "iced" } });
    fireEvent.change(titleInput, { target: { value: "  mocha  " } });
    fireEvent.click(button);

    expect(handleSearch).toHaveBeenCalledTimes(1);
    expect(handleSearch).toHaveBeenCalledWith("iced", "mocha");
  });

  it("disabled=true のとき、操作できず onSearch は呼ばれない", () => {
    const handleSearch = vi.fn();
    render(<CoffeeInput onSearch={handleSearch} disabled />);

    // それぞれ disabled であること
    const button = screen.getByRole("button", { name: /search/i });
    const titleInput = screen.getByPlaceholderText("Search CoffeeTitle...", {
      exact: true,
    });
    // Type は初期値 "hot"
    const typeSelect = screen.getByDisplayValue("hot");

    expect(button).toBeDisabled();
    expect(titleInput).toBeDisabled();
    expect(typeSelect).toBeDisabled();

    // クリックしても呼ばれない
    fireEvent.click(button);
    expect(handleSearch).not.toHaveBeenCalled();
  });
});
