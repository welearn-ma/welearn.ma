import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createAdminSessionToken,
  getAdminConfig,
  getAdminSessionCookieName,
  getAdminSessionDurationSeconds,
  verifyAdminSessionToken,
} from "@/lib/admin-auth";

async function loginAction(formData: FormData) {
  "use server";

  const { adminEmail, adminPassword, sessionSecret } = getAdminConfig();
  if (!adminEmail || !adminPassword || !sessionSecret) {
    redirect("/admin/login?error=config");
  }

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "").trim();
  const next = String(formData.get("next") ?? "").trim();

  if (email !== adminEmail.toLowerCase() || password !== adminPassword) {
    redirect(
      `/admin/login?error=invalid${next ? `&next=${encodeURIComponent(next)}` : ""}`,
    );
  }

  const token = await createAdminSessionToken(email, sessionSecret);

  const cookieStore = await cookies();
  cookieStore.set({
    name: getAdminSessionCookieName(),
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getAdminSessionDurationSeconds(),
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
  const { sessionSecret } = getAdminConfig();
  const params = (await searchParams) ?? {};
  const error = params.error ?? "";
  const next = params.next ?? "";

  if (sessionSecret) {
    const sessionToken = (await cookies()).get(
      getAdminSessionCookieName(),
    )?.value;
    if (sessionToken) {
      const payload = await verifyAdminSessionToken(
        sessionToken,
        sessionSecret,
      );
      if (payload) {
        redirect(next.startsWith("/admin") ? next : "/admin");
      }
    }
  }

  const errorMessage =
    error === "invalid"
      ? "Identifiants invalides."
      : error === "session"
        ? "Session invalide ou expiree. Merci de vous reconnecter."
        : error === "config"
          ? "Configuration admin manquante (ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_SESSION_SECRET)."
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
