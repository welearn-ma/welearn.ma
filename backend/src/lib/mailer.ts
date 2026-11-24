import nodemailer, { type Transporter } from "nodemailer";

/**
 * Envoi d'e-mails partage (SMTP_*). contactController garde son propre
 * transport : ce module ne sert qu'aux nouveaux e-mails.
 */

export interface MailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export interface Mailer {
  /** Leve en cas d'echec : l'appelant decide (journal, reponse). */
  send(message: MailMessage): Promise<void>;
}

export class MailerUnavailableError extends Error {
  constructor(missing: string[]) {
    super(`SMTP configuration missing: ${missing.join(", ")}`);
    this.name = "MailerUnavailableError";
  }
}

type Env = Record<string, string | undefined>;

/** Parametres SMTP effectifs, sans le mot de passe (affichables). */
export interface SmtpSettings {
  host: string;
  port: number;
  secure: boolean;
  user: string;
}

export interface SmtpTransport {
  transporter: Transporter;
  from: string;
  settings: SmtpSettings;
}

/**
 * Lit SMTP_* et cree le transport ; leve MailerUnavailableError si la
 * configuration est incomplete. Utilise par createSmtpMailer et par
 * scripts/mail-test.mjs (diagnostic), pour tester exactement la meme config.
 */
export function createSmtpTransport(env: Env = process.env): SmtpTransport {
  const host = env.SMTP_HOST?.trim();
  const user = env.SMTP_USER?.trim();
  const pass = env.SMTP_PASS;
  const port = Number(env.SMTP_PORT || "587");
  const missing = [
    !host && "SMTP_HOST",
    !user && "SMTP_USER",
    !pass && "SMTP_PASS",
    !Number.isFinite(port) && "SMTP_PORT",
  ].filter((name): name is string => Boolean(name));
  if (missing.length || !host || !user) {
    throw new MailerUnavailableError(missing);
  }

  const secure = env.SMTP_SECURE === "true" || port === 465;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
  const address = env.SMTP_FROM?.trim() || user;
  return {
    transporter,
    from: `"Welearn" <${address}>`,
    settings: { host, port, secure, user },
  };
}

/** Transport cree a la premiere utilisation, puis reutilise. */
export function createSmtpMailer(env: Env = process.env): Mailer {
  let transport: SmtpTransport | null = null;

  return {
    async send(message) {
      transport ??= createSmtpTransport(env);
      await transport.transporter.sendMail({ from: transport.from, ...message });
    },
  };
}

/**
 * Description d'une erreur d'envoi SANS donnee personnelle : les messages
 * SMTP citent souvent l'adresse du destinataire, on ne garde que les codes.
 */
export function describeMailError(error: unknown): string {
  if (error instanceof MailerUnavailableError) {
    return error.message;
  }
  const { code, responseCode } = (error ?? {}) as { code?: unknown; responseCode?: unknown };
  const parts = [
    typeof code === "string" && code,
    typeof responseCode === "number" && `smtp ${responseCode}`,
  ].filter(Boolean);
  return parts.length ? parts.join(" ") : "unknown error";
}

/** Envoi best effort : journalise l'echec (sans donnee personnelle), ne leve jamais. */
export async function trySend(
  mailer: Mailer,
  label: string,
  message: MailMessage,
): Promise<boolean> {
  try {
    await mailer.send(message);
    return true;
  } catch (error) {
    console.error(`[mail] ${label} not sent: ${describeMailError(error)}`);
    return false;
  }
}
