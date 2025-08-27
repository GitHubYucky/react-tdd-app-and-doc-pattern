// src/features/login/hooks/useAuth.test.ts
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach,type Mock } from "vitest";
import { useAuth } from "./useAuth";

type User = {
  id: string;
  email: string;
  name?: string;
};

// fetch モックを差し替え
global.fetch = vi.fn();

const demoUser: User = { id: "u1", email: "demo@example.com", name: "Demo" };

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });


  it("初期状態: user=null, loading=false, error=null, isAuthenticated=false", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  describe("fetchMe", () => {
    it("未ログイン(204)なら user=null のまま", async () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        status: 204,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.fetchMe();
      });

      expect(global.fetch).toHaveBeenCalledWith("/api/me", expect.objectContaining({
        method: "GET",
        credentials: "include",
      }));
      expect(result.current.user).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("200で {ok:true,user} を返す場合は user をセット", async () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ ok: true, user: demoUser }),
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.fetchMe();
      });

      expect(result.current.user).toEqual(demoUser);
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("200で user オブジェクト単体を返す場合も user をセット", async () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => demoUser,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.fetchMe();
      });

      expect(result.current.user).toEqual(demoUser);
      expect(result.current.error).toBeNull();
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("エラー時は error をセットして user をクリア", async () => {
      (fetch as any).mockRejectedValue(new Error("network error"));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.fetchMe();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.error).toBe("network error");
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("login", () => {
    it("正常系: {ok:true,user} を返したら user をセットして返却", async () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ ok: true, user: demoUser }),
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const u = await result.current.login({ email: "demo@example.com", password: "pass" });
        expect(u).toEqual(demoUser);
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/login",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "demo@example.com", password: "pass" }),
        })
      );
      expect(result.current.user).toEqual(demoUser);
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("異常系: 401 などで {error} を返したら error セット & user クリア", async () => {
      (fetch as any).mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: "Unauthorized" }),
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login({ email: "bad@example.com", password: "wrong" });
      });

      expect(result.current.user).toBeNull();
      expect(result.current.error).toBe("Unauthorized");
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("入力不足なら即時エラー（fetch 前）", async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login({ email: "", password: "" });
      });

      // fetch は呼ばれない
      expect(global.fetch).not.toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.error).toBe("メールアドレスとパスワードを入力してください。");
    });
  });

  describe("logout", () => {
    it("正常系: /api/logout 成功で user をクリア", async () => {
      // 先にログイン状態にしておく
      (fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ ok: true, user: demoUser }),
        }) // login 用
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({}),
        }); // logout 用

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login({ email: "demo@example.com", password: "pass" });
      });
      expect(result.current.user).toEqual(demoUser);

      await act(async () => {
        await result.current.logout();
      });

      expect(global.fetch).toHaveBeenLastCalledWith(
        "/api/logout",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
        })
      );
      expect(result.current.user).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("異常系: /api/logout 失敗で error セット（user はそのままでもOKだが本実装では null にしている）", async () => {
      (fetch as any).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: "Server error" }),
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.error).toBe("Server error");
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("中断(Abort)", () => {
    it("連打で前回を中断しても例外にしない", async () => {
      // 1回目の呼び出しでは AbortError を投げる
      (fetch as any)
        .mockRejectedValueOnce(Object.assign(new Error("Aborted"), { name: "AbortError" }))
        // 2回目は成功
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ ok: true, user: demoUser }),
        });

      const { result } = renderHook(() => useAuth());

      // 1回目 → すぐ 2回目 を呼ぶ想定
      await act(async () => {
        // fire-and-forget で投げつつ
        const p1 = result.current.fetchMe();
        const p2 = result.current.fetchMe();
        await Promise.allSettled([p1, p2]);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.user).toEqual(demoUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });
});
