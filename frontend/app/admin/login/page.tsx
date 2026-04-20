"use client";

import Link from "next/link";
import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyAdminSession } from "@/lib/api/admin-session";
import { signInAdminWithPassword } from "@/lib/admin-auth";
import {
  ADMIN_ACCESS_TOKEN_STORAGE_KEY,
  ADMIN_EMAIL_STORAGE_KEY,
  clearAdminSessionStorage,
} from "@/lib/admin-session-storage";

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? "";
  const next = searchParams.get("next") ?? "";
  const logoutRequested = searchParams.get("logout") === "1";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!logoutRequested) {
      return;
    }

    clearAdminSessionStorage();
  }, [logoutRequested]);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (logoutRequested) {
        return;
      }

      const token =
        window.localStorage.getItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY)?.trim() ??
        "";

      if (!token) {
        return;
      }

      const session = await verifyAdminSession(token);
      if (!isMounted || !session.ok) {
        return;
      }

      const target = next.startsWith("/admin") ? next : "/admin";
      router.replace(target);
    };

    void run();

    return () => {
      isMounted = false;
    };
  }, [logoutRequested, next, router]);

  const errorMessage = useMemo(() => {
    if (logoutRequested) {
      return "Session locale deconnectee. Reconnectez-vous pour continuer.";
    }

    return error === "invalid"
      ? "Identifiants invalides."
      : error === "not_admin"
        ? "Compte authentifie, mais non autorise pour le dashboard admin. Veuillez attribuer le role admin dans Supabase."
        : error === "email_not_confirmed"
          ? "Email non confirme dans Supabase Auth. Confirmez l'email puis reessayez."
          : error === "session"
            ? "Session invalide ou expiree. Merci de vous reconnecter."
            : error === "config"
              ? "Configuration Supabase manquante (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)."
              : "";
  }, [error, logoutRequested]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password.trim()) {
      setFormError("Veuillez renseigner un email et un mot de passe.");
      return;
    }

    setSubmitting(true);

    const signIn = await signInAdminWithPassword(normalizedEmail, password);

    if (!signIn.ok) {
      const message =
        signIn.reason === "config"
          ? "Configuration Supabase manquante (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)."
          : signIn.reason === "email_not_confirmed"
            ? "Email non confirme dans Supabase Auth. Confirmez l'email puis reessayez."
            : "Identifiants invalides.";

      setFormError(message);
      setSubmitting(false);
      return;
    }

    const session = await verifyAdminSession(signIn.accessToken);

    if (!session.ok) {
      clearAdminSessionStorage();

      const message =
        session.reason === "not_admin"
          ? "Compte authentifie, mais non autorise pour le dashboard admin."
          : session.reason === "network"
            ? "Impossible de verifier la session admin (reseau/CORS)."
            : "Session invalide ou expiree. Merci de vous reconnecter.";

      setFormError(message);
      setSubmitting(false);
      return;
    }

    window.localStorage.setItem(
      ADMIN_ACCESS_TOKEN_STORAGE_KEY,
      signIn.accessToken,
    );
    window.localStorage.setItem(ADMIN_EMAIL_STORAGE_KEY, session.email);
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

          {formError ? (
            <p className="mt-4 rounded-lg border border-wl-orange/30 bg-wl-orange-tint px-3 py-2 text-sm text-wl-text-secondary">
              {formError}
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
              disabled={submitting}
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-wl-blue px-4 text-sm font-medium text-white transition-colors hover:bg-wl-blue-dark"
            >
              {submitting ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginContent />
    </Suspense>
  );
}
