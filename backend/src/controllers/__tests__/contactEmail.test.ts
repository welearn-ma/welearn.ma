import type { Request, Response } from "express";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
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
  from: string;
  replyTo: string;
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

  it("e-mail field: markup that passes the e-mail format check is escaped too (text and mailto links)", async () => {
    const email = '"><b>x</b><script>alert(1)</script>@example.test';
    const { html } = await send({ ...harmless, email });
    const escaped =
      "&quot;&gt;&lt;b&gt;x&lt;/b&gt;&lt;script&gt;alert(1)&lt;/script&gt;@example.test";

    expect(html).not.toMatch(/<b>|<script/);
    expect(html).toContain(`<a href="mailto:${escaped}" style="color:#1B5FAA;text-decoration:none;">${escaped}</a>`);
    expect(html).toContain(`<a href="mailto:${escaped}?subject=Re: Sujet"`);
    expect(tagSkeleton(html)).toEqual(tagSkeleton((await send(harmless)).html));
  });
});
