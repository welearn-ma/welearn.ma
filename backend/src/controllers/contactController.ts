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
  const sender = process.env.SMTP_FROM || smtpUser;

  const fullName = String(payload.fullName).trim();
  const email = String(payload.email).trim();
  const phone = String(payload.phone || "").trim();
  const subject = String(payload.subject).trim();
  const message = String(payload.message).trim();

  try {
    await transporter.sendMail({
      from: sender,
      to: recipient,
      replyTo: email,
      subject: `[Contact Welearn] ${subject}`,
      text: [
        "Nouvelle demande de contact",
        "",
        `Nom: ${fullName}`,
        `Email: ${email}`,
        `Telephone: ${phone || "Non renseigne"}`,
        `Sujet: ${subject}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <h2>Nouvelle demande de contact</h2>
        <p><strong>Nom:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telephone:</strong> ${phone || "Non renseigne"}</p>
        <p><strong>Sujet:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
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
