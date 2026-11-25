import type { Request, Response } from "express";
// Modules internes de nodemailer, non mockes (seul "nodemailer" l'est) :
// composent le message reel, sans envoi, pour lire en-tetes et enveloppe.
import addressparser from "nodemailer/lib/addressparser";
import MailComposer from "nodemailer/lib/mail-composer";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { FORBIDDEN_EMAILS, PLUS_TAG_EMAIL } from "../../lib/__tests__/emailSamples";
import { submitContactRequest } from "../contactController";

/**
 * Non-regression de l'e-mail du formulaire de contact (HTML construit dans
 * contactController) : le snapshot fige le message exact passe a nodemailer
 * (from, to, replyTo, subject, text, html).
 */

const { sendMail } = vi.hoisted(() => ({
  sendMail: vi.fn(async (_message: unknown) => ({})),
}));
vi.mock("nodemailer", () => ({
  default: { createTransport: () => ({ sendMail }) },
}));

beforeAll(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-11-25T10:00:00.000Z"));
  vi.stubEnv("SMTP_HOST", "smtp.example.test");
  vi.stubEnv("SMTP_PORT", "587");
  vi.stubEnv("SMTP_USER", "sender@example.test");
  vi.stubEnv("SMTP_PASS", "not-a-real-password");
  vi.stubEnv("SMTP_FROM", "no-reply@example.test");
  vi.stubEnv("CONTACT_RECIPIENT", "contact@example.test");
});

