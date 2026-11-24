import { beforeEach, describe, expect, it, vi } from "vitest";

const getUser = vi.fn();
vi.mock("../supabaseClient", () => ({ supabase: { auth: { getUser } } }));

const { validateAdminAccessToken } = await import("../adminAuth");

function userWith(meta: {
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}) {
  return {
    data: {
      user: {
        id: "00000000-0000-0000-0000-000000000001",
        email: " Admin@Example.Test ",
        app_metadata: meta.app_metadata ?? {},
        user_metadata: meta.user_metadata ?? {},
      },
    },
    error: null,
  };
}

describe("validateAdminAccessToken — role from app_metadata only", () => {
  beforeEach(() => getUser.mockReset());

  it("accepts app_metadata.role === 'admin' and normalizes the email", async () => {
    getUser.mockResolvedValue(userWith({ app_metadata: { role: "admin" } }));
    await expect(validateAdminAccessToken("token")).resolves.toEqual({
      ok: true,
      email: "admin@example.test",
    });
  });

  it.each([
    ["user_metadata.role = admin", { user_metadata: { role: "admin" } }],
    ["user_metadata.is_admin = true", { user_metadata: { is_admin: true } }],
    ["app_metadata.is_admin = true", { app_metadata: { is_admin: true } }],
    ["app_metadata.role = 'Admin' (exact value required)", { app_metadata: { role: "Admin" } }],
    ["app_metadata.role = 'editor'", { app_metadata: { role: "editor" } }],
    ["no metadata", {}],
  ])("rejects %s", async (_label, meta) => {
    getUser.mockResolvedValue(userWith(meta));
    await expect(validateAdminAccessToken("token")).resolves.toEqual({
      ok: false,
      reason: "not_admin",
    });
  });

  it("rejects a missing token without calling Supabase", async () => {
    await expect(validateAdminAccessToken("")).resolves.toEqual({
      ok: false,
      reason: "missing_token",
    });
    expect(getUser).not.toHaveBeenCalled();
  });

  it("rejects an invalid token", async () => {
    getUser.mockResolvedValue({ data: { user: null }, error: { message: "bad jwt" } });
    await expect(validateAdminAccessToken("token")).resolves.toEqual({
      ok: false,
      reason: "invalid_token",
    });
  });
});
