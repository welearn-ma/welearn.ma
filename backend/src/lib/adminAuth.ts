import { User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

type AdminAccessResult =
  | {
      ok: true;
      email: string;
    }
  | {
      ok: false;
      reason: "missing_token" | "invalid_token" | "not_admin";
    };

function isUserAdmin(user: User) {
  const appRole = String(user.app_metadata?.role ?? "").toLowerCase();
  const userRole = String(user.user_metadata?.role ?? "").toLowerCase();
  const appIsAdmin = user.app_metadata?.is_admin === true;
  const userIsAdmin = user.user_metadata?.is_admin === true;

  return (
    appRole === "admin" || userRole === "admin" || appIsAdmin || userIsAdmin
  );
}

export function getBearerToken(authorizationHeader?: string) {
  if (!authorizationHeader) {
    return "";
  }

  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return "";
  }

  return token.trim();
}

export async function validateAdminAccessToken(
  token: string,
): Promise<AdminAccessResult> {
  if (!token) {
    return { ok: false, reason: "missing_token" };
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return { ok: false, reason: "invalid_token" };
  }

  if (!isUserAdmin(data.user)) {
    return { ok: false, reason: "not_admin" };
  }

  return {
    ok: true,
    email: String(data.user.email ?? "")
      .trim()
      .toLowerCase(),
  };
}
