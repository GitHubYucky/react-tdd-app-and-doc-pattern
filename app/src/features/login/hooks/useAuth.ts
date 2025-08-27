// src/features/login/hooks/useAuth.ts
import { useRef, useState } from "react";

// 使い回し用の型（必要に応じて別ファイルへ）
// src/features/login/types/auth.ts などに切り出してOK
export type User = {
  id: string;
  email: string;
  name?: string;
  // roles?: string[];
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse =
  | { ok: true; user: User }
  | { ok: false; error: string };

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 連打対策：直前のリクエストを中断するためのコントローラ
  const abortRef = useRef<AbortController | null>(null);

  const startFetch = () => {
    // 直前を中断
    abortRef.current?.abort();
    // 新しいコントローラに差し替え
    abortRef.current = new AbortController();
    setLoading(true);
    setError(null);
  };

  const finishFetch = () => {
    setLoading(false);
  };

  /** /api/me でセッション確認（初期化・再同期用） */
  const fetchMe = async () => {
    startFetch();
    try {
      const res = await fetch("/api/me", {
        method: "GET",
        signal: abortRef.current!.signal,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 204) {
        // 未ログイン
        setUser(null);
        return;
      }

      // API側は { ok:true, user } or 200で user をそのまま返す想定、どちらでも吸収
      const data = (await res.json()) as AuthResponse | User;

      if ("ok" in (data as AuthResponse)) {
        const ar = data as AuthResponse;
        if (ar.ok) setUser(ar.user);
        else {
          setUser(null);
          setError(ar.error || "Unauthorized");
        }
      } else {
        setUser(data as User);
      }
    } catch (e: unknown) {
      if ((e as any)?.name === "AbortError") return;
      const msg =
        e instanceof Error ? e.message : typeof e === "string" ? e : "通信エラー";
      setError(msg);
      setUser(null);
    } finally {
      finishFetch();
    }
  };

  /** /api/login でログイン */
  const login = async (payload: LoginPayload) => {
    startFetch();
    try {
      if (!payload.email || !payload.password) {
        throw new Error("メールアドレスとパスワードを入力してください。");
      }

      const res = await fetch("/api/login", {
        method: "POST",
        signal: abortRef.current!.signal,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // 422/401 など
        const err = (await res.json().catch(() => ({}))) as {
          error?: string;
          message?: string;
        };
        throw new Error(err.error || err.message || `Login failed: ${res.status}`);
      }

      const data = (await res.json()) as AuthResponse;
      if (!data.ok) {
        throw new Error(data.error || "Login failed");
      }

      setUser(data.user);
      setError(null);
      return data.user;
    } catch (e: unknown) {
      if ((e as any)?.name === "AbortError") return;
      const msg =
        e instanceof Error ? e.message : typeof e === "string" ? e : "通信エラー";
      setError(msg);
      setUser(null);
    } finally {
      finishFetch();
    }
  };

  /** /api/logout でログアウト */
  const logout = async () => {
    startFetch();
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        signal: abortRef.current!.signal,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as {
          error?: string;
          message?: string;
        };
        throw new Error(err.error || err.message || `Logout failed: ${res.status}`);
      }

      setUser(null);
      setError(null);
    } catch (e: unknown) {
      if ((e as any)?.name === "AbortError") return;
      const msg =
        e instanceof Error ? e.message : typeof e === "string" ? e : "通信エラー";
      setError(msg);
    } finally {
      finishFetch();
    }
  };

  return {
    // state
    user,
    loading,
    error,
    isAuthenticated: !!user,

    // actions
    fetchMe,
    login,
    logout,
  };
};
