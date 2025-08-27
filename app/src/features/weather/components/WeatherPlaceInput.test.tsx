// src/features/weather/components/WeatherPlaceInput.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WeatherPlaceInput } from "./WeatherPlaceInput";



describe("WeatherPlaceInput", () => {
  it("緯度・経度を入力して送信すると onSearch が呼ばれる", () => {
    const mockOnSearch = vi.fn();
    render(<WeatherPlaceInput onSearch={mockOnSearch} loading={false} />);

    // 緯度・経度入力
    fireEvent.change(screen.getByPlaceholderText("例: 35.0"), {
      target: { value: "35.0" },
    });
    fireEvent.change(screen.getByPlaceholderText("例: 135.0"), {
      target: { value: "135.0" },
    });

    // フォーム送信
    fireEvent.click(screen.getByText("天気を取得"));
    expect(mockOnSearch).toHaveBeenCalledWith(35.0, 135.0);
  });

  it("loadingがtrueの時、入力欄とボタンがdisabledになる", () => {
    // onSearch関数をモック化 (テストには直接使わないが、コンポーネントのpropsとして必要)
    const mockOnSearch = vi.fn();

    // loading={true} でコンポーネントをレンダー
    render(<WeatherPlaceInput onSearch={mockOnSearch} loading={true} />);

    // 緯度と経度の入力欄を取得
    const latInput = screen.getByPlaceholderText("例: 35.0");
    const lonInput = screen.getByPlaceholderText("例: 135.0");

    // ボタンを役割と名前で取得
    const submitButton = screen.getByRole("button", { name: "天気を取得" });

    // 各要素がdisabledになっていることを確認
    expect(latInput).toBeDisabled();
    expect(lonInput).toBeDisabled();
    expect(submitButton).toBeDisabled();

    // (オプション) disabledな要素がクリックされてもonSearchが呼ばれないことを確認
    fireEvent.click(submitButton);
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

});
