import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  formatDateTimeCasablanca,
  formatMad,
  orderConfirmationEmail,
  orderTeamNotificationEmail,
  type PaidOrder,
} from "../orderEmails";

const NBSP = " ";
const SETTINGS = { siteUrl: "https://site.example.test", contactRecipient: "contact@example.test" };
const FORM_URL = "https://site.example.test/documents/formulaire-retractation-welearn.pdf";
const PAID_AT = "2026-11-20T10:05:00.000Z"; // 11:05 a Casablanca (UTC+1)
const SEVEN_DAYS_LATER = "2026-11-27T10:05:00.000Z";

/** Remise + acces immediat (Pack Professionnels, code de reduction). */
const DISCOUNT_IMMEDIATE: PaidOrder = {
  oid: "WL20261120100500AB12CD",
  formation_slug: "bim-foundations-pro",
  label: "BIM Foundations Professional — Pack Professionnels",
  amount_mad: 8075,
  list_amount_mad: 8500,
  discount_mad: 425,
  code_id: "11111111-1111-4111-8111-111111111111",
  code: "WL-DSCT-AAAA",
  customer_name: "Éric Benjelloun",
  customer_email: "eric@example.test",
  customer_phone: "+212 600 000 000",
  access_choice: "immediate",
  access_available_at: PAID_AT,
  paid_at: PAID_AT,
  cmi_trans_id: "26324TEST0001",
  cmi_auth_code: "AUTH01",
};

/** Sans remise, acces apres retractation (Pack Etudiants, code etudiant). */
const STUDENT_AFTER_WITHDRAWAL: PaidOrder = {
  ...DISCOUNT_IMMEDIATE,
  oid: "WL20261120100500EF34GH",
  formation_slug: "bim-foundations-etudiant",
  label: "BIM Foundations Professional — Pack Étudiants",
  amount_mad: 5000,
  list_amount_mad: 5000,
  discount_mad: 0,
  code_id: "22222222-2222-4222-8222-222222222222",
  code: "WL-STUD-BBBB",
  customer_phone: null,
  access_choice: "after_withdrawal",
  access_available_at: SEVEN_DAYS_LATER,
};

const TEST_PRODUCT: PaidOrder = {
  ...DISCOUNT_IMMEDIATE,
  formation_slug: "test-paiement-cmi",
  label: "Test paiement CMI",
  amount_mad: 10,
  list_amount_mad: 10,
  discount_mad: 0,
  code_id: null,
  code: null,
};

const FOOTER = "© 2026 Welearn — welearn.ma";

beforeAll(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-11-25T10:00:00.000Z"));
});

afterAll(() => {
  vi.useRealTimers();
});

describe("formatting", () => {
  it("amounts: French format, 2 decimals, non-breaking thousands separator", () => {
    expect(formatMad(8075)).toBe(`8${NBSP}075,00`);
    expect(formatMad(10)).toBe("10,00");
    expect(formatMad(425)).toBe("425,00");
    expect(formatMad(0.5)).toBe("0,50");
  });

  it("dates: JJ/MM/AAAA HH:mm in Africa/Casablanca, 24 h clock", () => {
    expect(formatDateTimeCasablanca(PAID_AT)).toBe("20/11/2026 11:05");
    expect(formatDateTimeCasablanca("2026-11-20T23:30:00.000Z")).toBe("21/11/2026 00:30");
    expect(formatDateTimeCasablanca("2026-11-20T23:00:00.000Z")).toBe("21/11/2026 00:00");
  });
});

