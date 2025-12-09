import type { LucideIcon } from "lucide-react"

interface PageHeroProps {
  title: string
  description: string
  badge?: {
    icon?: LucideIcon
    text: string
  }
}

export function PageHero({ title, description, badge }: PageHeroProps) {
  return (
    <section className="relative py-16 lg:py-24 bg-(--color-welearn-navy) overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 lg:px-8 text-center">
        {badge && (
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            {badge.icon && <badge.icon className="h-4 w-4 text-white" />}
            <span className="text-sm font-medium text-white">{badge.text}</span>
          </div>
        )}
        <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">{title}</h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">{description}</p>
      </div>
    </section>
  )
}
