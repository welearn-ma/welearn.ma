import { readFileSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { EMAIL_PATTERN, isValidEmail, MAX_EMAIL_LENGTH } from "../emailAddress";
import { FORBIDDEN_CHARACTERS, FORBIDDEN_EMAILS, VALID_EMAILS } from "./emailSamples";

describe("isValidEmail (shared rule)", () => {
  it.each(VALID_EMAILS)("accepts %s", (email) => {
    expect(isValidEmail(email)).toBe(true);
  });

  it.each(FORBIDDEN_EMAILS)("rejects %s in the local part", (_label, email) => {
    expect(isValidEmail(email)).toBe(false);
  });

  it.each(FORBIDDEN_CHARACTERS.map((c) => [JSON.stringify(c), `prenom@dom${c}aine.ma`]))(
    "rejects %s in the domain",
    (_label, email) => {
      expect(isValidEmail(email)).toBe(false);
    },
  );

  it.each([
    ["empty", ""],
    ["no @", "prenom.nom.domaine.ma"],
    ["two @", "prenom@nom@domaine.ma"],
    ["nothing before @", "@domaine.ma"],
    ["no dot in the domain", "prenom@domaine"],
    ["dot only at the end of the domain", "prenom@domaine."],
    ["newline", "prenom\nnom@domaine.ma"],
    ["two addresses", "a@domaine.ma,b@domaine.ma"],
    ["name and angle brackets", "Nom <prenom@domaine.ma>"],
    ["group syntax", "g:prenom@domaine.ma;"],
  ])("rejects %s", (_label, email) => {
    expect(isValidEmail(email)).toBe(false);
  });

  it("64 characters maximum (unchanged limit)", () => {
    const domain = "@domaine.ma";
    const at64 = `${"a".repeat(MAX_EMAIL_LENGTH - domain.length)}${domain}`;
    expect(MAX_EMAIL_LENGTH).toBe(64);
    expect(at64).toHaveLength(64);
    expect(isValidEmail(at64)).toBe(true);
    expect(isValidEmail(`a${at64}`)).toBe(false);
  });

  it("the pattern alone does not limit the length (the helper does)", () => {
    expect(EMAIL_PATTERN.test(`${"a".repeat(100)}@domaine.ma`)).toBe(true);
    expect(isValidEmail(`${"a".repeat(100)}@domaine.ma`)).toBe(false);
  });
});

/** Code sans commentaires ni lignes vides, ligne par ligne. */
function codeLines(file: string): string[] {
  return readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*\/\/.*$/, "").trimEnd())
    .filter((line) => line.trim() !== "");
}

describe("frontend copy", () => {
  it("frontend/lib/email.ts has exactly the same code as backend/src/lib/emailAddress.ts", () => {
    const backend = codeLines(path.resolve(__dirname, "../emailAddress.ts"));
    const frontend = codeLines(path.resolve(__dirname, "../../../../frontend/lib/email.ts"));
    expect(backend).toHaveLength(5);
    expect(frontend).toEqual(backend);
  });
});
