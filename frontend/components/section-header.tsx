interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  centered?: boolean
  light?: boolean
}

export function SectionHeader({ eyebrow, title, description, centered = true, light = false }: SectionHeaderProps) {
  return (
    <div className={`max-w-3xl ${centered ? "mx-auto text-center" : ""} mb-12`}>
      {eyebrow && (
        <span
          className={`inline-block text-sm font-semibold uppercase tracking-wider mb-3 ${light ? "text-white/80" : "text-wl-orange"}`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-sans text-3xl md:text-4xl font-bold mb-4 text-balance ${light ? "text-white" : "text-wl-text"}`}
      >
        {title}
      </h2>
      {description && (
        <p className={`text-lg leading-relaxed ${light ? "text-white/80" : "text-wl-text-secondary"}`}>{description}</p>
      )}
    </div>
  )
}
