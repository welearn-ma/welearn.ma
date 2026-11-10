import { Mail, Phone, MapPin } from "lucide-react";
import { MapEmbed } from "@/components/contact/map-embed";

export function ContactInfoSection() {
  return (
    <div>
      <h2 className="font-sans text-3xl font-bold text-wl-text mb-6">
        Restons en contact
      </h2>
      <p className="text-wl-text-secondary leading-relaxed mb-8">
        Que vous soyez un professionnel en quête de montée en compétences ou une
        entreprise souhaitant former ses équipes, nous sommes là pour vous
        accompagner.
      </p>

      <div className="space-y-6 mb-12">
        <div className="flex items-start gap-4 rounded-xl border border-wl-border bg-white p-5">
          <div className="p-3 bg-wl-blue-tint rounded-xl shrink-0">
            <Mail className="h-6 w-6 text-wl-blue" />
          </div>
          <div>
            <h3 className="font-semibold text-wl-text mb-1">Email</h3>
            <a
              href="mailto:contact@welearn.ma"
              className="text-wl-text-secondary hover:text-wl-blue transition-colors"
            >
              contact@welearn.ma
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl border border-wl-border bg-white p-5">
          <div className="p-3 bg-wl-orange-tint rounded-xl shrink-0">
            <Phone className="h-6 w-6 text-wl-orange" />
          </div>
          <div>
            <h3 className="font-semibold text-wl-text mb-1">Téléphone</h3>
            <a
              href="tel:+212661499479"
              className="text-wl-text-secondary hover:text-wl-blue transition-colors"
            >
              +212 661 499 479
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl border border-wl-border bg-white p-5">
          <div className="p-3 bg-wl-blue-tint rounded-xl shrink-0">
            <MapPin className="h-6 w-6 text-wl-blue" />
          </div>
          <div>
            <h3 className="font-semibold text-wl-text mb-1">Adresse</h3>
            <p className="text-wl-text-secondary">
              Bureau 300, Technopark, Route de Nouaceur, Casablanca
            </p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-64 overflow-hidden rounded-xl border border-wl-border bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
        <MapEmbed />
      </div>
    </div>
  );
}
