"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle, Upload, X } from "lucide-react";

type RequestType = "formation" | "entreprise" | "partenariat" | "autre";

const requestTypes: {
  value: RequestType;
  label: string;
  description: string;
}[] = [
  {
    value: "formation",
    label: "Formation individuelle",
    description: "Inscription à une formation",
  },
  {
    value: "entreprise",
    label: "Projet entreprise",
    description: "Formation corporate ou sur-mesure",
  },
  {
    value: "partenariat",
    label: "Partenariat",
    description: "Collaboration ou partenariat",
  },
  {
    value: "autre",
    label: "Autre demande",
    description: "Question générale ou autre sujet",
  },
];

export function ContactFormSection() {
  const [submitted, setSubmitted] = useState(false);
  const [requestType, setRequestType] = useState<RequestType>("formation");
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send data to an API endpoint
    // The API would route emails based on requestType:
    // - formation -> formations@welearn.ma
    // - entreprise -> entreprise@welearn.ma
    // - partenariat -> partenariats@welearn.ma
    // - autre -> contact@welearn.ma
    setSubmitted(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getConfirmationMessage = () => {
    switch (requestType) {
      case "formation":
        return "Merci pour votre intérêt ! Notre équipe pédagogique vous contactera rapidement pour répondre à vos questions.";
      case "entreprise":
        return "Merci pour votre demande ! Notre équipe B2B vous contactera sous 24h pour discuter de votre projet.";
      case "partenariat":
        return "Merci pour votre proposition ! Nous étudierons votre demande et reviendrons vers vous prochainement.";
      default:
        return "Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.";
    }
  };

  return (
    <div className="rounded-2xl border border-wl-border bg-white p-8 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      {submitted ? (
        <div className="flex flex-col items-center justify-center h-full py-12">
          <div className="p-4 bg-wl-success-tint rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-wl-success" />
          </div>
          <h3 className="font-sans text-2xl font-bold text-wl-text mb-2">
            Message envoyé !
          </h3>
          <p className="text-wl-text-secondary text-center max-w-md">
            {getConfirmationMessage()}
          </p>
        </div>
      ) : (
        <>
          <h3 className="font-sans text-2xl font-bold text-wl-text mb-6">
            Envoyez-nous un message
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Request Type */}
            <div className="space-y-3">
              <Label>Type de demande *</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {requestTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setRequestType(type.value)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      requestType === type.value
                        ? "border-wl-blue bg-wl-blue-tint/60"
                        : "border-wl-border hover:border-wl-blue/40"
                    }`}
                  >
                    <div className="font-medium text-sm text-wl-text">
                      {type.label}
                    </div>
                    <div className="text-xs text-wl-text-secondary mt-1">
                      {type.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

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

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" type="tel" placeholder="+212 6XX XXX XXX" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Entreprise</Label>
                <Input id="company" placeholder="Nom de votre entreprise" />
              </div>
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

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="files">Pièces jointes (optionnel)</Label>
              <div className="rounded-lg border-2 border-dashed border-wl-border p-4 transition-colors hover:border-wl-blue/40">
                <label
                  htmlFor="files"
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  <Upload className="h-6 w-6 text-wl-text-secondary" />
                  <span className="text-sm text-wl-text-secondary">
                    Cliquez pour ajouter des fichiers
                  </span>
                  <span className="text-xs text-wl-text-tertiary">
                    PDF, DOC, DOCX, XLS, XLSX (Max 10 Mo)
                  </span>
                  <input
                    id="files"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {files.length > 0 && (
                <div className="space-y-2 mt-3">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-wl-border bg-wl-gray-light p-3"
                    >
                      <span className="text-sm text-wl-text truncate">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="ml-2 p-1 text-wl-text-secondary transition-colors hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-wl-blue hover:bg-wl-blue-dark text-white transition-all duration-200"
            >
              Envoyer le message
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
        </>
      )}
    </div>
  );
}
