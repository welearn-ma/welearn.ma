"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle } from "lucide-react";

export function ContactFormSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-secondary rounded-2xl p-8">
      {submitted ? (
        <div className="flex flex-col items-center justify-center h-full py-12">
          <div className="p-4 bg-primary/10 rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <h3 className="font-sans text-2xl font-bold text-foreground mb-2">
            Message envoyé !
          </h3>
          <p className="text-muted-foreground text-center">
            Merci pour votre message. Notre équipe vous répondra dans les plus
            brefs délais.
          </p>
        </div>
      ) : (
        <>
          <h3 className="font-sans text-2xl font-bold text-foreground mb-6">
            Envoyez-nous un message
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label htmlFor="company">Entreprise</Label>
              <Input id="company" placeholder="Nom de votre entreprise" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Sujet *</Label>
              <Input
                id="subject"
                placeholder="Objet de votre message"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                placeholder="Décrivez votre projet ou posez votre question..."
                rows={5}
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              Envoyer le message
              <Send className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
