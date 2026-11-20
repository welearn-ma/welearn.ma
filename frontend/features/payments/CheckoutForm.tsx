"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { PaymentSecurityLogos } from "@/components/payment-security-logos";
import type { PaymentProduct } from "@/data/payment";
import { cmiInitUrl, getPaymentsApiBaseUrl } from "@/lib/api/payments";
import {
  CHECKOUT_MESSAGES,
  MAX_EMAIL_LENGTH,
  MAX_NAME_LENGTH,
  normalizePhone,
  validateCustomerEmail,
  validateCustomerName,
  validateCustomerPhone,
} from "@/lib/payments/checkout-validation";
import { PHONE_COUNTRIES } from "@/lib/phone-countries";

type AccessChoice = "immediate" | "after_withdrawal";

/** Libellés de l'article 8 des CGV : texte exact, ne pas reformuler. */
const ACCESS_OPTIONS: ReadonlyArray<{ value: AccessChoice; text: string }> = [
  {
    value: "immediate",
    text: "Accès immédiat (sous 24 heures ouvrées après confirmation du paiement). Je reconnais renoncer à mon droit de rétractation dès l'ouverture effective de l'accès.",
  },
  {
    value: "after_withdrawal",
    text: "Accès à l'expiration du délai légal de rétractation de 7 jours. Mon droit de rétractation est intégralement préservé.",
  },
];

/** Noms des champs postés au backend (backend/src/controllers/paymentController.ts). */
type Field =
  | "customer_name"
  | "customer_email"
  | "customer_phone"
  | "access_choice"
  | "cgv_accepted";
type FormErrors = Partial<Record<Field, string>>;

/** Ordre de l'écran : le premier champ en erreur reçoit le focus. */
const FIELD_FOCUS_ID: ReadonlyArray<[Field, string]> = [
  ["customer_name", "customer_name"],
  ["customer_email", "customer_email"],
  ["customer_phone", "customer_phone"],
  ["access_choice", "access_choice_immediate"],
  ["cgv_accepted", "cgv_accepted"],
];

const DIAL_CODES = new Set(PHONE_COUNTRIES.map((country) => country.dialCode));

const inputClass =
  "mt-1 h-11 border-wl-border text-wl-text placeholder:text-wl-text-tertiary focus-visible:border-wl-blue focus-visible:ring-wl-blue/25";
const linkClass =
  "text-wl-blue underline underline-offset-2 hover:no-underline";

function choiceCardClass(checked: boolean, invalid: boolean) {
  const state = checked
    ? "border-wl-blue bg-wl-blue-tint"
    : invalid
      ? "border-red-300 bg-white hover:border-wl-blue/40"
      : "border-wl-border bg-white hover:border-wl-blue/40";
  return `flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 transition-colors ${state}`;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-xs text-red-600">
      {message}
    </p>
  );
}

function NewTabLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {children}
      <span className="sr-only"> (nouvel onglet)</span>
    </a>
  );
}

/**
 * Formulaire de paiement : POST HTML natif vers le backend (pas de fetch),
 * qui renvoie la page d'auto-soumission vers la passerelle CMI. La
 * validation client bloque l'envoi ; le backend reste la source de vérité.
 */
