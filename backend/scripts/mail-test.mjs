// Diagnostic SMTP : meme environnement que l'application (dotenv : .env du
// dossier courant + variables du shell) et meme transport que le mailer
// partage (createSmtpTransport, dist/lib/mailer.js). Envoie UN e-mail texte.
// N'affiche jamais le mot de passe.
//
//   npm run build && npm run mail:test -- someone@example.com
//
// Code de sortie : 0 si verify() ET l'envoi reussissent, 1 sinon, 2 si
// l'adresse manque.
import "dotenv/config";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const to = process.argv[2]?.trim();
if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
  console.error("Usage: npm run mail:test -- someone@example.com");
  process.exit(2);
}

const mailerPath = fileURLToPath(new URL("../dist/lib/mailer.js", import.meta.url));
if (!existsSync(mailerPath)) {
  console.error("dist/lib/mailer.js not found: run `npm run build` first.");
  process.exit(1);
}
const require = createRequire(import.meta.url);
const { createSmtpTransport, MailerUnavailableError } = require(mailerPath);

const envFile = path.resolve(process.cwd(), ".env");
console.log(
  existsSync(envFile)
    ? `env:     ${envFile} + shell environment (shell values win)`
    : `env:     no .env in ${process.cwd()}, shell environment only`,
);

let smtp;
try {
  smtp = createSmtpTransport(process.env);
} catch (error) {
  if (error instanceof MailerUnavailableError) {
    console.log(`CONFIG ERROR: ${error.message}`);
    process.exit(1);
  }
  throw error;
}
const { transporter, from, settings } = smtp;

// Le mot de passe (et ses encodages AUTH PLAIN / LOGIN) ne doit jamais
// apparaitre, meme si un serveur le renvoie dans sa reponse.
const pass = process.env.SMTP_PASS ?? "";
const secrets = [
  pass,
  Buffer.from(pass).toString("base64"),
  Buffer.from(`\u0000${settings.user}\u0000${pass}`).toString("base64"),
]
  .filter((value) => value.length > 0)
  .sort((a, b) => b.length - a.length); // le payload AUTH complet d'abord
function redact(value) {
  let out = String(value);
  for (const secret of secrets) out = out.split(secret).join("[redacted]");
  return out;
}

function maskUser(user) {
  const at = user.lastIndexOf("@");
  return at < 0 ? `${user.slice(0, 3)}***` : `${user.slice(0, Math.min(3, at))}***${user.slice(at)}`;
}

function printError(label, error) {
  const e = error ?? {};
  console.log(`${label} FAILED`);
  for (const key of ["code", "command", "responseCode", "response", "message"]) {
    console.log(`  ${key.padEnd(12)} ${e[key] === undefined ? "-" : redact(e[key])}`);
  }
}

console.log(`host:    ${settings.host}`);
console.log(`port:    ${settings.port}`);
console.log(`secure:  ${settings.secure}`);
console.log(`user:    ${maskUser(settings.user)}`);
console.log(`from:    ${redact(from)}`);
console.log(`to:      ${to}`);

console.log("\n[1/2] transporter.verify() (connection + auth; up to 2 min on network timeout)");
let verified = false;
try {
  await transporter.verify();
  verified = true;
  console.log("VERIFY OK");
} catch (error) {
  printError("VERIFY", error);
}

console.log("\n[2/2] sendMail()");
let sent = false;
try {
  const info = await transporter.sendMail({
    from,
    to,
    subject: "Welearn - test SMTP (mail:test)",
    text:
      `E-mail de test envoye par "npm run mail:test" depuis ${os.hostname()} ` +
      `le ${new Date().toISOString()}.\nAucune action requise.`,
  });
  sent = true;
  console.log(`SENT (messageId ${info.messageId})`);
  if (info.response) console.log(`  response     ${redact(info.response)}`);
} catch (error) {
  printError("SEND", error);
}

transporter.close();
process.exitCode = verified && sent ? 0 : 1;
