import { Users, GraduationCap, Building2, Award } from "lucide-react";

const stats = [
  { value: "500+", label: "Professionnels formés", icon: Users },
  { value: "15+", label: "Programmes disponibles", icon: GraduationCap },
  { value: "50+", label: "Entreprises partenaires", icon: Building2 },
  { value: "95%", label: "Taux de satisfaction", icon: Award },
];

export function StatsSection() {
  return (
    <section className="py-16 bg-white border-b border-wl-border">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-xl border border-wl-border bg-wl-gray-light p-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
            >
              <div className="inline-flex rounded-xl bg-wl-blue-tint p-3 mb-4">
                <stat.icon className="h-6 w-6 text-wl-blue" />
              </div>
              <div className="text-3xl font-bold text-wl-text mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-wl-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
