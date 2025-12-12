import { Mail, Phone, MapPin } from "lucide-react";

export function ContactInfoSection() {
  return (
    <div>
      <h2 className="font-sans text-3xl font-bold text-foreground mb-6">
        Restons en contact
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-8">
        Que vous soyez un professionnel en quête de montée en compétences ou une
        entreprise souhaitant former ses équipes, nous sommes là pour vous
        accompagner.
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
            <a
              href="tel:+212522000000"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              +212 520 850 850
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-xl shrink-0">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Adresse</h3>
            <p className="text-muted-foreground">
              300, Technopark Casablanca, Maroc
            </p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-secondary rounded-xl overflow-hidden h-64">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15778.335901280869!2d-7.640232!3d33.542951!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda62db9d09e3653%3A0xa4a712af3cd8a7a3!2sWelearn!5e1!3m2!1sfr!2sus!4v1765470968412!5m2!1sfr!2sus"
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
  );
}
