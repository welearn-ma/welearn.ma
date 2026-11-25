import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  discountCodeEmail,
  proofApprovedEmail,
  proofNotificationEmail,
  proofRejectedEmail,
  proofReceivedEmail,
} from "../../commerce/emails";
import {
  orderConfirmationEmail,
  orderTeamNotificationEmail,
  type PaidOrder,
} from "../../payments/orderEmails";
import { renderEmail } from "../emailTemplate";

/**
 * Non-regression des e-mails : tout octet different (HTML ou texte) fait
 * echouer ce test.
 *   - discountCodeEmail et renderEmail : snapshot de c34a91f (avant
 *     `paragraphsAfterRows` / `plain`) ;
 *   - e-mails de commande payee : snapshot de bbfb634 (avant le bouton) ;
 *   - 4 e-mails de justificatif (accuse, notification, validation, refus) :
 *     mis a jour volontairement pour la ligne « Statut du justificatif ».
 * L'e-mail de contact est fige dans controllers/__tests__/contactEmail.test.ts.
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
      proofReceivedEmail({
        to: "etu@example.test",
        fullName: "Éa <b>&'\"",
        submittedAt: "2026-11-25T10:00:00.000Z",
        replyTo: REPLY_TO,
      }),
    ).toMatchSnapshot();
  });

  it("proofNotificationEmail (with and without phone)", () => {
    const base = {
      to: REPLY_TO,
      fullName: "Étudiant <Test>",
      email: "etu@example.test",
      pageSlug: "bim-foundations-professional",
      siteUrl: "https://site.example.test",
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
        paymentUrl:
          "https://site.example.test/paiement/?produit=bim-foundations-etudiant&code=WL-ABCD-EFGH",
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

  it("order e-mails (customer + team; discount + immediate, after_withdrawal, test product)", () => {
    const discountImmediate: PaidOrder = {
      oid: "WL20261125143000K7M2Q9TX",
      formation_slug: "bim-foundations-pro",
      label: "BIM Foundations Professional — Pack Professionnels",
      amount_mad: 8075,
      list_amount_mad: 8500,
      discount_mad: 425,
      code_id: "11111111-1111-4111-8111-111111111111",
      code: "WL-DSCT-7K2M",
      customer_name: "Salma <Alaoui> & 'co'",
      customer_email: "salma@example.test",
      customer_phone: "+212 600 123 456",
      access_choice: "immediate",
      paid_at: "2026-11-25T13:30:00.000Z",
      access_available_at: "2026-11-25T13:30:00.000Z",
      cmi_trans_id: "26329ABCD1234",
      cmi_auth_code: "P12345",
    };
    const afterWithdrawal: PaidOrder = {
      ...discountImmediate,
      formation_slug: "bim-foundations-etudiant",
      label: "BIM Foundations Professional — Pack Étudiants",
      amount_mad: 5000,
      list_amount_mad: 5000,
      discount_mad: 0,
      code: "WL-STUD-9P4R",
      customer_phone: null,
      access_choice: "after_withdrawal",
      access_available_at: "2026-12-02T13:30:00.000Z",
      cmi_trans_id: null,
      cmi_auth_code: null,
    };
    const testProduct: PaidOrder = {
      ...discountImmediate,
      formation_slug: "test-paiement-cmi",
      label: "Test paiement CMI",
      amount_mad: 10,
      list_amount_mad: 10,
      discount_mad: 0,
      code_id: null,
      code: null,
    };
    const settings = { siteUrl: "https://site.example.test", contactRecipient: REPLY_TO };

    for (const order of [discountImmediate, afterWithdrawal, testProduct]) {
      expect(orderConfirmationEmail(order, settings)).toMatchSnapshot();
      expect(orderTeamNotificationEmail(order, settings)).toMatchSnapshot();
    }
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