export function CheckoutForm({ product }: { product: PaymentProduct }) {
  const apiBaseUrl = getPaymentsApiBaseUrl();
  const actionUrl = apiBaseUrl ? cmiInitUrl(apiBaseUrl) : null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [accessChoice, setAccessChoice] = useState<AccessChoice | null>(null);
  const [cgvAccepted, setCgvAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  // PhoneInput vaut "+33" quand seul le pays est choisi : rien à poster.
  const phoneValue = DIAL_CODES.has(phone.trim()) ? "" : normalizePhone(phone);

  // Retour arrière depuis la passerelle (cache navigateur) : le bouton doit
  // redevenir utilisable.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        submittingRef.current = false;
        setIsSubmitting(false);
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  const clearError = (field: Field) =>
    setErrors((current) =>
      current[field] ? { ...current, [field]: undefined } : current,
    );

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    const nameError = validateCustomerName(name);
    const emailError = validateCustomerEmail(email);
    const phoneError = validateCustomerPhone(phoneValue);
    if (nameError) next.customer_name = nameError;
    if (emailError) next.customer_email = emailError;
    if (phoneError) next.customer_phone = phoneError;
    if (!accessChoice) next.access_choice = CHECKOUT_MESSAGES.accessRequired;
    if (!cgvAccepted) next.cgv_accepted = CHECKOUT_MESSAGES.cgvRequired;
    return next;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (submittingRef.current || !actionUrl) {
      event.preventDefault();
      return;
    }

    const nextErrors = validate();
    setErrors(nextErrors);
    const firstInvalid = FIELD_FOCUS_ID.find(([field]) => nextErrors[field]);
    if (firstInvalid) {
      event.preventDefault();
      document.getElementById(firstInvalid[1])?.focus();
      return;
    }

    // Pas de preventDefault : le navigateur poste le formulaire. Seul le
    // bouton est désactivé (des champs désactivés ne seraient pas envoyés).
    submittingRef.current = true;
    setIsSubmitting(true);
  };

  return (
    <form
      method="POST"
      action={actionUrl ?? undefined}
      acceptCharset="UTF-8"
      noValidate
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-3xl border border-wl-border bg-white shadow-[0_20px_60px_-40px_rgba(13,61,110,0.55)]"
    >
      <div className="border-b border-wl-border bg-linear-to-r from-wl-blue-tint via-white to-wl-orange-tint px-5 py-4 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-wl-orange">
          Paiement en ligne
        </p>
        <h1 className="mt-1 text-lg font-semibold text-wl-text sm:text-xl">
          Récapitulatif de la commande
        </h1>
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-wl-text-secondary">Formation</dt>
          <dd className="font-medium text-wl-text">{product.label}</dd>
          <dt className="text-wl-text-secondary">Montant</dt>
          <dd className="font-semibold text-wl-text">
            {product.displayAmount} TTC
          </dd>
        </dl>
      </div>

      <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
        {!actionUrl && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>
              Le paiement en ligne est momentanément indisponible. Merci de
              réessayer plus tard ou de nous contacter.
            </p>
          </div>
        )}

        <input type="hidden" name="formation_slug" value={product.slug} />

        <div>
          <Label htmlFor="customer_name" className="text-sm font-medium text-wl-text">
            Nom et prénom (en caractères latins)
          </Label>
          <p id="customer_name-hint" className="mt-1 text-xs text-wl-text-tertiary">
            Tel qu'il figure sur votre carte, en lettres latines
          </p>
          <Input
            id="customer_name"
            name="customer_name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearError("customer_name");
            }}
            maxLength={MAX_NAME_LENGTH}
            autoComplete="name"
            spellCheck={false}
            required
            aria-invalid={Boolean(errors.customer_name)}
            aria-describedby={
              errors.customer_name
                ? "customer_name-hint customer_name-error"
                : "customer_name-hint"
            }
            className={inputClass}
          />
          <FieldError id="customer_name-error" message={errors.customer_name} />
        </div>

        <div>
          <Label htmlFor="customer_email" className="text-sm font-medium text-wl-text">
            Adresse e-mail
          </Label>
          <Input
            id="customer_email"
            name="customer_email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError("customer_email");
            }}
            maxLength={MAX_EMAIL_LENGTH}
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.customer_email)}
            aria-describedby={errors.customer_email ? "customer_email-error" : undefined}
            className={inputClass}
          />
          <FieldError id="customer_email-error" message={errors.customer_email} />
        </div>

        <div>
          <Label htmlFor="customer_phone" className="text-sm font-medium text-wl-text">
            Téléphone (facultatif)
          </Label>
          {/* PhoneInput n'a pas d'attribut name : la valeur postée est ce champ caché. */}
          <PhoneInput
            id="customer_phone"
            value={phone}
            onChange={(value) => {
              setPhone(value);
              clearError("customer_phone");
            }}
            aria-invalid={Boolean(errors.customer_phone)}
            className="mt-1"
          />
          <input type="hidden" name="customer_phone" value={phoneValue} />
          <FieldError id="customer_phone-error" message={errors.customer_phone} />
        </div>

        <fieldset aria-describedby={errors.access_choice ? "access_choice-error" : undefined}>
          <legend className="text-sm font-medium text-wl-text">
            Accès à la formation (article 8 des CGV)
          </legend>
          <div className="mt-2 space-y-2">
            {ACCESS_OPTIONS.map((option) => {
              const checked = accessChoice === option.value;
              return (
                <label
                  key={option.value}
                  className={choiceCardClass(checked, Boolean(errors.access_choice))}
                >
                  <input
                    type="radio"
                    id={`access_choice_${option.value}`}
                    name="access_choice"
                    value={option.value}
                    checked={checked}
                    onChange={() => {
                      setAccessChoice(option.value);
                      clearError("access_choice");
                    }}
                    required
                    className="mt-0.5 h-4 w-4 shrink-0 accent-wl-blue"
                  />
                  <span className="text-sm leading-relaxed text-wl-text">
                    {option.text}
                  </span>
                </label>
              );
            })}
          </div>
          <FieldError id="access_choice-error" message={errors.access_choice} />
        </fieldset>

        <div>
          <label className={choiceCardClass(cgvAccepted, Boolean(errors.cgv_accepted))}>
            <input
              type="checkbox"
              id="cgv_accepted"
              name="cgv_accepted"
              checked={cgvAccepted}
              onChange={(e) => {
                setCgvAccepted(e.target.checked);
                clearError("cgv_accepted");
              }}
              required
              aria-invalid={Boolean(errors.cgv_accepted)}
              aria-describedby={errors.cgv_accepted ? "cgv_accepted-error" : undefined}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-wl-border accent-wl-blue"
            />
            <span className="text-sm leading-relaxed text-wl-text">
              J'ai lu et j'accepte les{" "}
              <NewTabLink href="/cgv/">Conditions Générales de Vente</NewTabLink>,
              la{" "}
              <NewTabLink href="/remboursement/">Politique de remboursement</NewTabLink>{" "}
              et la{" "}
              <NewTabLink href="/confidentialite/">Politique de confidentialité</NewTabLink>
              .
            </span>
          </label>
          <FieldError id="cgv_accepted-error" message={errors.cgv_accepted} />
        </div>

        <div className="space-y-3 pt-1">
          <PaymentSecurityLogos showSecureNote />

          {/* Pas d'attribut name : le bouton ne doit pas être posté. */}
          <Button
            type="submit"
            disabled={isSubmitting || !actionUrl}
            className="h-11 w-full bg-wl-blue text-white transition-all duration-200 hover:bg-wl-blue-dark"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Redirection vers le paiement sécurisé…
              </>
            ) : (
              `Payer ${product.displayAmount}`
            )}
          </Button>

          <p className="text-center text-xs leading-relaxed text-wl-text-tertiary">
            Vous allez être redirigé vers la plateforme de paiement sécurisée du
            Centre Monétique Interbancaire (CMI).
          </p>
        </div>
      </div>
    </form>
  );
}
