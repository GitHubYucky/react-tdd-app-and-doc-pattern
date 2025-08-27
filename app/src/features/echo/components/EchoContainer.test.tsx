import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { EchoContainer } from "./EchoContainer";

// fetch をグローバルにモック
global.fetch = vi.fn();

describe("EchoContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("EchoInputとEchoDisplayが表示される", () => {
    render(<EchoContainer />);
    expect(screen.getByPlaceholderText("新しいEchoを入力")).toBeInTheDocument();
    expect(screen.getByText("Echo")).toBeInTheDocument();
  });

  it("EchoInputでEchoを押すと入力値が表示される", async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ echoed: "新しいタスク" }),
    });

    render(<EchoContainer />);

    const input = screen.getByPlaceholderText("新しいEchoを入力");
    fireEvent.change(input, { target: { value: "新しいタスク" } });

    const button = screen.getByText("Echo");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("新しいタスク")).toBeInTheDocument();
    });
  });

  it("通信中はローディングメッセージが表示される", async () => {
    let resolveFetch: ((value: any) => void) | undefined;

    (fetch as any).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    render(<EchoContainer />);

    fireEvent.change(screen.getByPlaceholderText("新しいEchoを入力"), {
      target: { value: "loading中" },
    });

    fireEvent.click(screen.getByText("Echo"));

    expect(screen.getByText("送信中...")).toBeInTheDocument();

    resolveFetch?.({
      ok: true,
      json: async () => ({ echoed: "loading中" }),
    });

    await waitFor(() => {
      expect(screen.queryByText("送信中...")).not.toBeInTheDocument();
    });
  });

  it("API失敗時にエラー表示される", async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
    });

    render(<EchoContainer />);

    fireEvent.change(screen.getByPlaceholderText("新しいEchoを入力"), {
      target: { value: "失敗" },
    });

    fireEvent.click(screen.getByText("Echo"));

    await waitFor(() => {
      expect(screen.getByText("通信エラー")).toBeInTheDocument();
    });
  });

  it("ローディング中は入力とボタンが無効化される", async () => {
    let resolveFetch: ((value: any) => void) | undefined;

    (fetch as any).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    render(<EchoContainer />);

    const input = screen.getByPlaceholderText("新しいEchoを入力") as HTMLInputElement;
    const button = screen.getByText("Echo");

    fireEvent.change(input, { target: { value: "待機" } });
    fireEvent.click(button);

    expect(input.disabled).toBe(true);
    expect(button).toBeDisabled();

    resolveFetch?.({
      ok: true,
      json: async () => ({ echoed: "待機" }),
    });

    await waitFor(() => {
      expect(input.disabled).toBe(false);
      expect(button).not.toBeDisabled();
    });
  });
});
