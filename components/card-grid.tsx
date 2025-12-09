import type { LucideIcon } from "lucide-react"

interface CardItem {
  icon?: LucideIcon
  title: string
  description: string
  color?: string
}

interface CardGridProps {
  items: CardItem[]
  columns?: 2 | 3
}

export function CardGrid({ items, columns = 3 }: CardGridProps) {
  const gridCols = columns === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"

  return (
    <div className={`grid ${gridCols} gap-8`}>
      {items.map((item, index) => (
        <div key={index} className="group bg-secondary rounded-2xl p-8 hover:shadow-lg transition-all">
          {item.icon && (
            <div className={`inline-flex p-4 ${item.color || "bg-primary"} rounded-2xl mb-6`}>
              <item.icon className="h-8 w-8 text-white" />
            </div>
          )}
          <h3 className="font-sans text-xl font-bold text-foreground mb-4">{item.title}</h3>
          <p className="text-muted-foreground leading-relaxed">{item.description}</p>
        </div>
      ))}
    </div>
  )
}
