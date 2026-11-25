"use client";

import { useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { STUDENT_PROOF_FORMATIONS } from "@/data/payment";
import { submitStudentProof } from "@/lib/api/students";
import { normalizePhone, validateCustomerPhone } from "@/lib/payments/checkout-validation";
import { PHONE_COUNTRIES } from "@/lib/phone-countries";
import {
  PaymentContactLine,
  PaymentResultHeader,
  PaymentResultShell,
} from "./PaymentResult";
import { isValidEmail } from "@/lib/email";

/*
 * Dépôt du justificatif de statut étudiant (Pack Étudiants) :
 * POST multipart /api/students/proofs. Règles du backend
 * (backend/src/commerce/studentProofs.ts) : PDF / JPG / PNG, 5 Mo maximum,
 * consentement obligatoire. Seul `formation` est lu dans l'URL.
 */

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["application/pdf", "image/jpeg", "image/jpg", "image/png"]);
const ACCEPTED_EXTENSIONS = /\.(pdf|jpe?g|png)$/i;
const DIAL_CODES = new Set(PHONE_COUNTRIES.map((country) => country.dialCode));

const MESSAGES = {
  name: "Merci de renseigner votre nom et prénom.",
  email: "Merci de saisir une adresse e-mail valide.",
  fileMissing: "Merci de joindre votre justificatif.",
  fileType: "Formats acceptés : PDF, JPG ou PNG.",
  fileSize: "Le fichier ne doit pas dépasser 5 Mo.",
  consent: "Merci d'accepter le traitement de votre justificatif.",
} as const;

type Field = "full_name" | "email" | "phone" | "file" | "consent";
type FormErrors = Partial<Record<Field, string>>;
const FOCUS_ORDER: Field[] = ["full_name", "email", "phone", "file", "consent"];
const FOCUS_ID: Record<Field, string> = {
  full_name: "proof_full_name",
  email: "proof_email",
  phone: "proof_phone",
  file: "proof_file",
  consent: "proof_consent",
};

const inputClass =
  "mt-1 h-11 border-wl-border text-wl-text placeholder:text-wl-text-tertiary focus-visible:border-wl-blue focus-visible:ring-wl-blue/25";
const linkClass = "text-wl-blue underline underline-offset-2 hover:no-underline";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-xs text-red-600">
      {message}
    </p>
  );
}