afterAll(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

function fakeResponse() {
  const res = {
    statusCode: 0,
    body: undefined as unknown,
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(body: unknown) {
      res.body = body;
      return res;
    },
  };
  return res;
}

describe("contact e-mail is unchanged", () => {
  it.each([
    [
      "with phone",
      {
        fullName: "Éric Benjelloun",
        email: "eric@example.test",
        phone: "+212 600 000 000",
        subject: "Question sur la formation BIM",
        message: "Bonjour,\nJe voudrais des informations.\nMerci",
      },
    ],
    [
      "without phone",
      {
        fullName: "Client Test",
        email: "client@example.test",
        subject: "Devis & tarifs",
        message: "Un message.",
      },
    ],
  ])("%s", async (_label, payload) => {
    sendMail.mockClear();
    const res = fakeResponse();

    await submitContactRequest(
      { body: payload } as unknown as Request,
      res as unknown as Response,
    );

    expect(res.statusCode).toBe(201);
    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(sendMail.mock.calls[0][0]).toMatchSnapshot();
  });
});

interface SentMail {
  from: string | { name: string; address: string };
  to: string;
  replyTo: string | { name: string; address: string };
  subject: string;
  text: string;
  html: string;
}

async function send(payload: Record<string, string>): Promise<SentMail> {
  sendMail.mockClear();
  const res = fakeResponse();
  await submitContactRequest(
    { body: payload } as unknown as Request,
    res as unknown as Response,
  );
  expect(res.statusCode).toBe(201);
  expect(sendMail).toHaveBeenCalledTimes(1);
  return sendMail.mock.calls[0][0] as SentMail;
}

/** Squelette du HTML : suite des balises (noms seuls, attributs ignores). */
function tagSkeleton(html: string): string[] {
  return (html.match(/<\/?[!a-zA-Z][^>]*>/g) ?? []).map(
    (tag) => /^<\/?[!a-zA-Z]+/.exec(tag)![0],
  );
}

const INJECTION =
  '<b>gras</b> <a href="https://evil.example/">lien</a> <script>alert(1)</script>';
const INJECTION_HTML =
  "&lt;b&gt;gras&lt;/b&gt; &lt;a href=&quot;https://evil.example/&quot;&gt;lien&lt;/a&gt; &lt;script&gt;alert(1)&lt;/script&gt;";

describe("contact e-mail escapes user input in the HTML", () => {
  const injected = {
    fullName: `Nom ${INJECTION}`,
    email: "client@example.test",
    phone: "+212 600 000 000",
    subject: `Sujet ${INJECTION}`,
    message: `Ligne 1 ${INJECTION}\nLigne 2 ${INJECTION}`,
  };
  const harmless = {
    fullName: "Nom",
    email: "client@example.test",
    phone: "+212 600 000 000",
    subject: "Sujet",
    message: "Ligne 1\nLigne 2",
  };

  it("<b>, <a href> and <script> in name, subject and message are shown as text, not markup", async () => {
    const { html } = await send(injected);

    expect(html).not.toMatch(/<b>|<script|<a href="https:\/\/evil/);
    // Nom (ligne « Nom » + bouton « Répondre à »), sujet, message (2 lignes).
    expect(html).toContain(`>Nom ${INJECTION_HTML}</td>`);
    expect(html).toContain(`Répondre à Nom ${INJECTION_HTML}\n`);
    expect(html).toContain(`>Sujet ${INJECTION_HTML}</td>`);
    expect(html).toContain(`>Ligne 1 ${INJECTION_HTML}<br />Ligne 2 ${INJECTION_HTML}</div>`);
    expect(html.split(INJECTION_HTML)).toHaveLength(6);
  });

  it("layout unchanged: same tags as a harmless message", async () => {
    const injectedHtml = (await send(injected)).html;
    const harmlessHtml = (await send(harmless)).html;
    expect(tagSkeleton(injectedHtml)).toEqual(tagSkeleton(harmlessHtml));
  });

  it("plain text and subject keep the input as typed (they are not HTML)", async () => {
    const mail = await send(injected);
    expect(mail.subject).toBe(`[Contact Welearn] Sujet ${INJECTION}`);
    expect(mail.text).toContain(`Nom: Nom ${INJECTION}\n`);
    expect(mail.text).toContain(`Sujet: Sujet ${INJECTION}\n`);
    expect(mail.text).toContain(`Message:\nLigne 1 ${INJECTION}\nLigne 2 ${INJECTION}`);
    expect(mail.html).not.toContain(INJECTION);
  });

  it("e-mail field: characters the format check still allows (' and &) are escaped (text and mailto links)", async () => {
    // < > " sont refuses par la regle e-mail (tests « contact: e-mail format »).
    const email = "o'neil&co@example.test";
    const { html } = await send({ ...harmless, email });
    const escaped = "o&#39;neil&amp;co@example.test";

    expect(html).not.toContain(email);
    expect(html).toContain(`<a href="mailto:${escaped}" style="color:#1B5FAA;text-decoration:none;">${escaped}</a>`);
    expect(html).toContain(`<a href="mailto:${escaped}?subject=Re: Sujet"`);
    expect(tagSkeleton(html)).toEqual(tagSkeleton((await send(harmless)).html));
  });
});

describe("contact: e-mail format (shared rule)", () => {
  const base = { fullName: "Nom", subject: "Sujet", message: "Message" };

  it.each(FORBIDDEN_EMAILS)("refuses %s → 400, nothing sent", async (_label, email) => {
    sendMail.mockClear();
    const res = fakeResponse();
    await submitContactRequest(
      { body: { ...base, email } } as unknown as Request,
      res as unknown as Response,
    );
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ success: false, message: "email format is invalid" });
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("refuses an address over 64 characters (limit now applied here too)", async () => {
    sendMail.mockClear();
    const res = fakeResponse();
    await submitContactRequest(
      { body: { ...base, email: `${"a".repeat(54)}@domaine.ma` } } as unknown as Request,
      res as unknown as Response,
    );
    expect(res.statusCode).toBe(400);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it(`accepts ${PLUS_TAG_EMAIL}`, async () => {
    const mail = await send({ ...base, email: PLUS_TAG_EMAIL });
    expect(mail.replyTo).toEqual({ name: "Nom", address: PLUS_TAG_EMAIL });
  });
});

/** Message tel que nodemailer le compose : en-tetes (deplies) + enveloppe SMTP. */
async function composed(mail: SentMail) {
  const node = new MailComposer(mail).compile();
  const raw = (await node.build()).toString();
  const head = raw
    .split(/\r?\n\r?\n/)[0]
    .replace(/\r?\n[ \t]+/g, " ")
    .split(/\r?\n/);
  const header = (name: string) =>
    head
      .filter((line) => line.toLowerCase().startsWith(`${name.toLowerCase()}:`))
      .map((line) => line.slice(name.length + 1).trim());
  return { header, envelope: node.getEnvelope() };
}

/** Adresses lues dans un en-tete, comme le ferait un client mail. */
function addressesIn(value: string): string[] {
  return addressparser(value, { flatten: true }).map((entry) => entry.address);
}

describe("contact e-mail: From and Reply-To carry one address, whatever the name", () => {
  const NAME = 'Eve" <attacker@evil.example>, "Mallory <second@evil.example>';

  it('a name with ", <, >, a comma and a second address adds no address (headers and SMTP envelope)', async () => {
    const mail = await send({
      fullName: NAME,
      email: "client@example.test",
      subject: "Sujet",
      message: "Message",
    });
    const { header, envelope } = await composed(mail);

    expect(header("From")).toHaveLength(1);
    expect(addressesIn(header("From")[0])).toEqual(["no-reply@example.test"]);
    expect(header("Reply-To")).toHaveLength(1);
    expect(addressesIn(header("Reply-To")[0])).toEqual(["client@example.test"]);
    // Expediteur SMTP (MAIL FROM) : toujours notre adresse.
    expect(envelope).toEqual({ from: "no-reply@example.test", to: ["contact@example.test"] });

    // Le nom reste affiche tel quel, dans le seul champ « nom ».
    expect(mail.from).toEqual({ name: `${NAME} via Welearn`, address: "no-reply@example.test" });
    expect(mail.replyTo).toEqual({ name: NAME, address: "client@example.test" });
  });

  it("ordinary names: same From / Reply-To on the wire as before", async () => {
    const { header } = await composed(
      await send({
        fullName: "Éric Benjelloun",
        email: "eric@example.test",
        subject: "Sujet",
        message: "Message",
      }),
    );
    // Valeurs produites par l'ancienne forme `"<nom> via Welearn" <adresse>`.
    expect(header("From")).toEqual([
      "=?UTF-8?Q?=C3=89ric_Benjelloun_via_Welearn?= <no-reply@example.test>",
    ]);
    expect(header("Reply-To")).toEqual(["=?UTF-8?Q?=C3=89ric_Benjelloun?= <eric@example.test>"]);
  });
});
