type Props = {
  text: string;
};

export function FormationWhy({ text }: Props) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-wl-orange mb-3">
          Valeur ajoutée
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-wl-text mb-6">
          Pourquoi cette formation
        </h2>
        <p className="mx-auto max-w-3xl text-base leading-relaxed text-wl-text-secondary text-center">
          {text}
        </p>
      </div>
    </section>
  );
}
