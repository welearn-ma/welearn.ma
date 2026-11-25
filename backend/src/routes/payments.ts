import { readCmiConfig } from "../config/cmi";
import { startPendingExpiryTimer } from "../payments/expiry";
import { createPaymentsRouter } from "../payments/router";
import { supabasePaymentStore } from "../payments/supabaseStore";
import { contactRecipient, mailer } from "./commerceDeps";

// Lu une fois au demarrage (dotenv est charge en premier dans index.ts).
const cmi = readCmiConfig(process.env);

if (cmi.enabled) {
  console.log(
    `[payments] CMI payments enabled (gateway host: ${new URL(cmi.config.gatewayUrl).host})`,
  );
  // Expiration des PENDING > 45 min : best effort (source de verite : /cmi/init).
  startPendingExpiryTimer(supabasePaymentStore);
} else {
  console.error(
    `[payments] *** CMI PAYMENTS DISABLED *** missing or invalid env vars: ${cmi.problems.join(", ")}. ` +
      "/api/payments answers 'unavailable' until they are set; other routes are unaffected.",
  );
}

// E-mails des commandes payees : mailer partage, equipe = CONTACT_RECIPIENT.
export default createPaymentsRouter({
  cmi,
  store: supabasePaymentStore,
  orderEmails: { mailer, contactRecipient },
});
