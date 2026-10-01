"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка входа");
      router.push(from);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
      <h1 className="font-serif text-2xl text-[#1c3d3a]">Вход в админку</h1>
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <label className="block space-y-1">
        <span className="text-sm text-stone-600">Пароль</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-stone-200 px-3 py-2 outline-none focus:border-[#1c3d3a]"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#1c3d3a] py-2.5 text-sm font-medium text-white hover:bg-[#16302e] disabled:opacity-50"
      >
        {loading ? "Вход…" : "Войти"}
      </button>
      <Link href="/" className="block text-center text-sm text-stone-500 hover:text-stone-700">
        ← На главную
      </Link>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-4 py-16">
      <Suspense fallback={<p className="text-stone-500">Загрузка…</p>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
