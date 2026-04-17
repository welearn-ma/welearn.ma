const SESSION_COOKIE_NAME = "wl_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

type SessionPayload = {
  email: string;
  exp: number;
};

function toBase64Url(value: string): string {
  return btoa(value)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  const padded = padding
    ? `${normalized}${"=".repeat(4 - padding)}`
    : normalized;
  return atob(padded);
}

function encodePayload(payload: SessionPayload): string {
  return toBase64Url(JSON.stringify(payload));
}

function decodePayload(payload: string): SessionPayload | null {
  try {
    const parsed = JSON.parse(fromBase64Url(payload)) as SessionPayload;
    if (!parsed?.email || !parsed?.exp) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );

  const raw = Array.from(new Uint8Array(signature))
    .map((value) => String.fromCharCode(value))
    .join("");

  return btoa(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function getAdminConfig() {
  return {
    adminEmail: process.env.ADMIN_EMAIL?.trim() ?? "",
    adminPassword: process.env.ADMIN_PASSWORD?.trim() ?? "",
    sessionSecret: process.env.ADMIN_SESSION_SECRET?.trim() ?? "",
  };
}

export function getAdminSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

export function getAdminSessionDurationSeconds() {
  return SESSION_DURATION_SECONDS;
}

export async function createAdminSessionToken(
  email: string,
  sessionSecret: string,
): Promise<string> {
  const payload: SessionPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
  };
  const encodedPayload = encodePayload(payload);
  const signature = await sign(encodedPayload, sessionSecret);
  return `${encodedPayload}.${signature}`;
}

export async function verifyAdminSessionToken(
  token: string,
  sessionSecret: string,
): Promise<SessionPayload | null> {
  const [encodedPayload, providedSignature] = token.split(".");
  if (!encodedPayload || !providedSignature) {
    return null;
  }

  const expectedSignature = await sign(encodedPayload, sessionSecret);
  if (providedSignature !== expectedSignature) {
    return null;
  }

  const payload = decodePayload(encodedPayload);
  if (!payload) {
    return null;
  }

  if (payload.exp <= Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}
