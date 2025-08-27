// src/features/login/apis/auth.ts
export type MeResponse = { user: { sub: number; email: string; name: string } };

const toJson = async <T>(r: Response): Promise<T> => {
  if (!r.ok) throw new Error(await r.text().catch(() => `HTTP ${r.status}`));
  return r.json() as Promise<T>;
};

export const AuthAPI = {
  login: (email: string, password: string) =>
    fetch(`/api/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then(res => toJson<{ ok: true }>(res)),

  logout: () =>
    fetch(`/api/logout`, {
      method: "POST",
      credentials: "include",
    }).then(res => toJson<{ ok: true }>(res)),

  me: () =>
    fetch(`/api/me`, {
      credentials: "include",
    }).then(res => toJson<MeResponse>(res)),
};