function formatSize(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} Mo`
    : `${Math.max(1, Math.round(bytes / 1024))} Ko`;
}

export function StudentProofForm() {
  const pageSlug = useSearchParams().get("formation")?.trim() ?? "";
  const formationTitle = Object.prototype.hasOwnProperty.call(STUDENT_PROOF_FORMATIONS, pageSlug)
    ? STUDENT_PROOF_FORMATIONS[pageSlug]
    : null;

  const mountedAt = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!formationTitle) {
    return (
      <PaymentResultShell>
        <PaymentResultHeader tone="warning" icon={SearchX} title="Formation inconnue" />
        <PaymentContactLine />
      </PaymentResultShell>
    );
  }

  const phoneValue = DIAL_CODES.has(phone.trim()) ? "" : normalizePhone(phone);

  const clearError = (field: Field) =>
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    const name = fullName.trim();
    if (!name || Array.from(name).length > 255) next.full_name = MESSAGES.name;
    const mail = email.trim();
    if (!isValidEmail(mail)) next.email = MESSAGES.email;
    const phoneError = validateCustomerPhone(phoneValue);
    if (phoneError) next.phone = phoneError;
    if (!file || file.size === 0) {
      next.file = MESSAGES.fileMissing;
    } else if (!(ACCEPTED_TYPES.has(file.type) || (!file.type && ACCEPTED_EXTENSIONS.test(file.name)))) {
      next.file = MESSAGES.fileType;
    } else if (file.size > MAX_BYTES) {
      next.file = MESSAGES.fileSize;
    }
    if (!consent) next.consent = MESSAGES.consent;
    return next;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setSubmitError(null);

    const nextErrors = validate();
    setErrors(nextErrors);
    const firstInvalid = FOCUS_ORDER.find((field) => nextErrors[field]);
    if (firstInvalid || !file) {
      if (firstInvalid) document.getElementById(FOCUS_ID[firstInvalid])?.focus();
      return;
    }

    const form = new FormData();
    form.append("full_name", fullName.trim());
    form.append("email", email.trim());
    form.append("phone", phoneValue);
    form.append("page_slug", pageSlug);
    form.append("consent", "on");
    form.append("website", honeypotRef.current?.value ?? "");
    form.append("elapsed_ms", String(Math.round(Date.now() - mountedAt.current)));
    form.append("file", file, file.name);

    setIsSubmitting(true);
    const result = await submitStudentProof(form);
    setIsSubmitting(false);
    if (result.ok) {
      setIsSent(true);
    } else {
      setSubmitError(result.message);
    }
  };

  if (isSent) {
    return (
      <PaymentResultShell>
        <PaymentResultHeader tone="success" icon={CheckCircle2} title="Justificatif envoyé" />
        <p className="mt-4 text-center text-sm leading-relaxed text-wl-text-secondary sm:text-base">
          Justificatif envoyé. Vous recevrez votre code par e-mail après vérification.
        </p>
        <PaymentContactLine />
      </PaymentResultShell>
    );
  }

  return (
    <section className="bg-wl-gray-light py-10 sm:py-14">
      <div className="mx-auto max-w-2xl px-4">
        <form
          onSubmit={(event) => void handleSubmit(event)}
          noValidate
          className="overflow-hidden rounded-3xl border border-wl-border bg-white shadow-[0_20px_60px_-40px_rgba(13,61,110,0.55)]"
        >
          <div className="border-b border-wl-border bg-linear-to-r from-wl-blue-tint via-white to-wl-orange-tint px-5 py-4 sm:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-wl-orange">
              Pack Étudiants
            </p>
            <h1 className="mt-1 text-lg font-semibold text-wl-text sm:text-xl">
              Justificatif de statut étudiant
            </h1>
            <p className="mt-1 text-sm text-wl-text-secondary">{formationTitle}</p>
          </div>

          <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
            {submitError ? (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p>{submitError}</p>
              </div>
            ) : null}

            {/* Piège anti-robot : invisible, doit rester vide. */}
            <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
              <label htmlFor="proof_website">Site web</label>
              <input ref={honeypotRef} id="proof_website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>

            <div>
              <Label htmlFor="proof_full_name" className="text-sm font-medium text-wl-text">
                Nom et prénom
              </Label>
              <Input
                id="proof_full_name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  clearError("full_name");
                }}
                maxLength={255}
                autoComplete="name"
                aria-invalid={Boolean(errors.full_name)}
                aria-describedby={errors.full_name ? "proof_full_name-error" : undefined}
                className={inputClass}
              />
              <FieldError id="proof_full_name-error" message={errors.full_name} />
            </div>

            <div>
              <Label htmlFor="proof_email" className="text-sm font-medium text-wl-text">
                Adresse e-mail
              </Label>
              <Input
                id="proof_email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError("email");
                }}
                maxLength={64}
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "proof_email-error" : undefined}
                className={inputClass}
              />
              <FieldError id="proof_email-error" message={errors.email} />
            </div>

            <div>
              <Label htmlFor="proof_phone" className="text-sm font-medium text-wl-text">
                Téléphone (facultatif)
              </Label>
              <PhoneInput
                id="proof_phone"
                value={phone}
                onChange={(value) => {
                  setPhone(value);
                  clearError("phone");
                }}
                aria-invalid={Boolean(errors.phone)}
                className="mt-1"
              />
              <FieldError id="proof_phone-error" message={errors.phone} />
            </div>

            <div>
              <Label htmlFor="proof_file" className="text-sm font-medium text-wl-text">
                Justificatif de statut étudiant
              </Label>
              <p id="proof_file-hint" className="mt-1 text-xs text-wl-text-tertiary">
                PDF, JPG ou PNG — 5 Mo maximum.
              </p>
              <input
                id="proof_file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                onChange={(e) => {
                  setFile(e.target.files?.[0] ?? null);
                  clearError("file");
                }}
                aria-invalid={Boolean(errors.file)}
                aria-describedby={errors.file ? "proof_file-hint proof_file-error" : "proof_file-hint"}
                className="mt-2 block w-full rounded-md border border-wl-border bg-white text-sm text-wl-text-secondary file:mr-3 file:h-11 file:cursor-pointer file:border-0 file:border-r file:border-wl-border file:bg-wl-blue-tint file:px-4 file:text-sm file:font-medium file:text-wl-blue focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-wl-blue/25"
              />
              {file ? (
                <p className="mt-1 text-xs text-wl-text-secondary">
                  {file.name} · {formatSize(file.size)}
                </p>
              ) : null}
              <FieldError id="proof_file-error" message={errors.file} />
            </div>

            <div>
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 transition-colors ${
                  consent
                    ? "border-wl-blue bg-wl-blue-tint"
                    : errors.consent
                      ? "border-red-300 bg-white hover:border-wl-blue/40"
                      : "border-wl-border bg-white hover:border-wl-blue/40"
                }`}
              >
                <input
                  type="checkbox"
                  id="proof_consent"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    clearError("consent");
                  }}
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? "proof_consent-error" : undefined}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-wl-border accent-wl-blue"
                />
                <span className="text-sm leading-relaxed text-wl-text">
                  J'accepte que WELEARN traite ce justificatif uniquement pour vérifier mon statut
                  étudiant, conformément à la{" "}
                  <a href="/confidentialite/" target="_blank" rel="noopener noreferrer" className={linkClass}>
                    Politique de confidentialité
                    <span className="sr-only"> (nouvel onglet)</span>
                  </a>
                  .
                </span>
              </label>
              <FieldError id="proof_consent-error" message={errors.consent} />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full bg-wl-blue text-white transition-all duration-200 hover:bg-wl-blue-dark"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Envoi en cours…
                </>
              ) : (
                "Envoyer mon justificatif"
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
