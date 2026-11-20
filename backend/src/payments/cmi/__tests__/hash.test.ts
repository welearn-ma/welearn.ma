import { describe, expect, it } from "vitest";
import {
  applyDocumentRule,
  buildHashPlaintext,
  buildSignedFields,
  computeHash,
  escapeHashValue,
  plaintextFromValues,
  sha512Base64,
} from "..";

const KEY = "TEST_ONLY_KEY";

// Exemple de la section 4.1.4 du kit CMI V2.0 (dummy storeKey ABCD1234).
const SPEC_PARAMS = {
  clientId: "100200127",
  amount: "95.93",
  okurl: "http://localhost:8080/SampleCodeJSPTest/GenericVer3ResponseHandler",
  failUrl: "http://localhost:8080/SampleCodeJSPTest/GenericVer3ResponseHandler",
  TranType: "PreAuth",
  email: "",
  callbackUrl: "http://localhost:8080/SampleCodeJSPTest/GateResponseControl.jsp",
  currency: "504",
  rnd: "87954458746",
  storeType: "3d_pay_hosting",
  lang: "en",
  hashAlgorithm: "ver3",
  BillToName: "name",
  BillTocompany: "billToCompany",
};
const SPEC_STORE_KEY = "ABCD1234";
const SPEC_PLAINTEXT =
  "95.93|billToCompany|name|http://localhost:8080/SampleCodeJSPTest/GateResponseControl.jsp|100200127|504||http://localhost:8080/SampleCodeJSPTest/GenericVer3ResponseHandler|ver3|en|http://localhost:8080/SampleCodeJSPTest/GenericVer3ResponseHandler|87954458746|3d_pay_hosting|PreAuth|ABCD1234";
// base64(sha512(SPEC_PLAINTEXT)) calcule independamment avec
// `openssl dgst -sha512 -binary | openssl base64 -A`.
const SPEC_HASH =
  "dWwg8VGSfMk4lzQ+x62lh0AWl/sJdfGV6G/OEK6CmezXXrzNpsh78bZhDUkHXJoZnVPCAEqfc1raQ26VHyvRvg==";

describe("ver3 plaintext — spec worked example (4.1.4)", () => {
  it("produces exactly the spec plaintext", () => {
    expect(buildHashPlaintext(SPEC_PARAMS, SPEC_STORE_KEY)).toBe(SPEC_PLAINTEXT);
  });

  it("hashes to base64(sha512(plaintext)) — matches openssl", () => {
    expect(sha512Base64(SPEC_PLAINTEXT)).toBe(SPEC_HASH);
    expect(computeHash(SPEC_PARAMS, SPEC_STORE_KEY)).toBe(SPEC_HASH);
  });

  it("buildSignedFields posts the same values and the same HASH", () => {
    const fields = buildSignedFields(SPEC_PARAMS, SPEC_STORE_KEY);
    const hash = fields.find(([key]) => key === "HASH");
    const posted = fields.filter(([key]) => key !== "HASH");

    expect(hash?.[1]).toBe(SPEC_HASH);
    expect(Object.fromEntries(posted)).toEqual(SPEC_PARAMS);
    expect(fields[fields.length - 1][0]).toBe("HASH");
  });
});

describe("escaping", () => {
  it("escapes \\ then | (spec example)", () => {
    expect(escapeHashValue("ORDER-256712jbs\\j6b|")).toBe("ORDER-256712jbs\\\\j6b\\|");
  });

  it("escapes values and the store key inside the plaintext", () => {
    expect(plaintextFromValues({ oid: "A|B\\C" }, "K|E\\Y")).toBe(
      "A\\|B\\\\C|K\\|E\\\\Y",
    );
  });
});

describe("excluded keys and empty values", () => {
  it("drops hash / encoding in any case and keeps empty values", () => {
    const params = {
      b: "2",
      HASH: "should-not-appear",
      Encoding: "UTF-8",
      a: "1",
      hash: "nor-this",
      ENCODING: "utf-8",
      email: "",
    };
    expect(plaintextFromValues(params, KEY)).toBe(`1|2||${KEY}`);
  });

  it("keeps an empty value as an empty segment between pipes", () => {
    expect(plaintextFromValues({ a: "1", b: "", c: "3" }, KEY)).toBe(`1||3|${KEY}`);
  });
});

describe("key order — uppercase-folded character order (JSP sample)", () => {
  it("sorts DIMCRITERIA1 < DIMCRITERIA10 < DIMCRITERIA2 (not natural order)", () => {
    const params = { DIMCRITERIA2: "two", DIMCRITERIA10: "ten", DIMCRITERIA1: "one" };
    expect(plaintextFromValues(params, KEY)).toBe(`one|ten|two|${KEY}`);
  });

  it("is case-insensitive", () => {
    expect(plaintextFromValues({ zeta: "z", Alpha: "a", beta: "b" }, KEY)).toBe(
      `a|b|z|${KEY}`,
    );
  });

  it("puts '_' after letters (upper-case folding, not lower-case)", () => {
    expect(plaintextFromValues({ Ecom_B: "underscore", EcomA: "letter" }, KEY)).toBe(
      `letter|underscore|${KEY}`,
    );
  });
});

describe("outgoing preparation", () => {
  it("trims values before hashing", () => {
    expect(buildHashPlaintext({ a: "  x  " }, KEY)).toBe(`x|${KEY}`);
  });

  it("applies the 'document' rule (spec examples)", () => {
    expect(applyDocumentRule("document abc")).toBe("document.abc");
    expect(applyDocumentRule("documentabc")).toBe("document.bc");
  });

  it("'document' rule: lowercase only, nothing to replace at end of string", () => {
    expect(applyDocumentRule("Document abc")).toBe("Document abc");
    expect(applyDocumentRule("my document")).toBe("my document");
    expect(applyDocumentRule("document|x")).toBe("document.x");
  });

  it("applies the rule in the plaintext but not in the posted value", () => {
    expect(buildHashPlaintext({ description: "document abc" }, KEY)).toBe(
      `document.abc|${KEY}`,
    );
    const fields = buildSignedFields({ description: "document abc" }, KEY);
    expect(fields[0]).toEqual(["description", "document abc"]);
  });

  it("refuses an empty store key and a caller-supplied hash", () => {
    expect(() => buildSignedFields({ a: "1" }, "")).toThrow();
    expect(() => buildSignedFields({ hash: "x" }, KEY)).toThrow();
  });
});
