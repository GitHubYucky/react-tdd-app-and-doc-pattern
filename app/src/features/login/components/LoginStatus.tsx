// src/features/login/components/LoginStatus.tsx
// ※ プレゼンテーション専用（ロジックなし）
import type { User } from "../type/auth";

type Props = {
  user: User | null;
  loading?: boolean;
  error?: string | null;
  onLogout: () => void;
  className?: string;
};

export const LoginStatus = ({
  user,
  loading = false,
  error = null,
  onLogout,
  className = "",
}: Props) => {
  if (loading) return <p className={className}>Checking session...</p>;
  if (!user)
    return (
      <p className={className}>
        Not signed in{error ? `: ${error}` : ""}
      </p>
    );

  return (
    <div className={className}>
      <span className="mr-2">
        Signed in as <strong>{user.email}</strong>
      </span>
      <button onClick={onLogout} className="rounded px-3 py-1 border hover:bg-gray-50">
        Sign out
      </button>
    </div>
  );
};
