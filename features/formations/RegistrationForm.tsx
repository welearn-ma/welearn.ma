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
    } catch {
      setSubmitError(
        "Une erreur est survenue. Veuillez réessayer ou nous contacter directement.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="mt-0.5 h-5 w-5 text-emerald-600" />
          <p className="text-sm font-medium text-emerald-800">
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
      className="space-y-4 rounded-2xl border border-border bg-white p-5 sm:p-6"
    >
      {submitError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4" />
          <p>{submitError}</p>
        </div>
      )}

      <input type="hidden" name="formationSlug" value={formationSlug} />

      <div>
        <Label htmlFor="fullName">Nom complet</Label>
        <Input
          id="fullName"
          value={values.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          required
        />
        {errors.fullName && (
          <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
        )}
      </div>
      <div>
        <Label htmlFor="email">Email professionnel</Label>
        <Input
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email}</p>
        )}
      </div>
      <div>
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          type="tel"
          value={values.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          required
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
        )}
      </div>
      <div>
        <Label htmlFor="company">Entreprise/Organisation</Label>
        <Input
          id="company"
          value={values.company}
          onChange={(e) => handleChange("company", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="position">Poste occupé</Label>
        <Input
          id="position"
          value={values.position}
          onChange={(e) => handleChange("position", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="message">Message/Motivation</Label>
        <Textarea
          id="message"
          rows={4}
          value={values.message}
          onChange={(e) => handleChange("message", e.target.value)}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white hover:bg-primary/90"
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
    </form>
  );
}
