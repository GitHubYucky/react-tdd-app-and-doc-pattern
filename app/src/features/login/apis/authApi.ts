// src/features/login/apis/authApi.ts
// ダミーAPI版（そのまま動作確認用）
// 資格情報: demo@example.com / pass

import type { AuthResponse, LoginPayload, User } from "../type/auth";

let sessionUser: User | null = null;

// AbortSignalを尊重しつつ軽い遅延を入れる（実APIっぽく）
const delay = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const id = setTimeout(() => resolve(), ms);
    if (signal) {
      const onAbort = () => {
        clearTimeout(id);
        reject(new DOMException("Aborted", "AbortError"));
      };
      signal.addEventListener("abort", onAbort, { once: true });
    }
  });

export const apiMe = async (signal?: AbortSignal): Promise<User | null> => {
  await delay(200, signal);
  return sessionUser; // 未ログインなら null
};

export const apiLogin = async (
  payload: LoginPayload,
  signal?: AbortSignal
): Promise<AuthResponse> => {
  await delay(300, signal);

  const { email, password } = payload;
  if (email === "demo@example.com" && password === "pass") {
    sessionUser = { id: "u1", email: "demo@example.com", name: "Demo" };
    return { ok: true, user: sessionUser };
  }

  return { ok: false, error: "Invalid credentials" };
};

export const apiLogout = async (
  signal?: AbortSignal
): Promise<{ ok: true } | { ok: false; error: string }> => {
  await delay(150, signal);
  sessionUser = null;
  return { ok: true };
};
