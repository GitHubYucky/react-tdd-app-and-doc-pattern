// src/components/mp3-input.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Mp3Input } from "./mp3-input";

// ※ jest-dom を使う場合は setupFiles で `@testing-library/jest-dom` を読み込み
// 例: vitest.config.ts → test: { setupFiles: ["./src/test/setup.ts"] }

describe("<Mp3Input />", () => {
  it("入力欄とボタンが表示される（ラベル＆ボタン名で取得できる）", () => {
    const onSubmit = vi.fn();
    render(<Mp3Input onSubmit={onSubmit} />);

    // ラベルで textbox を取得
    expect(screen.getByPlaceholderText("input")).toBeInTheDocument();

    // 初期ボタン名
    expect(
      screen.getByRole("button", { name: "Download" })
    ).toBeInTheDocument();
  });

  it("入力するとボタンが有効になり、クリックで onSubmit にトリム済み値が渡る", () => {
    const onSubmit = vi.fn();
    render(<Mp3Input onSubmit={onSubmit} />);

    const input = screen.getByRole("textbox", { name: /YouTube URL\/ID/i });
    const button = screen.getByRole("button", { name: "Download" });

    fireEvent.change(input, {
      target: { value: "  https://www.youtube.com/watch?v=UxxajLWwzqY  " },
    });

    expect(button).not.toBeDisabled();

    fireEvent.click(button);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      "https://www.youtube.com/watch?v=UxxajLWwzqY"
    );
  });

  it("Enter キーでも送信される", () => {
    const onSubmit = vi.fn();
    render(<Mp3Input onSubmit={onSubmit} />);

    const input = screen.getByRole("textbox", { name: /YouTube URL\/ID/i });
    fireEvent.change(input, { target: { value: "UxxajLWwzqY" } });

    // form submit を発火（Enter 相当）
    fireEvent.submit(input.closest("form")!);

    expect(onSubmit).toHaveBeenCalledWith("UxxajLWwzqY");
  });


  it("空白のみは送信不可（onSubmit は呼ばれない）", () => {
    const onSubmit = vi.fn();
    render(<Mp3Input onSubmit={onSubmit} />);

    const input = screen.getByRole("textbox", { name: /YouTube URL\/ID/i });
    const button = screen.getByRole("button", { name: "Download" });

    fireEvent.change(input, { target: { value: "   " } });

    fireEvent.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
