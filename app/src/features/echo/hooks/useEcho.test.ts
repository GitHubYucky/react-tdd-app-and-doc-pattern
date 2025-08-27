// src/features/echo/hooks/useEcho.test.ts
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useEcho } from "./useEcho";

// fetchモック
global.fetch = vi.fn();

describe("useEcho", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("初期状態は空のecho、falseのloading、空のerror", () => {
    const { result } = renderHook(() => useEcho());

    expect(result.current.echo).toBe("");
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("");
  });

  it("正常なechoが返るとき、echoがセットされる", async () => {
    // fetchのモックレスポンス
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ echoed: "Hello" }),
    });

    const { result } = renderHook(() => useEcho());

    await act(async () => {
      await result.current.returnEcho("Hello");
    });

    expect(result.current.echo).toBe("Hello");
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("");
  });

  it("APIエラー時、errorが設定される", async () => {
    // fetchエラーをシミュレート
    (fetch as any).mockRejectedValue(new Error("ネットワークエラー"));

    const { result } = renderHook(() => useEcho());

    await act(async () => {
      await result.current.returnEcho("Hello");
    });

    expect(result.current.echo).toBe("");
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("通信エラー");
  });

  it("fetchのレスポンスがok=falseの場合もerrorになる", async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
    });

    const { result } = renderHook(() => useEcho());

    await act(async () => {
      await result.current.returnEcho("NG");
    });

    expect(result.current.error).toBe("通信エラー");
  });
});
