"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <span className="inline-block text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
            Parlons de votre projet
          </span>
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
            Contactez-nous
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Une question sur nos formations ? Un projet de formation corporate ? Notre équipe est à votre écoute.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="font-sans text-3xl font-bold text-foreground mb-6">Restons en contact</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Que vous soyez un professionnel en quête de montée en compétences ou une entreprise souhaitant former
                ses équipes, nous sommes là pour vous accompagner.
              </p>

              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <a
                      href="mailto:contact@welearn.ma"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      contact@welearn.ma
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Téléphone</h3>
                    <a href="tel:+212522000000" className="text-muted-foreground hover:text-primary transition-colors">
                      +212 5 22 00 00 00
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Adresse</h3>
                    <p className="text-muted-foreground">Casablanca, Maroc</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-secondary rounded-xl overflow-hidden h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d212270.5361tried2671!2d-7.6824!3d33.5731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd4778aa113b%3A0xb06c1d84f310fd3!2sCasablanca%2C%20Morocco!5e0!3m2!1sen!2s!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Welearn Location"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-secondary rounded-2xl p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <div className="p-4 bg-primary/10 rounded-full mb-6">
                    <CheckCircle className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="font-sans text-2xl font-bold text-foreground mb-2">Message envoyé !</h3>
                  <p className="text-muted-foreground text-center">
                    Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="font-sans text-2xl font-bold text-foreground mb-6">Envoyez-nous un message</h3>
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
                      <Input id="email" type="email" placeholder="votre@email.com" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Entreprise</Label>
                      <Input id="company" placeholder="Nom de votre entreprise" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Sujet *</Label>
                      <Input id="subject" placeholder="Objet de votre message" required />
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

                    <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-white">
                      Envoyer le message
                      <Send className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Corporate CTA */}
      <section className="py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-6">
            Besoin d'une formation corporate ?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Découvrez nos solutions sur-mesure pour entreprises : ingénierie de formation, académies corporate, parcours
            personnalisés.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white hover:bg-(--color-welearn-gold) text-(--color-welearn-navy) font-semibold transition-colors"
          >
            <a href="/ingenierie">Découvrir nos solutions entreprise</a>
          </Button>
        </div>
      </section>
    </>
  )
}
