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
