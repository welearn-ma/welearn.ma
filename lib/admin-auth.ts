import { createClient } from "@supabase/supabase-js";

const SESSION_COOKIE_NAME = "wl_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

type AdminSession = {
  email: string;
};

type AdminSignInResult =
  | {
      ok: true;
      accessToken: string;
      expiresIn: number;
      email: string;
    }
  | {
      ok: false;
      reason: "config" | "invalid" | "not_admin" | "email_not_confirmed";
    };

function getSupabaseAuthConfig() {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "",
  };
}

function getSupabaseAuthClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseAuthConfig();
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isAdminAuthConfigured() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseAuthConfig();
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function getAdminSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

export function getAdminSessionDurationSeconds() {
  return SESSION_DURATION_SECONDS;
}

export async function signInAdminWithPassword(
  email: string,
  password: string,
): Promise<AdminSignInResult> {
  const supabase = getSupabaseAuthClient();
  if (!supabase) {
    return { ok: false, reason: "config" };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session || !data.user) {
    const normalized = String(error?.message ?? "").toLowerCase();
    if (
      normalized.includes("email not confirmed") ||
      normalized.includes("email_not_confirmed")
    ) {
      return { ok: false, reason: "email_not_confirmed" };
    }

    return { ok: false, reason: "invalid" };
  }

  return {
    ok: true,
    accessToken: data.session.access_token,
    expiresIn: data.session.expires_in ?? SESSION_DURATION_SECONDS,
    email: data.user.email ?? email,
  };
}

export async function verifyAdminSessionToken(
  token: string,
): Promise<AdminSession | null> {
  const supabase = getSupabaseAuthClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return null;
  }

  return { email: data.user.email ?? "" };
}
