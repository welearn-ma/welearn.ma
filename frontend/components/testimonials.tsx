import { Quote } from "lucide-react"

interface Testimonial {
  quote: string
  author: string
  company: string
}

interface TestimonialsProps {
  items: Testimonial[]
}

export function Testimonials({ items }: TestimonialsProps) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {items.map((testimonial, index) => (
        <div key={index} className="bg-white rounded-2xl p-8">
          <Quote className="h-10 w-10 text-primary/20 mb-4" />
          <p className="text-foreground leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
          <div>
            <p className="font-semibold text-foreground">{testimonial.author}</p>
            <p className="text-sm text-muted-foreground">{testimonial.company}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
