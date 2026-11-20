import { readCmiConfig } from "../config/cmi";
import { createPaymentsRouter } from "../payments/router";
import { supabasePaymentStore } from "../payments/supabaseStore";

// Lu une fois au demarrage (dotenv est charge en premier dans index.ts).
const cmi = readCmiConfig(process.env);

if (cmi.enabled) {
  console.log(
    `[payments] CMI payments enabled (gateway host: ${new URL(cmi.config.gatewayUrl).host})`,
  );
} else {
  console.error(
    `[payments] *** CMI PAYMENTS DISABLED *** missing or invalid env vars: ${cmi.problems.join(", ")}. ` +
      "/api/payments answers 'unavailable' until they are set; other routes are unaffected.",
  );
}

export default createPaymentsRouter({ cmi, store: supabasePaymentStore });