describe("customer confirmation e-mail", () => {
  it("discount + immediate: exact plain text, subject, recipients", () => {
    const mail = orderConfirmationEmail(DISCOUNT_IMMEDIATE, SETTINGS);

    expect(mail.to).toBe("eric@example.test");
    expect(mail.replyTo).toBe("contact@example.test");
    expect(mail.subject).toBe("Confirmation de votre paiement — Welearn");
    expect(mail.text).toBe(
      [
        "Bonjour Éric Benjelloun,",
        "Nous confirmons la réception de votre paiement.",
        "Formation : BIM Foundations Professional — Pack Professionnels",
        `Montant payé : 8${NBSP}075,00 MAD TTC`,
        `Prix catalogue : 8${NBSP}500,00 MAD TTC — Réduction : −425,00 MAD`,
        "Référence de commande : WL20261120100500AB12CD",
        "Date du paiement : 20/11/2026 11:05",
        "Votre accès à la formation sera ouvert sous 24 heures ouvrées. Conformément à votre choix lors de la commande, vous avez renoncé à votre droit de rétractation dès l'ouverture effective de l'accès.",
        "Conservez cet e-mail et votre référence de commande. Pour toute question : contact@example.test · +212 661 499 479.",
        "Conditions générales de vente (https://site.example.test/cgv/) · Politique de remboursement (https://site.example.test/remboursement/)",
        "L'équipe Welearn",
        "",
        FOOTER,
      ].join("\n\n"),
    );
  });

  it("after_withdrawal without discount: exact plain text, no discount block", () => {
    const mail = orderConfirmationEmail(STUDENT_AFTER_WITHDRAWAL, SETTINGS);

    expect(mail.text).toBe(
      [
        "Bonjour Éric Benjelloun,",
        "Nous confirmons la réception de votre paiement.",
        "Formation : BIM Foundations Professional — Pack Étudiants",
        `Montant payé : 5${NBSP}000,00 MAD TTC`,
        "Référence de commande : WL20261120100500EF34GH",
        "Date du paiement : 20/11/2026 11:05",
        `Conformément à votre choix lors de la commande, votre accès à la formation sera ouvert à l'expiration du délai légal de rétractation de 7 jours, à partir du 27/11/2026. Vous pouvez exercer votre droit de rétractation pendant ce délai, par écrit à contact@example.test ou avec le formulaire de rétractation : ${FORM_URL}.`,
        "Conservez cet e-mail et votre référence de commande. Pour toute question : contact@example.test · +212 661 499 479.",
        "Conditions générales de vente (https://site.example.test/cgv/) · Politique de remboursement (https://site.example.test/remboursement/)",
        "L'équipe Welearn",
        "",
        FOOTER,
      ].join("\n\n"),
    );
    // Un code etudiant ne donne pas de remise : pas de bloc prix catalogue.
    expect(mail.text).not.toContain("Prix catalogue");
    expect(mail.text).not.toContain("Réduction");
    expect(mail.html).not.toContain("Prix catalogue");
  });

  it("HTML: withdrawal sentence keeps the parenthesised link; info rows before the access text", () => {
    const html = orderConfirmationEmail(STUDENT_AFTER_WITHDRAWAL, SETTINGS).html;

    expect(html).toContain(
      `par écrit à contact@example.test (<a href="${FORM_URL}" style="color:#1B5FAA;">formulaire de rétractation</a>).`,
    );
    expect(html).not.toContain("ou avec le formulaire");
    expect(html).toContain('<a href="https://site.example.test/cgv/" style="color:#1B5FAA;">Conditions générales de vente</a> · ');
    expect(html).toContain('<a href="https://site.example.test/remboursement/" style="color:#1B5FAA;">Politique de remboursement</a>');
    expect(html.indexOf("Date du paiement")).toBeLessThan(html.indexOf("à partir du 27/11/2026"));
    expect(html.indexOf("Nous confirmons")).toBeLessThan(html.indexOf("Formation"));
    expect(html).toContain("Confirmation de paiement");
  });

  it("discount block only when discount_mad > 0", () => {
    expect(orderConfirmationEmail(DISCOUNT_IMMEDIATE, SETTINGS).html).toContain("Prix catalogue");
    expect(orderConfirmationEmail({ ...DISCOUNT_IMMEDIATE, discount_mad: 0, amount_mad: 8500 }, SETTINGS).text)
      .not.toContain("Prix catalogue");
  });

  it("contains no card / CMI transaction data", () => {
    const { html, text, subject } = orderConfirmationEmail(DISCOUNT_IMMEDIATE, SETTINGS);
    for (const content of [html, text, subject]) {
      expect(content).not.toContain("26324TEST0001");
      expect(content).not.toContain("AUTH01");
      expect(content).not.toContain("TransId");
      expect(content).not.toContain("***");
    }
  });
});

