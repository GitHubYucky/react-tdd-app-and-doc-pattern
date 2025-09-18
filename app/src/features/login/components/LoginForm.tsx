// src/features/login/components/LoginForm.tsx

import { Button } from "@/components/button/button";
import { Input } from "@/components/input/input";

// ※ プレゼンテーション専用（ロジックなし）
type Props = {
    email: string;
    password: string;
    onEmailChange: (v: string) => void;
    onPasswordChange: (v: string) => void;
    onSubmit: () => void;
    loading?: boolean;
    error?: string | null;
    canSubmit?: boolean;
    className?: string;
  };

  export const LoginForm = ({
    email,
    password,
    onEmailChange,
    onPasswordChange,
    onSubmit,
    loading = false,
    error = null,
    canSubmit = true,
    className = "",
  }: Props) => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className={className}
        aria-busy={loading}
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm">
            Email
            <Input
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => onEmailChange(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="text-sm">
            Password
            <Input
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => onPasswordChange(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="••••••••"
              required
            />
          </label>

          {error && (
            <p role="alert" className="text-red-600 text-sm">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={!canSubmit}
            className={`rounded px-4 py-2 text-white ${
              canSubmit ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>
    );
  };
