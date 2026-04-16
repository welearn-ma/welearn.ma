import type { Request, Response } from "express";
import nodemailer from "nodemailer";
import type { ContactPayload, ContactResponse } from "../types/contact";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9\s().-]{8,20}$/;

function isEmpty(value: unknown): value is undefined | null | "" {
  return value === undefined || value === null || value === "";
}

export async function submitContactRequest(
  req: Request,
  res: Response<ContactResponse>,
) {
  const payload = req.body as Partial<ContactPayload>;

  if (isEmpty(payload.fullName)) {
    return res
      .status(400)
      .json({ success: false, message: "fullName is required" });
  }

  if (isEmpty(payload.email)) {
    return res
      .status(400)
      .json({ success: false, message: "email is required" });
  }

  if (!emailRegex.test(String(payload.email).trim())) {
    return res.status(400).json({
      success: false,
      message: "email format is invalid",
    });
  }

  if (
    !isEmpty(payload.phone) &&
    !phoneRegex.test(String(payload.phone).trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "phone format is invalid",
    });
  }

  if (isEmpty(payload.subject)) {
    return res
      .status(400)
      .json({ success: false, message: "subject is required" });
  }

  if (isEmpty(payload.message)) {
    return res
      .status(400)
      .json({ success: false, message: "message is required" });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    console.error("Missing SMTP configuration in environment variables.");
    return res.status(500).json({
      success: false,
      message: "Configuration email manquante sur le serveur",
    });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const recipient = process.env.CONTACT_RECIPIENT || "contact@welearn.ma";
  const smtpFrom = process.env.SMTP_FROM || smtpUser;

  const fullName = String(payload.fullName).trim();
  const email = String(payload.email).trim();
  const phone = String(payload.phone || "").trim();
  const subject = String(payload.subject).trim();
  const message = String(payload.message).trim();

  // Show sender's name in the From display name; replyTo routes replies to the actual sender
  const fromHeader = `"${fullName} via Welearn" <${smtpFrom}>`;

  const htmlBody = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nouvelle demande de contact</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#1B5FAA;padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">Welearn</p>
              <p style="margin:6px 0 0;font-size:13px;color:#aacbee;letter-spacing:1px;text-transform:uppercase;">Nouvelle demande de contact</p>
            </td>
          </tr>

          <!-- Orange accent bar -->
          <tr>
            <td style="background-color:#E8721C;height:4px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">

              <!-- Intro -->
              <p style="margin:0 0 28px;font-size:15px;color:#374151;line-height:1.6;">
                Vous avez reçu un nouveau message via le formulaire de contact du site <strong>welearn.ma</strong>.
              </p>

              <!-- Info table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:28px;">
                <tr>
                  <td style="padding:12px 16px;background-color:#E6F1FB;border-left:4px solid #1B5FAA;font-size:13px;font-weight:700;color:#0D3D6E;width:130px;vertical-align:top;">Nom</td>
                  <td style="padding:12px 16px;background-color:#f8fafc;font-size:14px;color:#1f2937;vertical-align:top;">${fullName}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;background-color:#E6F1FB;border-left:4px solid #1B5FAA;font-size:13px;font-weight:700;color:#0D3D6E;vertical-align:top;">Email</td>
                  <td style="padding:12px 16px;background-color:#ffffff;font-size:14px;color:#1f2937;vertical-align:top;"><a href="mailto:${email}" style="color:#1B5FAA;text-decoration:none;">${email}</a></td>
                </tr>
                ${
                  phone
                    ? `<tr>
                  <td style="padding:12px 16px;background-color:#E6F1FB;border-left:4px solid #1B5FAA;font-size:13px;font-weight:700;color:#0D3D6E;vertical-align:top;">Téléphone</td>
                  <td style="padding:12px 16px;background-color:#f8fafc;font-size:14px;color:#1f2937;vertical-align:top;">${phone}</td>
                </tr>`
                    : ""
                }
                <tr>
                  <td style="padding:12px 16px;background-color:#E6F1FB;border-left:4px solid #1B5FAA;font-size:13px;font-weight:700;color:#0D3D6E;vertical-align:top;">Sujet</td>
                  <td style="padding:12px 16px;background-color:#ffffff;font-size:14px;color:#1f2937;vertical-align:top;">${subject}</td>
                </tr>
              </table>

              <!-- Message block -->
              <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#0D3D6E;text-transform:uppercase;letter-spacing:0.5px;">Message</p>
              <div style="background-color:#f8fafc;border-left:4px solid #E8721C;border-radius:0 6px 6px 0;padding:16px 20px;font-size:14px;color:#374151;line-height:1.7;white-space:pre-wrap;">${message.replace(/\n/g, "<br />")}</div>

            </td>
          </tr>

          <!-- Reply CTA -->
          <tr>
            <td style="padding:0 40px 36px;text-align:center;">
              <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}"
                 style="display:inline-block;background-color:#E8721C;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:6px;letter-spacing:0.3px;">
                Répondre à ${fullName}
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0D3D6E;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#8ba8c9;">© ${new Date().getFullYear()} Welearn — welearn.ma</p>
              <p style="margin:6px 0 0;font-size:11px;color:#6b8aad;">Ce message a été envoyé depuis le formulaire de contact du site.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: fromHeader,
      to: recipient,
      replyTo: `"${fullName}" <${email}>`,
      subject: `[Contact Welearn] ${subject}`,
      text: [
        "Nouvelle demande de contact — welearn.ma",
        "",
        `Nom: ${fullName}`,
        `Email: ${email}`,
        phone ? `Telephone: ${phone}` : "",
        `Sujet: ${subject}`,
        "",
        "Message:",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
      html: htmlBody,
    });

    return res.status(201).json({
      success: true,
      message: "Message envoye avec succes",
    });
  } catch (error) {
    console.error("Failed to send contact email:", error);
    return res.status(500).json({
      success: false,
      message: "Impossible d'envoyer le message pour le moment",
    });
  }
}
