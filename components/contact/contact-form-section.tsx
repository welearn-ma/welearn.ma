"use client";

import type React from "react";
import { useState } from "react";
import { submitContact } from "../../lib/api/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle } from "lucide-react";

export function ContactFormSection() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await submitContact({
        fullName: `${firstName} ${lastName}`.trim(),
        email,
        phone: phone || undefined,
        subject,
        message,
      });

      setSubmitted(true);
      e.currentTarget.reset();
    } catch (error) {
      const messageText =
        error instanceof Error
          ? error.message
          : "Impossible d'envoyer votre message pour le moment.";
      setErrorMessage(messageText);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-wl-border bg-white p-8 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      {submitted ? (
        <div className="flex flex-col items-center justify-center h-full py-12">
          <div className="p-4 bg-wl-success-tint rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-wl-success" />
          </div>
          <h3 className="font-sans text-2xl font-bold text-wl-text mb-2">
            Message envoyé !
          </h3>
          <p className="text-wl-text-secondary text-center max-w-md">
            Merci pour votre message. Notre equipe vous repondra dans les plus
            brefs delais.
          </p>
        </div>
      ) : (
        <div className="flex h-full flex-col justify-between">
          <h3 className="font-sans text-2xl font-bold text-wl-text mb-6">
            Envoyez-nous un message
          </h3>
          <form onSubmit={handleSubmit} className="flex h-full flex-col gap-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <Input id="firstName" placeholder="Votre prénom" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input id="lastName" placeholder="Votre nom" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" type="tel" placeholder="+212 6XX XXX XXX" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Sujet *</Label>
              <Input
                id="subject"
                placeholder="Objet de votre message"
                required
              />
            </div>

            <div className="flex flex-1 flex-col space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                placeholder="Décrivez votre projet ou posez votre question..."
                rows={5}
                className="min-h-40 flex-1 resize-none"
                required
              />
            </div>

            {errorMessage && (
              <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full bg-wl-blue hover:bg-wl-blue-dark text-white transition-all duration-200"
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
              <Send className="ml-2 h-5 w-5" />
            </Button>

            <p className="text-xs text-wl-text-secondary text-center">
              En soumettant ce formulaire, vous acceptez notre{" "}
              <a
                href="/confidentialite"
                className="text-wl-blue hover:underline"
              >
                politique de confidentialité
              </a>
              .
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
