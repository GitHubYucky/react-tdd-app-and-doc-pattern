// src/features/login/type/auth.ts
export type User = {
    id: string;
    email: string;
    name?: string;
  };

  export type LoginPayload = {
    email: string;
    password: string;
  };

  export type AuthResponse =
    | { ok: true; user: User }
    | { ok: false; error: string };
