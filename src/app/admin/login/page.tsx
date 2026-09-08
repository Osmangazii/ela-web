"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Full-page redirect: no Server Action involved, so no
        // fetchServerAction/runtime conflicts — every Supabase cookie is sent
        // to the server and the router cache cannot leave the button stuck.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- intentional full reload after auth.
        window.location.href = "/admin/events";
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Sign-in failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4 text-brand-green antialiased">
      <div className="w-full max-w-md rounded-3xl border border-brand-pink-light bg-white p-8 shadow-sm md:p-10">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-pink text-sm font-extrabold tracking-wide text-white">
            ela
          </span>
          <span className="text-sm font-extrabold tracking-tight">Admin Portal</span>
        </Link>

        <h1 className="mt-6 text-2xl font-black tracking-tight">Sign in</h1>
        <p className="mt-1 text-sm text-slate-500">Access the ELA content dashboard.</p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-brand-pink"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-brand-pink"
              placeholder="••••••••"
            />
          </div>

          {errorMsg && (
            <p className="rounded-xl border border-brand-pink/40 bg-brand-pink/10 px-4 py-2.5 text-sm font-medium text-brand-green">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-pink px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#ff637b] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
