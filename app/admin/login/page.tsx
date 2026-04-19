"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const ADMIN_EMAIL_STORAGE_KEY = "wl_admin_email";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? "";
  const next = searchParams.get("next") ?? "";
  const logoutRequested = searchParams.get("logout") === "1";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!logoutRequested) {
      return;
    }

    window.localStorage.removeItem(ADMIN_EMAIL_STORAGE_KEY);
  }, [logoutRequested]);

  const errorMessage = useMemo(() => {
    if (logoutRequested) {
      return "Session locale deconnectee. Reconnectez-vous pour continuer.";
    }

    return error === "invalid"
      ? "Identifiants invalides."
      : error === "not_admin"
        ? "Compte authentifie, mais non autorise pour le dashboard admin. Ajoutez votre email dans ADMIN_ALLOWED_EMAILS ou attribuez le role admin dans Supabase."
        : error === "email_not_confirmed"
          ? "Email non confirme dans Supabase Auth. Confirmez l'email puis reessayez."
          : error === "session"
            ? "Session invalide ou expiree. Merci de vous reconnecter."
            : error === "config"
              ? "Configuration Supabase manquante (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)."
              : "";
  }, [error, logoutRequested]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password.trim()) {
      return;
    }

    window.localStorage.setItem(ADMIN_EMAIL_STORAGE_KEY, normalizedEmail);
    const target = next.startsWith("/admin") ? next : "/admin";
    router.push(target);
  };

  return (
    <main className="min-h-screen bg-wl-gray-light px-4 py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-wl-text-secondary transition-colors hover:text-wl-blue"
          >
            &larr; Retour au site
          </Link>
        </div>

        <div className="rounded-2xl border border-wl-border bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-wl-blue">Admin</p>
          <h1 className="mt-1 text-2xl font-semibold text-wl-text">
            Connexion dashboard
          </h1>
          <p className="mt-2 text-sm text-wl-text-secondary">
            Connectez-vous pour acceder au tableau de bord des inscriptions.
          </p>

          {errorMessage ? (
            <p className="mt-4 rounded-lg border border-wl-orange/30 bg-wl-orange-tint px-3 py-2 text-sm text-wl-text-secondary">
              {errorMessage}
            </p>
          ) : null}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block space-y-1">
              <span className="text-sm text-wl-text">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-10 w-full rounded-md border border-wl-border px-3 text-sm text-wl-text outline-none focus:ring-2 focus:ring-wl-blue/25"
                placeholder="admin@welearn.ma"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm text-wl-text">Mot de passe</span>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-10 w-full rounded-md border border-wl-border px-3 text-sm text-wl-text outline-none focus:ring-2 focus:ring-wl-blue/25"
                placeholder="********"
              />
            </label>

            <button
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-wl-blue px-4 text-sm font-medium text-white transition-colors hover:bg-wl-blue-dark"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
