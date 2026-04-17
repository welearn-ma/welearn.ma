import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getAdminSessionCookieName,
  isAdminAuthConfigured,
  signInAdminWithPassword,
  verifyAdminSessionToken,
} from "@/lib/admin-auth";

async function loginAction(formData: FormData) {
  "use server";

  if (!isAdminAuthConfigured()) {
    redirect("/admin/login?error=config");
  }

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "").trim();
  const next = String(formData.get("next") ?? "").trim();

  const signedIn = await signInAdminWithPassword(email, password);
  if (!signedIn.ok) {
    const code =
      signedIn.reason === "not_admin"
        ? "not_admin"
        : signedIn.reason === "email_not_confirmed"
          ? "email_not_confirmed"
          : signedIn.reason === "config"
            ? "config"
            : "invalid";

    redirect(
      `/admin/login?error=${code}${next ? `&next=${encodeURIComponent(next)}` : ""}`,
    );
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: getAdminSessionCookieName(),
    value: signedIn.accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: signedIn.expiresIn,
  });

  if (next.startsWith("/admin")) {
    redirect(next);
  }

  redirect("/admin");
}

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const error = params.error ?? "";
  const next = params.next ?? "";

  if (isAdminAuthConfigured()) {
    const sessionToken = (await cookies()).get(
      getAdminSessionCookieName(),
    )?.value;
    if (sessionToken) {
      const payload = await verifyAdminSessionToken(sessionToken);
      if (payload) {
        redirect(next.startsWith("/admin") ? next : "/admin");
      }
    }
  }

  const errorMessage =
    error === "invalid"
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

  return (
    <main className="min-h-screen bg-wl-gray-light px-4 py-16">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-wl-border bg-white p-6 shadow-sm">
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

        <form action={loginAction} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next} />

          <label className="block space-y-1">
            <span className="text-sm text-wl-text">Email</span>
            <input
              name="email"
              type="email"
              required
              className="h-10 w-full rounded-md border border-wl-border px-3 text-sm text-wl-text outline-none focus:ring-2 focus:ring-wl-blue/25"
              placeholder="admin@welearn.ma"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm text-wl-text">Mot de passe</span>
            <input
              name="password"
              type="password"
              required
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
    </main>
  );
}