describe("team notification e-mail", () => {
  it("discount + immediate: subject, recipients, rows", () => {
    const mail = orderTeamNotificationEmail(DISCOUNT_IMMEDIATE, SETTINGS);

    expect(mail.to).toBe("contact@example.test");
    expect(mail.replyTo).toBe("eric@example.test");
    expect(mail.subject).toBe(
      `[Commande payée] BIM Foundations Professional — Pack Professionnels — 8${NBSP}075,00 MAD — WL20261120100500AB12CD`,
    );
    expect(mail.text).toBe(
      [
        "Client : Éric Benjelloun",
        "E-mail : eric@example.test",
        "Téléphone : +212 600 000 000",
        "Produit : BIM Foundations Professional — Pack Professionnels (bim-foundations-pro)",
        `Prix catalogue : 8${NBSP}500,00 MAD TTC`,
        "Réduction : −425,00 MAD",
        "Code : WL-DSCT-AAAA",
        `Montant payé : 8${NBSP}075,00 MAD TTC`,
        "Accès : Immédiat — renonciation au droit de rétractation",
        "Ouvrir l'accès : sous 24 h ouvrées",
        "Payé le : 20/11/2026 11:05",
        "TransId CMI : 26324TEST0001",
        "Code d'autorisation : AUTH01",
        "Référence : WL20261120100500AB12CD",
        "",
        FOOTER,
      ].join("\n\n"),
    );
    expect(mail.html).toContain("Commande payée");
  });

  it("after_withdrawal, student code (no discount), no phone", () => {
    const { text } = orderTeamNotificationEmail(STUDENT_AFTER_WITHDRAWAL, SETTINGS);

    expect(text).not.toContain("Téléphone");
    expect(text).toContain("Réduction : aucune");
    expect(text).toContain("Code : WL-STUD-BBBB");
    expect(text).toContain("Accès : Après le délai de rétractation de 7 jours");
    expect(text).toContain("Ouvrir l'accès : à partir du 27/11/2026");
  });

  it("no Code row when no code was used", () => {
    expect(orderTeamNotificationEmail(TEST_PRODUCT, SETTINGS).text).not.toContain("Code : ");
  });
});

describe("test product and escaping", () => {
  it("[TEST] prefix on both subjects for test-paiement-cmi only", () => {
    expect(orderConfirmationEmail(TEST_PRODUCT, SETTINGS).subject).toBe(
      "[TEST] Confirmation de votre paiement — Welearn",
    );
    expect(orderTeamNotificationEmail(TEST_PRODUCT, SETTINGS).subject).toBe(
      "[TEST] [Commande payée] Test paiement CMI — 10,00 MAD — WL20261120100500AB12CD",
    );
    expect(orderConfirmationEmail(DISCOUNT_IMMEDIATE, SETTINGS).subject).not.toContain("[TEST]");
    expect(orderTeamNotificationEmail(DISCOUNT_IMMEDIATE, SETTINGS).subject).not.toContain("[TEST]");
  });

  it("every customer-controlled or DB value is HTML-escaped", () => {
    const hostile: PaidOrder = {
      ...DISCOUNT_IMMEDIATE,
      customer_name: `<img src=x onerror="alert(1)">`,
      customer_email: "a<b>@example.test",
      customer_phone: "<i>0600</i>",
      label: "R&D <script>x</script>",
      code: "<b>WL</b>",
    };

    for (const { html } of [
      orderConfirmationEmail(hostile, SETTINGS),
      orderTeamNotificationEmail(hostile, SETTINGS),
    ]) {
      expect(html).not.toContain("<img");
      expect(html).not.toContain("<script>");
      expect(html).not.toContain("<i>");
      expect(html).not.toContain("<b>");
      expect(html).not.toContain("a<b>@");
    }

    const customer = orderConfirmationEmail(hostile, SETTINGS).html;
    expect(customer).toContain("Bonjour &lt;img src=x onerror=&quot;alert(1)&quot;&gt;,");
    expect(customer).toContain("R&amp;D &lt;script&gt;x&lt;/script&gt;");

    const team = orderTeamNotificationEmail(hostile, SETTINGS).html;
    expect(team).toContain("a&lt;b&gt;@example.test");
    expect(team).toContain("&lt;i&gt;0600&lt;/i&gt;");
    expect(team).toContain("&lt;b&gt;WL&lt;/b&gt;");
  });
});
