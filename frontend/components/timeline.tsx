import type { LucideIcon } from "lucide-react"

interface TimelineItem {
  year: string
  title: string
  description: string
  icon: LucideIcon
}

interface TimelineProps {
  items: TimelineItem[]
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block" />

      <div className="space-y-12">
        {items.map((item, index) => (
          <div key={index} className="relative flex gap-8">
            {/* Timeline dot */}
            <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white shrink-0 z-10">
              <item.icon className="h-6 w-6" />
            </div>

            <div className="flex-1 bg-secondary rounded-2xl p-8">
              <div className="md:hidden inline-flex p-3 bg-primary/10 rounded-xl mb-4">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="inline-block text-sm font-bold text-primary mb-2">{item.year}</span>
              <h3 className="font-sans text-xl font-bold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
