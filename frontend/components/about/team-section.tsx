const team = [
  {
    initials: "HJ",
    name: "Hassan JAÏ",
    role: "CEO",
    email: "hassan.jai@welearn.ma",
  },
  {
    initials: "AK",
    name: "Abdelghani KOUIDER",
    role: "Directeur associé",
    email: "abdelghani.kouider@welearn.ma",
  },
  {
    initials: "OD",
    name: "Oumaima DAKIR",
    role: "Directrice technique",
    email: "oumaima.dakir@welearn.ma",
  },
  {
    initials: "AS",
    name: "Abderrahmane SASY",
    role: "Ingénieur pédagogique & coordinateur",
    email: "abderrahmane.sasy@welearn.ma",
  },
];

export function TeamSection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-wl-orange mb-3">
            NOTRE ÉQUIPE
          </p>
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-wl-text mb-4 text-balance leading-tight">
            Une équipe d'ingénieurs, de pédagogues et d'entrepreneurs
          </h2>
          <p className="text-lg text-wl-text-secondary leading-relaxed max-w-2xl mx-auto">
            L'équipe WeLearn combine une expertise terrain dans la construction
            et l'ingénierie, une maîtrise de l'innovation pédagogique et une
            expérience entrepreneuriale forgée au contact de grandes entreprises
            et d'institutions de premier plan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.initials}
              className="bg-white border border-wl-border rounded-xl p-6 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
            >
              <div className="h-14 w-14 rounded-full bg-wl-blue flex items-center justify-center mx-auto mb-4 shrink-0">
                <span className="text-white font-bold text-sm">
                  {member.initials}
                </span>
              </div>
              <h3 className="font-semibold text-wl-text text-[15px] leading-snug mb-1">
                {member.name}
              </h3>
              {/* flex-1 stretches role text area so email is always pinned to bottom */}
              <p className="text-sm text-wl-text-secondary flex-1 mb-3">
                {member.role}
              </p>
              {/* Fixed-height slot keeps the email row aligned across all cards */}
              <div className="min-h-4.5">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="text-xs text-wl-blue hover:underline break-all"
                  >
                    {member.email}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
