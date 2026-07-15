"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitSponsor } from "@/lib/api/sponsors";
import type { SponsorPayload, SponsorProgram } from "@/types/sponsor";

const MOOCS = [
  "MOOC Etanchéité – Toitures Terrasses et Toitures Inclinées",
  "MOOC Etanchéité – Façade",
  "MOOC Etanchéité – Sous sol, salles d'eau et gradins",
  "MOOC Sécurité Incendie",
  "MOOC Planchers et dalles en béton",
  "MOOC Fondamentaux du BIM",
] as const;

type SponsorshipFormProps = {
  program?: SponsorProgram;
  items?: readonly string[];
};

type FormValues = {
  nom: string;
  prenom: string;
  entreprise: string;
  role: string;
  telephone: string;
  email: string;
};

type FormErrors = Partial<Record<keyof FormValues | "moocs", string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9\s().-]{8,20}$/;

const inputClassName =
  "mt-1 h-11 border-wl-border text-wl-text placeholder:text-wl-text-tertiary focus-visible:border-wl-blue focus-visible:ring-wl-blue/25";

export function SponsorshipForm({ program, items }: SponsorshipFormProps = {}) {
  // Sans props, le rendu et le payload restent identiques au /sponsoring
  // historique ; seuls les items et le libellé du sélecteur varient.
  const choices = items ?? MOOCS;
  const isFnpi = program === "fnpi";
  const itemsLegend = isFnpi ? "Départements à sponsoriser" : "MOOCs à sponsoriser";
  const itemsHint = isFnpi
    ? "Sélectionnez un ou plusieurs départements."
    : "Sélectionnez un ou plusieurs MOOCs.";
  const itemsError = isFnpi
    ? "Sélectionnez au moins un département à sponsoriser."
    : "Sélectionnez au moins un MOOC à sponsoriser.";
  const formTitle = isFnpi
    ? "Parrainer un ou plusieurs départements"
    : "Parrainer un ou plusieurs MOOCs";

  const [values, setValues] = useState<FormValues>({
    nom: "",
    prenom: "",
    entreprise: "",
    role: "",
    telephone: "",
    email: "",
  });
  const [selectedMoocs, setSelectedMoocs] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!values.nom.trim()) nextErrors.nom = "Le nom est requis.";
    if (!values.prenom.trim()) nextErrors.prenom = "Le prénom est requis.";
    if (!values.entreprise.trim())
      nextErrors.entreprise = "L'entreprise est requise.";

    if (!values.telephone.trim()) {
      nextErrors.telephone = "Le téléphone est requis.";
    } else if (!phoneRegex.test(values.telephone)) {
      nextErrors.telephone = "Veuillez saisir un numéro de téléphone valide.";
    }

    if (!values.email.trim()) {
      nextErrors.email = "L'email est requis.";
    } else if (!emailRegex.test(values.email)) {
      nextErrors.email = "Veuillez saisir un email valide.";
    }

    if (selectedMoocs.length === 0) {
      nextErrors.moocs = itemsError;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const toggleMooc = (mooc: string) => {
    setSelectedMoocs((current) =>
      current.includes(mooc)
        ? current.filter((item) => item !== mooc)
        : [...current, mooc],
    );
    setErrors((current) => ({ ...current, moocs: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload: SponsorPayload = {
        nom: values.nom.trim(),
        prenom: values.prenom.trim(),
        entreprise: values.entreprise.trim(),
        role: values.role.trim() || undefined,
        telephone: values.telephone.trim(),
        email: values.email.trim(),
        moocs: selectedMoocs,
        ...(program ? { program } : {}),
      };
      await submitSponsor(payload);
      setIsSubmitted(true);
    } catch (error) {
      if (error instanceof Error && error.message.trim()) {
        setSubmitError(error.message);
      } else {
        setSubmitError(
          "Une erreur est survenue. Veuillez reessayer ou nous contacter directement.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-wl-success/30 bg-wl-success-tint p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <CheckCircle className="mt-0.5 h-5 w-5 text-wl-success" />
          <p className="text-sm font-medium text-wl-text">
            Votre demande de sponsoring a bien été envoyée. Notre équipe vous
            contactera sous 48h.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-3xl border border-wl-border bg-white shadow-[0_20px_60px_-40px_rgba(13,61,110,0.55)]"
    >
      <div className="border-b border-wl-border bg-linear-to-r from-wl-blue-tint via-white to-wl-orange-tint px-5 py-4 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-wl-orange">
          Sponsoring
        </p>
        <h3 className="mt-1 text-lg font-semibold text-wl-text sm:text-xl">
          {formTitle}
        </h3>
        <p className="mt-1 text-sm text-wl-text-secondary">
          Complétez le formulaire et notre équipe vous répond sous 48h.
        </p>
      </div>

      <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
        {submitError && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4" />
            <p>{submitError}</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="nom" className="text-sm font-medium text-wl-text">
              <span className="text-wl-orange">*</span> Nom
            </Label>
            <Input
              id="nom"
              value={values.nom}
              onChange={(e) => handleChange("nom", e.target.value)}
              required
              className={inputClassName}
            />
            {errors.nom && (
              <p className="mt-1 text-xs text-red-600">{errors.nom}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor="prenom"
              className="text-sm font-medium text-wl-text"
            >
              <span className="text-wl-orange">*</span> Prénom
            </Label>
            <Input
              id="prenom"
              value={values.prenom}
              onChange={(e) => handleChange("prenom", e.target.value)}
              required
              className={inputClassName}
            />
            {errors.prenom && (
              <p className="mt-1 text-xs text-red-600">{errors.prenom}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label
              htmlFor="entreprise"
              className="text-sm font-medium text-wl-text"
            >
              <span className="text-wl-orange">*</span> Entreprise
            </Label>
            <Input
              id="entreprise"
              value={values.entreprise}
              onChange={(e) => handleChange("entreprise", e.target.value)}
              required
              className={inputClassName}
            />
            {errors.entreprise && (
              <p className="mt-1 text-xs text-red-600">{errors.entreprise}</p>
            )}
          </div>

          <div>
            <Label htmlFor="role" className="text-sm font-medium text-wl-text">
              Rôle
            </Label>
            <Input
              id="role"
              value={values.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className={inputClassName}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label
              htmlFor="telephone"
              className="text-sm font-medium text-wl-text"
            >
              <span className="text-wl-orange">*</span> Téléphone
            </Label>
            <Input
              id="telephone"
              type="tel"
              value={values.telephone}
              onChange={(e) => handleChange("telephone", e.target.value)}
              required
              className={inputClassName}
            />
            {errors.telephone && (
              <p className="mt-1 text-xs text-red-600">{errors.telephone}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-wl-text">
              <span className="text-wl-orange">*</span> Email
            </Label>
            <Input
              id="email"
              type="email"
              value={values.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              className={inputClassName}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-wl-text">
            <span className="text-wl-orange">*</span> {itemsLegend}
          </legend>
          <p className="mt-1 text-xs text-wl-text-tertiary">
            {itemsHint}
          </p>
          <div className="mt-3 space-y-2">
            {choices.map((mooc) => {
              const checked = selectedMoocs.includes(mooc);
              return (
                <label
                  key={mooc}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 transition-colors ${
                    checked
                      ? "border-wl-blue bg-wl-blue-tint"
                      : "border-wl-border bg-white hover:border-wl-blue/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleMooc(mooc)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-wl-border accent-wl-blue"
                  />
                  <span className="text-sm text-wl-text">{mooc}</span>
                </label>
              );
            })}
          </div>
          {errors.moocs && (
            <p className="mt-2 text-xs text-red-600">{errors.moocs}</p>
          )}
        </fieldset>

        <p className="text-xs leading-relaxed text-wl-text-tertiary">
          En soumettant ce formulaire, vous acceptez d'être recontacté par
          l'équipe Welearn au sujet de votre demande de sponsoring.
        </p>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full bg-wl-blue text-white transition-all duration-200 hover:bg-wl-blue-dark"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            "Envoyer ma demande de sponsoring"
          )}
        </Button>
      </div>
    </form>
  );
}
