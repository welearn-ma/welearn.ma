import { describe, expect, it } from "vitest";
import {
  CODE_ALPHABET,
  CODE_PATTERN,
  codeRejection,
  generateCode,
  normalizeCode,
  priceOrder,
} from "../codes";
import type { CodeRecord, ProductRecord } from "../types";

const NOW = new Date("2026-11-24T10:00:00.000Z");

const PRO: ProductRecord = {
  slug: "bim-foundations-pro",
  label: "BIM Foundations Professional — Pack Professionnels",
  amount_mad: 8500,
  active: true,
  page_slug: "bim-foundations-professional",
  requires_student_code: false,
};
const STUDENT: ProductRecord = {
  ...PRO,
  slug: "bim-foundations-etudiant",
  label: "BIM Foundations Professional — Pack Étudiants",
  amount_mad: 5000,
  requires_student_code: true,
};
const TEST: ProductRecord = {
  slug: "test-paiement-cmi",
  label: "Test paiement CMI",
  amount_mad: 10,
  active: true,
  page_slug: null,
  requires_student_code: false,
};

function code(overrides: Partial<CodeRecord> = {}): CodeRecord {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    code: "WL-ABCD-EFGH",
    kind: "discount",
    percent_off: 5,
    product_slug: null,
    customer_email: "client@example.test",
    max_uses: 1,
    used_count: 0,
    expires_at: "2026-12-24T10:00:00.000Z",
    revoked_at: null,
    created_by: "charif@example.test",
    student_proof_id: null,
    created_at: "2026-11-24T09:00:00.000Z",
    ...overrides,
  };
}

const studentCode = (overrides: Partial<CodeRecord> = {}) =>
  code({ kind: "student", percent_off: null, product_slug: STUDENT.slug, ...overrides });

describe("generateCode / format", () => {
  it("produces WL-XXXX-XXXX from the unambiguous alphabet only", () => {
    expect(CODE_ALPHABET).not.toMatch(/[0O1I]/);
    expect(CODE_ALPHABET).toHaveLength(32);
    const seen = new Set<string>();
    for (let i = 0; i < 2000; i += 1) {
      const value = generateCode();
      expect(value).toMatch(CODE_PATTERN);
      expect(value.slice(3)).not.toMatch(/[0O1I]/);
      seen.add(value);
    }
    expect(seen.size).toBe(2000);
  });

  it("normalizes customer input", () => {
    expect(normalizeCode("WL-ABCD-EFGH")).toBe("WL-ABCD-EFGH");
    expect(normalizeCode("  wl-abcd-efgh ")).toBe("WL-ABCD-EFGH");
    expect(normalizeCode("WLABCDEFGH")).toBe("WL-ABCD-EFGH");
    expect(normalizeCode("wl abcd efgh")).toBe("WL-ABCD-EFGH");
  });

  it.each([
    ["ambiguous 0", "WL-ABC0-EFGH"],
    ["ambiguous O", "WL-ABCO-EFGH"],
    ["ambiguous 1", "WL-ABC1-EFGH"],
    ["ambiguous I", "WL-ABCI-EFGH"],
    ["too short", "WL-ABC-EFGH"],
    ["wrong prefix", "XX-ABCD-EFGH"],
    ["accent", "WL-ÀBCD-EFGH"],
    ["empty", ""],
    ["too long", `WL-ABCD-EFGH${" ".repeat(80)}`],
  ])("rejects %s", (_label, input) => {
    expect(normalizeCode(input)).toBeNull();
  });
});

