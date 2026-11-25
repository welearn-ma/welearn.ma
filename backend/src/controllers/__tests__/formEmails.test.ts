import type { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { FORBIDDEN_EMAILS, PLUS_TAG_EMAIL } from "../../lib/__tests__/emailSamples";
import { requestBrochure } from "../brochureController";
import { createRegistration } from "../registrationController";
import { createSponsor } from "../sponsorController";

/**
 * Formulaires brochure, inscription et sponsoring : regle e-mail partagee
 * (src/lib/emailAddress.ts). La validation precede toute ecriture : Supabase
 * ne doit jamais etre appele.
 */

const { untouched } = vi.hoisted(() => ({
  untouched: vi.fn(() => {
    throw new Error("Supabase must not be called");
  }),
}));
vi.mock("../../lib/supabaseClient", () => ({
  supabase: { from: untouched, storage: { from: untouched }, auth: { getUser: untouched } },
}));

type Handler = (req: Request, res: Response) => Promise<unknown>;

function fakeResponse() {
  const res = {
    statusCode: 0,
    body: undefined as unknown,
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(body: unknown) {
      res.body = body;
      return res;
    },
  };
  return res;
}

async function run(handler: Handler, body: Record<string, unknown>) {
  const res = fakeResponse();
  await handler({ body, headers: {} } as unknown as Request, res as unknown as Response);
  return res;
}

const FORMS: Array<[string, Handler, Record<string, unknown>, unknown, string]> = [
  [
    "brochure",
    requestBrochure as unknown as Handler,
    { fullName: "Nom", formationSlug: "mastere-bim" },
    { ok: false, message: "email format is invalid" },
    "phone is required",
  ],
  [
    "registration",
    createRegistration as unknown as Handler,
    { fullName: "Nom", formationSlug: "mastere-bim", formationTitle: "Mastère BIM" },
    { success: false, message: "email format is invalid" },
    "phone is required",
  ],
  [
    "sponsoring",
    createSponsor as unknown as Handler,
    {
      nom: "Nom",
      prenom: "Prenom",
      entreprise: "Entreprise",
      telephone: "+212 600 000 000",
      formations: ["formation-inconnue"],
    },
    { success: false, message: "email format is invalid" },
    "formation inconnue: formation-inconnue",
  ],
];

describe.each(FORMS)("%s form: e-mail format (shared rule)", (_name, handler, base, refused, nextMessage) => {
  it.each(FORBIDDEN_EMAILS)("refuses %s → 400, nothing written", async (_label, email) => {
    const res = await run(handler, { ...base, email });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(refused);
    expect(untouched).not.toHaveBeenCalled();
  });

  it("refuses an address over 64 characters (limit now applied here too)", async () => {
    const res = await run(handler, { ...base, email: `${"a".repeat(54)}@domaine.ma` });
    expect(res.body).toEqual(refused);
  });

  it(`accepts ${PLUS_TAG_EMAIL} (the next check is reached)`, async () => {
    const res = await run(handler, { ...base, email: PLUS_TAG_EMAIL });
    expect((res.body as { message?: string }).message).toBe(nextMessage);
    expect(untouched).not.toHaveBeenCalled();
  });
});
