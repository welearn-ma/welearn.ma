import { describe, expect, it } from "vitest";
import {
  amountToCents,
  formatAmount,
  generateOid,
  generateRnd,
  parseAmountToCents,
} from "..";

describe("generateOid", () => {
  it("is WL + YYYYMMDDHHmmss (UTC) + 8 uppercase alphanumerics", () => {
    const oid = generateOid(new Date(Date.UTC(2026, 10, 20, 9, 30, 5)));
    expect(oid).toMatch(/^WL20261120093005[A-Z0-9]{8}$/);
  });

  it("is 24 alphanumeric characters (≤ 64)", () => {
    const oid = generateOid();
    expect(oid).toMatch(/^WL\d{14}[A-Z0-9]{8}$/);
    expect(oid).toMatch(/^[A-Za-z0-9]+$/);
    expect(oid).toHaveLength(24);
    expect(oid.length).toBeLessThanOrEqual(64);
  });

  it("is unique over 1,000 calls", () => {
    const oids = new Set(Array.from({ length: 1000 }, () => generateOid()));
    expect(oids.size).toBe(1000);
  });
});

describe("generateRnd", () => {
  it("is 20 random alphanumerics", () => {
    expect(generateRnd()).toMatch(/^[A-Za-z0-9]{20}$/);
    expect(generateRnd()).not.toBe(generateRnd());
  });
});

describe("formatAmount", () => {
  it("formats with 2 decimals and a dot", () => {
    expect(formatAmount(10)).toBe("10.00");
    expect(formatAmount(95.93)).toBe("95.93");
    expect(formatAmount(1234.5)).toBe("1234.50");
    expect(formatAmount(0.1 + 0.2)).toBe("0.30");
  });

  it("rejects non-finite and negative amounts", () => {
    expect(() => formatAmount(Number.NaN)).toThrow(RangeError);
    expect(() => formatAmount(Number.POSITIVE_INFINITY)).toThrow(RangeError);
    expect(() => formatAmount(-1)).toThrow(RangeError);
  });
});

describe("parseAmountToCents / amountToCents", () => {
  it("accepts '.' or ',' and compares in integer cents", () => {
    expect(parseAmountToCents("10.00")).toBe(1000);
    expect(parseAmountToCents("10,00")).toBe(1000);
    expect(parseAmountToCents("10")).toBe(1000);
    expect(parseAmountToCents("10.5")).toBe(1050);
    expect(parseAmountToCents(" 95.93 ")).toBe(9593);
    expect(parseAmountToCents("10.000")).toBe(1000);
    expect(parseAmountToCents("95.93")).toBe(amountToCents(95.93));
  });

  it("rejects malformed or sub-cent amounts", () => {
    expect(parseAmountToCents("10.001")).toBeNull();
    expect(parseAmountToCents("")).toBeNull();
    expect(parseAmountToCents("-1")).toBeNull();
    expect(parseAmountToCents("1e3")).toBeNull();
    expect(parseAmountToCents("10.00 MAD")).toBeNull();
  });
});
