import { createStudentProofsRouter } from "../commerce/studentProofs";
import { commerceStore, contactRecipient, mailer, proofFiles, siteUrl } from "./commerceDeps";

// POST /api/students/proofs (monte APRES le cors() global : appele par le site).
export default createStudentProofsRouter({
  store: commerceStore,
  files: proofFiles,
  mailer,
  notifyRecipient: contactRecipient,
  siteUrl,
});
