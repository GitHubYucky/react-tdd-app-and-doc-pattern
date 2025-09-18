// src/features/login/hooks/useAuth.ts
import { useRef, useState } from "react";
import type { User, LoginPayload, AuthResponse } from "../type/auth";
import { apiLogin, apiLogout, apiMe } from "../apis/authApi";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const startFetch = () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    setError(null);
  };
  const finishFetch = () => setLoading(false);

  const fetchMe = async () => {
    startFetch();
    try {
      const me = await apiMe(abortRef.current!.signal);
      setUser(me);
    } catch (e: unknown) {
      if ((e as any)?.name !== "AbortError") {
        const msg = e instanceof Error ? e.message : typeof e === "string" ? e : "通信エラー";
        setError(msg);
        setUser(null);
      }
    } finally {
      finishFetch();
    }
  };

  const login = async (payload: LoginPayload) => {
    startFetch();
    try {
      if (!payload.email || !payload.password) {
        throw new Error("メールアドレスとパスワードを入力してください。");
      }
      const res = (await apiLogin(payload, abortRef.current!.signal)) as AuthResponse;
      if (!("ok" in res) || !res.ok) throw new Error(res && "error" in res ? res.error : "Login failed");
      setUser(res.user);
      setError(null);
      return res.user;
    } catch (e: unknown) {
      if ((e as any)?.name !== "AbortError") {
        const msg = e instanceof Error ? e.message : typeof e === "string" ? e : "通信エラー";
        setError(msg);
        setUser(null);
      }
    } finally {
      finishFetch();
    }
  };

  const logout = async () => {
    startFetch();
    try {
      const res = await apiLogout(abortRef.current!.signal);
      if (!res.ok) throw new Error(res.error);
      setUser(null);
      setError(null);
    } catch (e: unknown) {
      if ((e as any)?.name !== "AbortError") {
        const msg = e instanceof Error ? e.message : typeof e === "string" ? e : "通信エラー";
        setError(msg);
      }
    } finally {
      finishFetch();
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    fetchMe,
    login,
    logout,
  };
};
