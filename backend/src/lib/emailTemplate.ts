/**
 * Gabarit HTML des e-mails (meme charte que contactController : en-tete
 * bleu, filet orange, pied bleu nuit). TOUT texte est echappe ; les liens
 * ne sont rendus que pour des URLs http(s).
 */

export type Segment = string | { text: string; bold?: boolean; href?: string };
export type Paragraph = Segment[];

export interface EmailContent {
  /** Sous-titre de l'en-tete (ex. « Justificatif etudiant »). */
  heading: string;
  paragraphs: Paragraph[];
  /** Lignes d'information (libelle / valeur), facultatives. */
  rows?: Array<[string, string]>;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function segmentHtml(segment: Segment): string {
  if (typeof segment === "string") {
    return escapeHtml(segment);
  }
  let html = escapeHtml(segment.text);
  if (segment.bold) {
    html = `<strong>${html}</strong>`;
  }
  if (segment.href && isHttpUrl(segment.href)) {
    html = `<a href="${escapeHtml(segment.href)}" style="color:#1B5FAA;">${html}</a>`;
  }
  return html;
}

function segmentText(segment: Segment): string {
  if (typeof segment === "string") {
    return segment;
  }
  if (segment.href && isHttpUrl(segment.href) && segment.href !== segment.text) {
    return `${segment.text} (${segment.href})`;
  }
  return segment.text;
}

export function renderEmail(
  content: EmailContent,
  year: number = new Date().getFullYear(),
): { html: string; text: string } {
  const paragraphsHtml = content.paragraphs
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">${paragraph
          .map(segmentHtml)
          .join("")}</p>`,
    )
    .join("\n");

  const rowsHtml = content.rows?.length
    ? `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:8px 0 16px;">${content.rows
        .map(
          ([label, value]) =>
            `<tr><td style="padding:10px 14px;background-color:#E6F1FB;border-left:4px solid #1B5FAA;font-size:13px;font-weight:700;color:#0D3D6E;width:130px;vertical-align:top;">${escapeHtml(
              label,
            )}</td><td style="padding:10px 14px;background-color:#f8fafc;font-size:14px;color:#1f2937;vertical-align:top;">${escapeHtml(
              value,
            )}</td></tr>`,
        )
        .join("")}</table>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(content.heading)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <tr>
            <td style="background-color:#1B5FAA;padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">Welearn</p>
              <p style="margin:6px 0 0;font-size:13px;color:#aacbee;letter-spacing:1px;text-transform:uppercase;">${escapeHtml(content.heading)}</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#E8721C;height:4px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:36px 40px 20px;">
${paragraphsHtml}
${rowsHtml}
            </td>
          </tr>
          <tr>
            <td style="background-color:#0D3D6E;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#8ba8c9;">© ${year} Welearn — <a href="https://welearn.ma" style="color:#8ba8c9;text-decoration:none;">welearn.ma</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    ...content.paragraphs.map((paragraph) => paragraph.map(segmentText).join("")),
    ...(content.rows ?? []).map(([label, value]) => `${label} : ${value}`),
    "",
    `© ${year} Welearn — welearn.ma`,
  ].join("\n\n");

  return { html, text };
}
