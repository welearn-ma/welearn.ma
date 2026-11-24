import { createStudentProofsRouter } from "../commerce/studentProofs";
import { commerceStore, contactRecipient, mailer, proofFiles } from "./commerceDeps";

// POST /api/students/proofs (monte APRES le cors() global : appele par le site).
export default createStudentProofsRouter({
  store: commerceStore,
  files: proofFiles,
  mailer,
  notifyRecipient: contactRecipient,
});
