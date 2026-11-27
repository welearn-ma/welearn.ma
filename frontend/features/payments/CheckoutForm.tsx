"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { PaymentSecurityLogos } from "@/components/payment-security-logos";
import { LAST_CHECKOUT_KEY, type PaymentProduct } from "@/data/payment";
import {
  checkPaymentCode,
  cmiInitUrl,
  getPaymentsApiBaseUrl,
  type PublicPromotion,
} from "@/lib/api/payments";
import { normalizeCode } from "@/lib/payments/code";
import {
  CHECKOUT_MESSAGES,
  MAX_EMAIL_LENGTH,
  MAX_NAME_LENGTH,
  normalizePhone,
  validateCustomerEmail,
  validateCustomerName,
  validateCustomerPhone,
} from "@/lib/payments/checkout-validation";
import { formatAmountMad, formatOfferEnd, formatPromotionBadge } from "@/lib/payments/format";
import { PHONE_COUNTRIES } from "@/lib/phone-countries";

/**
 * Produit à payer. `codeMode` : champ code absent (page de test), facultatif
 * (code de réduction) ou obligatoire (Pack Étudiants).
 */
export type CheckoutProduct = PaymentProduct & {
  codeMode?: "none" | "optional" | "required";
  /** Page de dépôt du justificatif (lien affiché si le code est obligatoire). */
  proofPath?: string;
  /**
   * Montants du backend (GET /products/:slug), sans code : `amount` à payer,
   * `list` prix catalogue, `discount` remise de la promotion en cours.
   * Absent sur /paiement/test/ (montant fixe, `displayAmount`).
   */
  pricing?: {
    amount: number;
    list: number;
    discount: number;
    promotion: PublicPromotion | null;
  };
};

const CODE_MESSAGES = {
  required: "Saisissez votre code personnel.",
  // Texte de /paiement/echec/?reason=code_invalid.
  invalid:
    "Ce code n'est pas valide pour cette commande. Vérifiez le code et l'adresse e-mail utilisée, ou contactez-nous.",
  emailFirst: "Saisissez d'abord votre adresse e-mail : le code est lié à cette adresse.",
  rateLimited: "Trop de vérifications depuis cette connexion. Merci de réessayer dans quelques minutes.",
  error: "La vérification du code est momentanément impossible. Merci de réessayer.",
  studentHelp:
    "Le Pack Étudiants nécessite un code personnel, envoyé après validation de votre justificatif étudiant.",
} as const;

/** Code de réduction valide pendant une promotion (CGV art. 5 : non cumulables). */
function notCumulativeMessage(promotion: PublicPromotion | null): string {
  const offer = promotion ? `l'offre ${promotion.label}` : "l'offre en cours";
  return `Les codes de réduction ne sont pas cumulables avec ${offer}, déjà appliquée au prix affiché. Effacez le code pour continuer : il ne sera pas utilisé.`;
}

/** Hors délai : l'offre affichée est terminée, le montant va être relu. */
const OFFER_ENDED_MESSAGE =
  "Cette offre est terminée : le montant a été mis à jour. Vérifiez-le avant de payer.";

type CodeCheck =
  | { state: "idle" }
  | { state: "checking" }
  | {
      state: "valid";
      key: string;
      amount: number;
      list: number;
      discount: number;
      promotion: PublicPromotion | null;
    };

/** Noms des champs postés au backend (backend/src/controllers/paymentController.ts). */
type Field =
  | "customer_name"
  | "customer_email"
  | "customer_phone"
  | "code"
  | "cgv_accepted";
type FormErrors = Partial<Record<Field, string>>;

/** Ordre de l'écran : le premier champ en erreur reçoit le focus. */
const FIELD_FOCUS_ID: ReadonlyArray<[Field, string]> = [
  ["customer_name", "customer_name"],
  ["customer_email", "customer_email"],
  ["customer_phone", "customer_phone"],
  ["code", "payment_code"],
  ["cgv_accepted", "cgv_accepted"],
];

const DIAL_CODES = new Set(PHONE_COUNTRIES.map((country) => country.dialCode));

