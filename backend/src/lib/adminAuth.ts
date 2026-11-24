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

/**
 * Seul `app_metadata` fait foi : il n'est modifiable qu'avec la service role
 * key. `user_metadata` est ecrit par l'utilisateur lui-meme (inscription,
 * supabase.auth.updateUser) et ne doit JAMAIS donner de droits.
 */
function isUserAdmin(user: User) {
  return user.app_metadata?.role === "admin";
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
