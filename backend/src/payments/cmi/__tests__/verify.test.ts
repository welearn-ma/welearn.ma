import { describe, expect, it } from "vitest";
import {
  buildSignedFields,
  computeReceivedHash,
  decodeHtmlEntities,
  normalizeReceivedValue,
  plaintextFromValues,
  sha512Base64,
  verifyCallbackHash,
} from "..";

const KEY = "TEST_ONLY_KEY";

function outgoingParams(): Record<string, string> {
  return {
    clientid: "600000000",
    storetype: "3D_PAY_HOSTING",
    trantype: "PreAuth",
    amount: "10.00",
    currency: "504",
    oid: "WL20261120093005ABCD1234",
    okUrl: "https://api.example.test/api/payments/cmi/return",
    failUrl: "https://api.example.test/api/payments/cmi/return",
    callbackUrl: "https://api.example.test/api/payments/cmi/callback",
    CallbackResponse: "true",
    shopurl: "https://site.example.test",
    lang: "fr",
    email: "client@example.test",
    BillToName: "Éric Benjelloun",
    tel: "+212 600-000000",
    rnd: "abcDEF0123456789wxyz",
    hashAlgorithm: "ver3",
    encoding: "UTF-8",
  };
}

/** Corps tel que CMI le renverrait : parametres envoyes + reponse, signe. */
function signedCallback(
  extra: Record<string, string>,
  storeKey = KEY,
): Record<string, string> {
  const posted = Object.fromEntries(
    buildSignedFields(outgoingParams(), storeKey).filter(([k]) => k !== "HASH"),
  );
  const body = { ...posted, ...extra };
  return { ...body, HASH: computeReceivedHash(body, storeKey) };
}

describe("round trip", () => {
  it("fields built for the gateway verify with the same key", () => {
    const body = Object.fromEntries(buildSignedFields(outgoingParams(), KEY));
    expect(verifyCallbackHash(body, KEY)).toBe(true);
  });

  it("any single-character change fails", () => {
    const body = Object.fromEntries(buildSignedFields(outgoingParams(), KEY));
    expect(verifyCallbackHash({ ...body, amount: "10.01" }, KEY)).toBe(false);
    expect(verifyCallbackHash({ ...body, oid: `${body.oid.slice(0, -1)}X` }, KEY)).toBe(
      false,
    );

    const hash = body.HASH;
    const flipped = `${hash[0] === "A" ? "B" : "A"}${hash.slice(1)}`;
    expect(verifyCallbackHash({ ...body, HASH: flipped }, KEY)).toBe(false);
  });

  it("a wrong store key fails", () => {
    const body = Object.fromEntries(buildSignedFields(outgoingParams(), KEY));
    expect(verifyCallbackHash(body, "ABCD1234")).toBe(false);
  });

  it("a simulated CMI callback (extra response fields) verifies", () => {
    const body = signedCallback({
      ProcReturnCode: "00",
      Response: "Approved",
      TransId: "17327P7GH13718",
      AuthCode: "129430",
      "EXTRA.CARDBRAND": "VISA",
      Ecom_Payment_Card_ExpDate_Month: "12",
      DIMCRITERIA1: "",
      DIMCRITERIA10: "",
    });
    expect(verifyCallbackHash(body, KEY)).toBe(true);
    expect(verifyCallbackHash({ ...body, ProcReturnCode: "05" }, KEY)).toBe(false);
  });

  it("accepts the hash under 'hash' (lowercase) too", () => {
    const { HASH, ...rest } = signedCallback({ ProcReturnCode: "00" });
    expect(verifyCallbackHash({ ...rest, hash: HASH }, KEY)).toBe(true);
  });
});

describe("received-value normalisation (callback.php behaviour)", () => {
  it("decodes &amp; and &#039; before hashing", () => {
    const decodedPlaintext = plaintextFromValues(
      { BillToName: "Tom & Jerry's", oid: "WL1" },
      KEY,
    );
    const body = {
      BillToName: "Tom &amp; Jerry&#039;s",
      oid: "WL1",
      HASH: sha512Base64(decodedPlaintext),
    };
    expect(verifyCallbackHash(body, KEY)).toBe(true);

    const rawPlaintext = plaintextFromValues(
      { BillToName: "Tom &amp; Jerry&#039;s", oid: "WL1" },
      KEY,
    );
    expect(verifyCallbackHash({ ...body, HASH: sha512Base64(rawPlaintext) }, KEY)).toBe(
      false,
    );
  });

  it("strips exactly one trailing \\n and never trims", () => {
    expect(normalizeReceivedValue("abc\n")).toBe("abc");
    expect(normalizeReceivedValue("abc\n\n")).toBe("abc\n");
    expect(normalizeReceivedValue("  abc ")).toBe("  abc ");

    const spaced = { ErrMsg: "  x  ", HASH: sha512Base64(`  x  |${KEY}`) };
    expect(verifyCallbackHash(spaced, KEY)).toBe(true);
    const trimmed = { ErrMsg: "  x  ", HASH: sha512Base64(`x|${KEY}`) };
    expect(verifyCallbackHash(trimmed, KEY)).toBe(false);
  });

  it("limited entity decoder: single pass, numeric + 5 named only", () => {
    expect(decodeHtmlEntities("&amp;lt;")).toBe("&lt;");
    expect(decodeHtmlEntities("&#x27;&#39;&apos;&quot;&lt;&gt;")).toBe("'''\"<>");
    expect(decodeHtmlEntities("&eacute;")).toBe("&eacute;");
    expect(decodeHtmlEntities("&#0;&#xD800;&#99999999;")).toBe("&#0;&#xD800;&#99999999;");
    expect(decodeHtmlEntities("a & b")).toBe("a & b");
  });
});

describe("verifyCallbackHash fails closed", () => {
  const valid = () => signedCallback({ ProcReturnCode: "00" });

  it("duplicate keys (array value) → false", () => {
    expect(verifyCallbackHash({ ...valid(), amount: ["10.00", "10.00"] }, KEY)).toBe(
      false,
    );
  });

  it("missing hash, or both HASH and hash → false", () => {
    const { HASH, ...rest } = valid();
    expect(verifyCallbackHash(rest, KEY)).toBe(false);
    expect(verifyCallbackHash({ ...rest, HASH, hash: HASH }, KEY)).toBe(false);
  });

  it("empty store key, non-object body, short hash → false without throwing", () => {
    expect(verifyCallbackHash(valid(), "")).toBe(false);
    expect(verifyCallbackHash(null, KEY)).toBe(false);
    expect(verifyCallbackHash("HASH=x", KEY)).toBe(false);
    expect(verifyCallbackHash([], KEY)).toBe(false);
    expect(verifyCallbackHash({ ...valid(), HASH: "short" }, KEY)).toBe(false);
  });
});
