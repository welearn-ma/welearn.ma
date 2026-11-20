/**
 * Page HTML minimale (UTF-8, aucune ressource externe) qui poste les champs
 * signes vers la passerelle CMI : soumission automatique en JS + bouton
 * visible pour les navigateurs sans JS.
 *
 * Le bouton n'a PAS d'attribut "name" : sinon il serait poste avec le
 * formulaire et fausserait le hash (kit V2.0, notice 4.1.4).
 */

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderAutoSubmitPage(
  gatewayUrl: string,
  fields: ReadonlyArray<readonly [string, string]>,
): string {
  const inputs = fields
    .map(
      ([name, value]) =>
        `      <input type="hidden" name="${escapeHtml(name)}" value="${escapeHtml(value)}">`,
    )
    .join("\n");

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>Redirection vers le paiement</title>
  </head>
  <body>
    <form id="cmi-payment-form" method="post" action="${escapeHtml(gatewayUrl)}" accept-charset="UTF-8">
${inputs}
      <p>Redirection vers la page de paiement sécurisée du CMI…</p>
      <button type="submit">Continuer vers le paiement</button>
    </form>
    <script>document.getElementById("cmi-payment-form").submit();</script>
  </body>
</html>
`;
}