/**
 * Délai max entre l'appui sur « Payer » et la perte de focus de l'e-mail
 * (sur écran tactile, le focus change au relâchement) : au-delà, l'appui
 * est ignoré.
 */
const PAY_PRESS_WINDOW_MS = 2000;

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
export function CheckoutForm({
  product,
  initialCode = null,
  onPricingExpired,
}: {
  product: CheckoutProduct;
  /**
   * Code du lien de l'e-mail (?code=, forme canonique) : pré-remplit le champ
   * code, puis est vérifié automatiquement une fois l'e-mail saisi.
   */
  initialCode?: string | null;
  /** Promotion affichée terminée au moment de payer : relire le produit. */
  onPricingExpired?: () => void;
}) {
  const apiBaseUrl = getPaymentsApiBaseUrl();
  const actionUrl = apiBaseUrl ? cmiInitUrl(apiBaseUrl) : null;
  const codeMode = product.codeMode ?? "none";
  const linkCode = codeMode !== "none" ? initialCode : null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState(linkCode ?? "");
  const [codeCheck, setCodeCheck] = useState<CodeCheck>({ state: "idle" });
  const [cgvAccepted, setCgvAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [offerNotice, setOfferNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  // Dernier couple code / e-mail vérifié automatiquement (une seule fois).
  const autoCheckedKeyRef = useRef<string | null>(null);
  // Instant de l'appui sur « Payer » (pointerdown, avant la perte de focus).
  const payPressedAtRef = useRef<number | null>(null);

  // PhoneInput vaut "+33" quand seul le pays est choisi : rien à poster.
  const phoneValue = DIAL_CODES.has(phone.trim()) ? "" : normalizePhone(phone);

  // Code vérifié pour CE code et CET e-mail (sinon il faut revérifier).
  const canonicalCode = normalizeCode(code);
  const codeKey = `${canonicalCode}|${email.trim().toLowerCase()}`;
  const verified = codeCheck.state === "valid" && codeCheck.key === codeKey ? codeCheck : null;
  // Montant affiché : celui calculé par le backend pour le code vérifié,
  // sinon celui du produit (promotion en cours comprise).
  const payAmount = verified ? formatAmountMad(verified.amount) : product.displayAmount;

  // Récapitulatif : prix catalogue, remise (code ou promotion), total TTC.
  const promotion = verified ? verified.promotion : (product.pricing?.promotion ?? null);
  const listAmount = verified ? verified.list : (product.pricing?.list ?? null);
  const discountAmount = verified ? verified.discount : (product.pricing?.discount ?? 0);
  const totalAmount = verified ? verified.amount : (product.pricing?.amount ?? null);
  const promotionBadge = promotion ? formatPromotionBadge(promotion) : null;
  const offerEnd = promotion ? formatOfferEnd(promotion.ends_at) : null;

  // Nouveaux montants (fin de promotion) : un code vérifié avec les anciens
  // doit être revérifié.
  const pricingKey = product.pricing
    ? `${product.pricing.amount}|${product.pricing.promotion?.ends_at ?? ""}`
    : "";
  const lastPricingKeyRef = useRef(pricingKey);
  useEffect(() => {
    if (lastPricingKeyRef.current === pricingKey) return;
    lastPricingKeyRef.current = pricingKey;
    setCodeCheck({ state: "idle" });
    autoCheckedKeyRef.current = null;
  }, [pricingKey]);

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
    if (codeMode !== "none") {
      if (!code.trim()) {
        if (codeMode === "required") next.code = CODE_MESSAGES.required;
      } else if (!canonicalCode) {
        next.code = CODE_MESSAGES.invalid;
      }
    }
    if (!cgvAccepted) next.cgv_accepted = CHECKOUT_MESSAGES.cgvRequired;
    return next;
  };

  /** Vérifie le code auprès du backend ; true si valide pour ce produit et cet e-mail. */
  const verifyCode = async (): Promise<boolean> => {
    if (!apiBaseUrl || codeCheck.state === "checking") return false;
    if (!canonicalCode) {
      setErrors((current) => ({
        ...current,
        code: code.trim() ? CODE_MESSAGES.invalid : CODE_MESSAGES.required,
      }));
      return false;
    }
    if (validateCustomerEmail(email)) {
      setErrors((current) => ({ ...current, code: CODE_MESSAGES.emailFirst }));
      return false;
    }
    const key = codeKey;
    setCodeCheck({ state: "checking" });
    const result = await checkPaymentCode(apiBaseUrl, {
      product: product.slug,
      code: canonicalCode,
      email: email.trim(),
    });
    if (result.status === "valid") {
      setCodeCheck({
        state: "valid",
        key,
        amount: result.amount_mad,
        list: result.list_amount_mad,
        discount: result.discount_mad,
        promotion: result.promotion,
      });
      clearError("code");
      return true;
    }
    setCodeCheck({ state: "idle" });
    setErrors((current) => ({
      ...current,
      code:
        result.status === "invalid"
          ? CODE_MESSAGES.invalid
          : result.status === "not_cumulative"
            ? notCumulativeMessage(product.pricing?.promotion ?? null)
            : result.status === "rate_limited"
              ? CODE_MESSAGES.rateLimited
              : CODE_MESSAGES.error,
    }));
    return false;
  };

  /**
   * Code venu du lien de l'e-mail : vérifié automatiquement (même appel
   * /codes/check, même limite) dès que l'e-mail saisi est valide, à la sortie
   * du champ. Une seule fois par couple code / e-mail ; si le code a été
   * modifié, la vérification redevient manuelle (bouton « Vérifier »).
   *
   * Si le champ perd le focus parce que l'on appuie sur « Payer », rien ici :
   * la vérification désactiverait le bouton et le clic serait perdu. C'est
   * l'envoi (handleSubmit) qui vérifie le code puis envoie le formulaire s'il
   * est valide, sans second clic ; sinon, message d'erreur et pas d'envoi.
   */
  const autoVerifyLinkCode = () => {
    const pressedAt = payPressedAtRef.current;
    payPressedAtRef.current = null;
    if (pressedAt !== null && performance.now() - pressedAt < PAY_PRESS_WINDOW_MS) return;
    if (!linkCode || canonicalCode !== linkCode) return;
    if (verified || codeCheck.state === "checking" || validateCustomerEmail(email)) return;
    if (autoCheckedKeyRef.current === codeKey) return;
    autoCheckedKeyRef.current = codeKey;
    void verifyCode();
  };

  /** Envoi réel (POST natif) : bouton désactivé, produit mémorisé pour « Réessayer ». */
  const markSubmitting = () => {
    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      window.sessionStorage.setItem(LAST_CHECKOUT_KEY, product.slug);
    } catch {
      // Stockage indisponible : « Réessayer » utilisera la cible par défaut.
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    payPressedAtRef.current = null;
    if (submittingRef.current || !actionUrl || codeCheck.state === "checking") {
      event.preventDefault();
      return;
    }

    // Promotion affichée déjà terminée (onglet resté ouvert) : ne pas
    // envoyer un montant qui ne serait plus celui débité.
    if (promotion && Date.now() >= new Date(promotion.ends_at).getTime()) {
      event.preventDefault();
      setOfferNotice(OFFER_ENDED_MESSAGE);
      onPricingExpired?.();
      return;
    }
    setOfferNotice(null);

    const nextErrors = validate();
    setErrors(nextErrors);
    const firstInvalid = FIELD_FOCUS_ID.find(([field]) => nextErrors[field]);
    if (firstInvalid) {
      event.preventDefault();
      document.getElementById(firstInvalid[1])?.focus();
      return;
    }

    // Code saisi mais pas encore vérifié : vérification d'abord, pour que le
    // montant affiché soit celui qui sera débité, puis envoi.
    if (codeMode !== "none" && canonicalCode && !verified) {
      event.preventDefault();
      void verifyCode().then((valid) => {
        if (valid) {
          markSubmitting();
          formRef.current?.submit();
        } else {
          document.getElementById("payment_code")?.focus();
        }
      });
      return;
    }

    // Pas de preventDefault : le navigateur poste le formulaire. Seul le
    // bouton est désactivé (des champs désactivés ne seraient pas envoyés).
    markSubmitting();
  };

  return (
    <form
      ref={formRef}
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
          <dd className={discountAmount ? "text-wl-text-secondary line-through" : "font-semibold text-wl-text"}>
            {listAmount !== null ? formatAmountMad(listAmount) : product.displayAmount} TTC
          </dd>
          {discountAmount && totalAmount !== null ? (
            <>
              <dt className="text-wl-text-secondary">Réduction</dt>
              <dd className="font-medium text-wl-success">
                −{formatAmountMad(discountAmount)} ({promotionBadge ?? canonicalCode})
              </dd>
              <dt className="text-wl-text-secondary">Total</dt>
              <dd className="font-semibold text-wl-text">{formatAmountMad(totalAmount)} TTC</dd>
            </>
          ) : null}
        </dl>
        {promotionBadge && offerEnd ? (
          <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-wl-text-secondary">
            <span className="rounded-full bg-wl-orange px-2 py-0.5 font-semibold text-white">
              {promotionBadge}
            </span>
            Offre valable jusqu&apos;au {offerEnd}
          </p>
        ) : null}
      </div>

      <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
        {offerNotice ? (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-wl-orange/40 bg-wl-orange-tint px-3 py-2 text-sm text-wl-text"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-wl-orange" aria-hidden="true" />
            <p>{offerNotice}</p>
          </div>
        ) : null}

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
            onBlur={autoVerifyLinkCode}
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

        {codeMode !== "none" ? (
          <div>
            <Label htmlFor="payment_code" className="text-sm font-medium text-wl-text">
              {codeMode === "required" ? "Code personnel" : "Code de réduction (facultatif)"}
            </Label>
            {codeMode === "optional" && product.pricing?.promotion ? (
              <p id="payment_code-hint" className="mt-1 text-xs text-wl-text-tertiary">
                Les codes de réduction ne sont pas cumulables avec l&apos;offre{" "}
                {product.pricing.promotion.label}.
              </p>
            ) : null}
            {codeMode === "required" ? (
              <p id="payment_code-hint" className="mt-1 text-xs text-wl-text-tertiary">
                {CODE_MESSAGES.studentHelp}
                {product.proofPath ? (
                  <>
                    {" "}
                    <a href={product.proofPath} className={linkClass}>
                      Envoyer mon justificatif étudiant
                    </a>
                  </>
                ) : null}
              </p>
            ) : null}
            <div className="mt-1 flex gap-2">
              <Input
                id="payment_code"
                name="code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  clearError("code");
                }}
                placeholder="WL-XXXX-XXXX"
                maxLength={20}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                required={codeMode === "required"}
                aria-invalid={Boolean(errors.code)}
                aria-describedby={
                  [
                    codeMode === "required" || (codeMode === "optional" && product.pricing?.promotion)
                      ? "payment_code-hint"
                      : "",
                    errors.code ? "payment_code-error" : "",
                  ]
                    .filter(Boolean)
                    .join(" ") || undefined
                }
                className={`${inputClass} mt-0 font-mono uppercase`}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => void verifyCode()}
                disabled={codeCheck.state === "checking" || !code.trim()}
                className="h-11 shrink-0 border-wl-border text-wl-text hover:border-wl-blue/30 hover:bg-wl-blue-tint hover:text-wl-blue"
              >
                {codeCheck.state === "checking" ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : null}
                Vérifier
              </Button>
            </div>
            {verified ? (
              <p role="status" className="mt-1 flex items-center gap-1.5 text-xs text-wl-success">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                {verified.discount && !verified.promotion
                  ? `Code appliqué : −${formatAmountMad(verified.discount)}.`
                  : "Code valide."}
              </p>
            ) : null}
            <FieldError id="payment_code-error" message={errors.code} />
          </div>
        ) : null}

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
            onPointerDown={(e) => {
              if (e.button === 0) payPressedAtRef.current = performance.now();
            }}
            onPointerCancel={() => {
              payPressedAtRef.current = null;
            }}
            disabled={isSubmitting || !actionUrl || codeCheck.state === "checking"}
            className="h-11 w-full bg-wl-blue text-white transition-all duration-200 hover:bg-wl-blue-dark"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Redirection vers le paiement sécurisé…
              </>
            ) : (
              `Payer ${payAmount}`
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
