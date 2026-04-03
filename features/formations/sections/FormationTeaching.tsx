import type { TeachingCard } from "@/types/formation-page";

type Props = {
  cards: TeachingCard[];
};

export function FormationTeaching({ cards }: Props) {
  return (
    <section className="bg-wl-gray-light py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-wl-orange mb-3">
          Accompagnement
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-wl-text mb-10">
          Encadrement &amp; Pédagogie
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-wl-border bg-white p-7 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <card.icon className="h-8 w-8 text-wl-blue mb-4" />
              <h3 className="font-semibold text-wl-text mb-3">{card.title}</h3>
              {card.items ? (
                <ul className="space-y-2 text-sm text-wl-text-secondary">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-wl-blue" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-wl-text-secondary leading-relaxed">
                  {card.text}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
