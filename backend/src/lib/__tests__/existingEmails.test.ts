import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  discountCodeEmail,
  proofApprovedEmail,
  proofNotificationEmail,
  proofRejectedEmail,
  proofReceivedEmail,
} from "../../commerce/emails";
import { renderEmail } from "../emailTemplate";

/**
 * Non-regression des e-mails existants : le snapshot a ete enregistre AVANT
 * l'ajout de `paragraphsAfterRows` et de `plain` dans emailTemplate.ts
 * (code de c34a91f). Tout octet different (HTML ou texte) fait echouer ce
 * test.
 */

beforeAll(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-11-25T10:00:00.000Z"));
});

afterAll(() => {
  vi.useRealTimers();
});

const REPLY_TO = "contact@example.test";
const PAYMENT_URL = "https://site.example.test/paiement/?produit=bim-foundations-pro";

describe("existing e-mails are unchanged", () => {
  it("proofReceivedEmail", () => {
    expect(
      proofReceivedEmail({ to: "etu@example.test", fullName: "Éa <b>&'\"", replyTo: REPLY_TO }),
    ).toMatchSnapshot();
  });

  it("proofNotificationEmail (with and without phone)", () => {
    const base = {
      to: REPLY_TO,
      fullName: "Étudiant <Test>",
      email: "etu@example.test",
      pageSlug: "bim-foundations-professional",
    };
    expect(proofNotificationEmail({ ...base, phone: "+212 600 000 000" })).toMatchSnapshot();
    expect(proofNotificationEmail({ ...base, phone: null })).toMatchSnapshot();
  });

  it("proofApprovedEmail", () => {
    expect(
      proofApprovedEmail({
        to: "etu@example.test",
        fullName: "Étudiant Test",
        code: "WL-ABCD-EFGH",
        expiresAt: "2026-12-25T10:00:00.000Z",
        paymentUrl: PAYMENT_URL,
        replyTo: REPLY_TO,
      }),
    ).toMatchSnapshot();
  });

  it("proofRejectedEmail", () => {
    expect(
      proofRejectedEmail({
        to: "etu@example.test",
        fullName: "Étudiant Test",
        reason: "document illisible.",
        proofUrl: "https://site.example.test/etudiant/justificatif/?formation=bim",
        replyTo: REPLY_TO,
      }),
    ).toMatchSnapshot();
  });

  it("discountCodeEmail", () => {
    expect(
      discountCodeEmail({
        to: "client@example.test",
        code: "WL-DSCT-AAAA",
        expiresAt: "2026-12-25T10:00:00.000Z",
        paymentUrl: PAYMENT_URL,
        replyTo: REPLY_TO,
      }),
    ).toMatchSnapshot();
  });

  it("renderEmail: rows, bold, links (http and non-http), escaping", () => {
    expect(
      renderEmail(
        {
          heading: "Titre <h>",
          paragraphs: [
            ["Texte & ", { text: "gras", bold: true }, " ", { text: "lien", href: "https://x.test/?a=1&b=2" }],
            [{ text: "pas un lien", href: "javascript:alert(1)" }, { text: "https://x.test/", href: "https://x.test/" }],
          ],
          rows: [
            ["Nom", "<script>"],
            ["E-mail", "a@b.test"],
          ],
        },
        2026,
      ),
    ).toMatchSnapshot();
  });
});
