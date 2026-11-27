import { readFileSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { MOROCCO_UTC0_SINCE } from "../emails";

/*
 * Heure de Casablanca : meme regle cote e-mails (backend/src/commerce/emails.ts)
 * et cote site / admin (frontend/lib/casablanca-time.ts). Le frontend n'a pas
 * de lanceur de tests : on compare ici la ligne qui porte l'instant de
 * bascule UTC+1 -> UTC+0.
 */

const SWITCH_LINE = 'export const MOROCCO_UTC0_SINCE = Date.parse("2026-09-20T01:00:00.000Z");';

describe("Casablanca time rule, backend and frontend", () => {
  it("switch to UTC+0 on 20/09/2026 01:00 UTC", () => {
    expect(MOROCCO_UTC0_SINCE).toBe(Date.parse("2026-09-20T01:00:00.000Z"));
  });

  it("frontend/lib/casablanca-time.ts declares the same switch instant", () => {
    const backend = readFileSync(path.resolve(__dirname, "../emails.ts"), "utf8");
    const frontend = readFileSync(
      path.resolve(__dirname, "../../../../frontend/lib/casablanca-time.ts"),
      "utf8",
    );
    expect(backend).toContain(SWITCH_LINE);
    expect(frontend).toContain(SWITCH_LINE);
  });
});
