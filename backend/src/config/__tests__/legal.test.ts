import { readFileSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

/**
 * orders.cgv_version doit designer la version des CGV publiee sur le site :
 * CGV_VERSION (backend) === CGV_LAST_UPDATED (frontend/data/legal.ts).
 * Les deux fichiers sont lus tels quels (le backend ne peut pas importer le
 * frontend).
 */

const BACKEND_LEGAL = path.resolve(__dirname, "../legal.ts");
const FRONTEND_LEGAL = path.resolve(__dirname, "../../../../frontend/data/legal.ts");

/** Valeur de `export const <name> = "<valeur>";` ; exactement une occurrence. */
function readStringConstant(file: string, name: string): string {
  const source = readFileSync(file, "utf8");
  const matches = [
    ...source.matchAll(new RegExp(`export const ${name}\\s*=\\s*"([^"]*)"\\s*;`, "g")),
  ];
  expect(matches, `${name} in ${file}`).toHaveLength(1);
  return matches[0][1];
}

describe("CGV version", () => {
  it("backend CGV_VERSION matches frontend CGV_LAST_UPDATED", () => {
    const backend = readStringConstant(BACKEND_LEGAL, "CGV_VERSION");
    const frontend = readStringConstant(FRONTEND_LEGAL, "CGV_LAST_UPDATED");

    expect(backend).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    expect(backend).toBe(frontend);
  });
});

describe("contact phone", () => {
  it("backend CONTACT_PHONE matches frontend legalEntity.phone", () => {
    const backend = readStringConstant(BACKEND_LEGAL, "CONTACT_PHONE");
    const frontendSource = readFileSync(FRONTEND_LEGAL, "utf8");
    const frontend = /export const legalEntity = \{[^}]*?\bphone:\s*"([^"]*)"/.exec(frontendSource)?.[1];

    expect(backend).toMatch(/^\+212 /);
    expect(backend).toBe(frontend);
  });
});
