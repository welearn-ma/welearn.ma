"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitRegistration } from "@/lib/api/registrations";
import type { RegistrationPayload } from "@/types/registration";

type RegistrationFormProps = {
  formationSlug: string;
  formationTitle: string;
};

type FormValues = Omit<RegistrationPayload, "formationSlug" | "formationTitle">;
type FormErrors = Partial<Record<keyof FormValues, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9\s().-]{8,20}$/;

export function RegistrationForm({
  formationSlug,
  formationTitle,
}: RegistrationFormProps) {
  const [values, setValues] = useState<FormValues>({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!values.fullName.trim())
      nextErrors.fullName = "Le nom complet est requis.";
    if (!values.email.trim())
      nextErrors.email = "L'email professionnel est requis.";
    if (!values.phone.trim()) nextErrors.phone = "Le téléphone est requis.";

    if (values.email && !emailRegex.test(values.email)) {
      nextErrors.email = "Veuillez saisir un email valide.";
    }

    if (values.phone && !phoneRegex.test(values.phone)) {
      nextErrors.phone = "Veuillez saisir un numéro de téléphone valide.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await submitRegistration({
        ...values,
        company: values.company?.trim() || undefined,
        position: values.position?.trim() || undefined,
        message: values.message?.trim() || undefined,
        formationSlug,
        formationTitle,
      });
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
            Votre demande a bien été envoyée. Notre équipe vous contactera sous
            48h.
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
          Inscription
        </p>
        <h3 className="mt-1 text-lg font-semibold text-wl-text sm:text-xl">
          Rejoindre la formation {formationTitle}
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

        <input type="hidden" name="formationSlug" value={formationSlug} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label
              htmlFor="fullName"
              className="text-sm font-medium text-wl-text"
            >
              Nom complet
            </Label>
            <Input
              id="fullName"
              value={values.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              required
              className="mt-1 h-11 border-wl-border text-wl-text placeholder:text-wl-text-tertiary focus-visible:border-wl-blue focus-visible:ring-wl-blue/25"
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-wl-text">
              Email professionnel
            </Label>
            <Input
              id="email"
              type="email"
              value={values.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              className="mt-1 h-11 border-wl-border text-wl-text placeholder:text-wl-text-tertiary focus-visible:border-wl-blue focus-visible:ring-wl-blue/25"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-wl-text">
              Téléphone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={values.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              required
              className="mt-1 h-11 border-wl-border text-wl-text placeholder:text-wl-text-tertiary focus-visible:border-wl-blue focus-visible:ring-wl-blue/25"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor="company"
              className="text-sm font-medium text-wl-text"
            >
              Entreprise/Organisation
            </Label>
            <Input
              id="company"
              value={values.company}
              onChange={(e) => handleChange("company", e.target.value)}
              className="mt-1 h-11 border-wl-border text-wl-text placeholder:text-wl-text-tertiary focus-visible:border-wl-blue focus-visible:ring-wl-blue/25"
            />
          </div>
        </div>

        <div>
          <Label
            htmlFor="position"
            className="text-sm font-medium text-wl-text"
          >
            Poste occupé
          </Label>
          <Input
            id="position"
            value={values.position}
            onChange={(e) => handleChange("position", e.target.value)}
            className="mt-1 h-11 border-wl-border text-wl-text placeholder:text-wl-text-tertiary focus-visible:border-wl-blue focus-visible:ring-wl-blue/25"
          />
        </div>

        <div>
          <Label htmlFor="message" className="text-sm font-medium text-wl-text">
            Message/Motivation
          </Label>
          <Textarea
            id="message"
            rows={5}
            value={values.message}
            onChange={(e) => handleChange("message", e.target.value)}
            className="mt-1 resize-none border-wl-border text-wl-text placeholder:text-wl-text-tertiary focus-visible:border-wl-blue focus-visible:ring-wl-blue/25"
          />
        </div>

        <p className="text-xs leading-relaxed text-wl-text-tertiary">
          En soumettant ce formulaire, vous acceptez d'être recontacté par
          l'équipe Welearn pour cette formation.
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
            "Demander une inscription"
          )}
        </Button>
      </div>
    </form>
  );
}
