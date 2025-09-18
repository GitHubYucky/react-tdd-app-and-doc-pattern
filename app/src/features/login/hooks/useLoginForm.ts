// src/features/login/hooks/useLoginForm.ts
import { useState, FormEvent } from "react";
import type { LoginPayload } from "../type/auth";
import { useAuth } from "./useAuth";

/** ログイン画面の入力・送信ロジックを集約（コンポーネントは使わない） */
export const useLoginForm = (opts?: { onSuccess?: () => void }) => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = !loading && email.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    const payload: LoginPayload = { email, password };
    const user = await login(payload);
    if (user && opts?.onSuccess) opts.onSuccess();
  };

  return {
    // state for view
    email,
    password,
    loading,
    error,
    canSubmit,

    // handlers for view
    setEmail,
    setPassword,
    handleSubmit,
  };
};