describe("codeRejection — validity rules", () => {
  const ctx = (product: ProductRecord, email = "client@example.test", now = NOW) => ({
    product,
    email,
    now,
  });

  it("accepts a valid discount code on the pro pack", () => {
    expect(codeRejection(code(), ctx(PRO))).toBeNull();
  });

  it("binds the code to the email, case-insensitively", () => {
    expect(codeRejection(code(), ctx(PRO, "  Client@Example.TEST "))).toBeNull();
    expect(codeRejection(code(), ctx(PRO, "other@example.test"))).toBe("email_mismatch");
  });

  it("expires at expires_at (exclusive)", () => {
    expect(codeRejection(code(), ctx(PRO, undefined, new Date("2026-12-24T09:59:59.999Z")))).toBeNull();
    expect(codeRejection(code(), ctx(PRO, undefined, new Date("2026-12-24T10:00:00.000Z")))).toBe("expired");
    expect(codeRejection(code({ expires_at: "not a date" }), ctx(PRO))).toBe("expired");
  });

  it("refuses revoked codes", () => {
    expect(codeRejection(code({ revoked_at: "2026-11-24T09:30:00.000Z" }), ctx(PRO))).toBe("revoked");
  });

  it("refuses codes whose uses are exhausted", () => {
    expect(codeRejection(code({ used_count: 1, max_uses: 1 }), ctx(PRO))).toBe("used_up");
    expect(codeRejection(code({ used_count: 1, max_uses: 2 }), ctx(PRO))).toBeNull();
  });

  it("discount codes: never on the test product nor on the student pack", () => {
    expect(codeRejection(code(), ctx(TEST))).toBe("product_mismatch");
    expect(codeRejection(code(), ctx(STUDENT))).toBe("product_mismatch");
  });

  it("discount codes bound to a product only apply to it", () => {
    expect(codeRejection(code({ product_slug: PRO.slug }), ctx(PRO))).toBeNull();
    const other = { ...PRO, slug: "autre-formation" };
    expect(codeRejection(code({ product_slug: PRO.slug }), ctx(other))).toBe("product_mismatch");
    expect(codeRejection(code(), ctx(other))).toBeNull();
  });

  it("student codes: only their student product", () => {
    expect(codeRejection(studentCode(), ctx(STUDENT))).toBeNull();
    expect(codeRejection(studentCode(), ctx(PRO))).toBe("product_mismatch");
    expect(codeRejection(studentCode(), ctx(TEST))).toBe("product_mismatch");
    // Produit qui n'exige plus de code etudiant : refuse.
    expect(codeRejection(studentCode(), ctx({ ...STUDENT, requires_student_code: false }))).toBe(
      "product_mismatch",
    );
  });
});

describe("priceOrder — server-side amount", () => {
  it("5 % off 8 500,00 → 8 075,00", () => {
    expect(priceOrder(8500, code())).toEqual({
      list_amount_mad: 8500,
      discount_mad: 425,
      amount_mad: 8075,
    });
  });

  it("no code → list price", () => {
    expect(priceOrder(8500, null)).toEqual({ list_amount_mad: 8500, discount_mad: 0, amount_mad: 8500 });
  });

  it("student code → no discount (5 000,00 stays 5 000,00)", () => {
    expect(priceOrder(5000, studentCode())).toEqual({
      list_amount_mad: 5000,
      discount_mad: 0,
      amount_mad: 5000,
    });
  });

  it("rounds half up to the cent, computed in integer cents", () => {
    // 10,10 x 0,95 = 9,595 -> 9,60
    expect(priceOrder(10.1, code())).toEqual({ list_amount_mad: 10.1, discount_mad: 0.5, amount_mad: 9.6 });
    // 10,30 x 0,95 = 9,785 -> 9,79
    expect(priceOrder(10.3, code())).toEqual({ list_amount_mad: 10.3, discount_mad: 0.51, amount_mad: 9.79 });
    // 0,01 x 0,95 = 0,0095 -> 0,01
    expect(priceOrder(0.01, code()).amount_mad).toBe(0.01);
    // Pourcentage a 2 decimales : 12,50 % de 99,99 = 87,49125 -> 87,49
    expect(priceOrder(99.99, code({ percent_off: 12.5 })).amount_mad).toBe(87.49);
  });

  it("amount = list - discount exactly (orders_amount_consistency)", () => {
    for (const list of [8500, 5000, 10, 10.1, 1234.56, 99999.99]) {
      const pricing = priceOrder(list, code());
      expect(Math.round(pricing.list_amount_mad * 100) - Math.round(pricing.discount_mad * 100)).toBe(
        Math.round(pricing.amount_mad * 100),
      );
    }
  });
});
