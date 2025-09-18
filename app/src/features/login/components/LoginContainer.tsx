// src/features/login/components/LoginContainer.tsx
// hooks を束ねてプレゼンテーションに渡すだけ（軽い仲介。ロジックは hooks 側）
import { Button } from "@/components/button/button";
import { useAuth } from "../hooks/useAuth";
import { useLoginForm } from "../hooks/useLoginForm";
import { LoginForm } from "./LoginForm";
import { LoginStatus } from "./LoginStatus";

type Props = {
  onSuccess?: () => void;
  className?: string;
};

export const LoginContainer = ({ onSuccess, className = "" }: Props) => {
  const { user, loading, error, logout, fetchMe } = useAuth();
  const { email, password, setEmail, setPassword, handleSubmit, canSubmit, loading: formLoading, error: formError } =
    useLoginForm({ onSuccess });

  // ここは“束ね”だけ。view には値とコールバックを渡す
  return (
    <div className={className}>
      <LoginForm
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        loading={formLoading}
        error={formError}
        canSubmit={canSubmit}
      />
      <div className="mt-6">
        <LoginStatus user={user} loading={loading} error={error} onLogout={logout} />
        {/* 必要ならセッション再同期ボタンもプレゼンテーションで */}
        <Button
          type="button"
          onClick={() => fetchMe()}
          className="mt-2 text-sm underline"
        >
          Re-sync session
        </Button>
      </div>
    </div>
  );
};
