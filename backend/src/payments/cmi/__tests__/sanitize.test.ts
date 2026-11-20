import { describe, expect, it } from "vitest";
import {
  buildSignedFields,
  containsDocumentWord,
  isBillToKey,
  plaintextFromValues,
  sanitizeBillTo,
  sha512Base64,
} from "..";

const KEY = "TEST_ONLY_KEY";
const ALLOWED = /^[A-Za-z0-9 _-]*$/;

describe("sanitizeBillTo", () => {
  it("strips accents: no accented or non-ASCII character left", () => {
    const cleaned = sanitizeBillTo("Éric Benjelloun-Çalı");
    expect(cleaned).toBe("Eric Benjelloun-Cali");
    expect(cleaned).toMatch(ALLOWED);
    expect([...cleaned].every((char) => char.charCodeAt(0) < 0x80)).toBe(true);
  });

  it("maps common letters without decomposition", () => {
    expect(sanitizeBillTo("Søren Œuvre Straße")).toBe("Soren OEuvre Strasse");
  });

  it("removes punctuation and trims", () => {
    expect(sanitizeBillTo("  O'Brien & Co. ")).toBe("OBrien  Co");
  });

  it("returns an empty string for a non-Latin-script name", () => {
    expect(sanitizeBillTo("محمد العلوي")).toBe("");
  });
});

describe("helpers", () => {
  it("isBillToKey matches any BillTo* field, case-insensitively", () => {
    expect(isBillToKey("BillToName")).toBe(true);
    expect(isBillToKey("BillTocompany")).toBe(true);
    expect(isBillToKey("billtocity")).toBe(true);
    expect(isBillToKey("email")).toBe(false);
  });

  it("containsDocumentWord is case-insensitive", () => {
    expect(containsDocumentWord("documentation@example.test")).toBe(true);
    expect(containsDocumentWord("Jean DOCUMENT")).toBe(true);
    expect(containsDocumentWord("jean.dupont@example.test")).toBe(false);
  });
});

describe("buildSignedFields applies sanitizeBillTo to the posted value", () => {
  it("posted BillTo* value == hashed value", () => {
    const fields = buildSignedFields(
      { BillToName: " Éric Çalı ", BillToCity: "Fès", email: " a@b.test " },
      KEY,
    );
    const posted = Object.fromEntries(fields);

    expect(posted.BillToName).toBe("Eric Cali");
    expect(posted.BillToCity).toBe("Fes");
    expect(posted.email).toBe("a@b.test");
    expect(posted.HASH).toBe(
      sha512Base64(
        plaintextFromValues(
          { BillToCity: "Fes", BillToName: "Eric Cali", email: "a@b.test" },
          KEY,
        ),
      ),
    );
  });
});
