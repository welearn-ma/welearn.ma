import { Users, GraduationCap, Building2, Award } from "lucide-react";

const stats = [
  { value: "500+", label: "Professionnels formés", icon: Users },
  { value: "15+", label: "Programmes disponibles", icon: GraduationCap },
  { value: "50+", label: "Entreprises partenaires", icon: Building2 },
  { value: "95%", label: "Taux de satisfaction", icon: Award },
];

export function StatsSection() {
  return (
    <section className="py-12 bg-white border-b border-border">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex p-3 bg-primary/10 rounded-xl mb-3">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
