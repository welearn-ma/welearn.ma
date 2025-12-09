import Image from "next/image"
import { Linkedin, Mail } from "lucide-react"

interface TeamMember {
  name: string
  role: string
  bio: string
  image: string
}

interface TeamGridProps {
  members: TeamMember[]
}

export function TeamGrid({ members }: TeamGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {members.map((member, index) => (
        <div key={index} className="group bg-secondary rounded-2xl overflow-hidden">
          <div className="aspect-square relative">
            <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
          </div>
          <div className="p-6">
            <h3 className="font-sans text-xl font-bold text-foreground mb-1">{member.name}</h3>
            <p className="text-primary font-medium text-sm mb-3">{member.role}</p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">{member.bio}</p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="p-2 text-muted-foreground hover:text-primary transition-colors bg-white rounded-lg"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 text-muted-foreground hover:text-primary transition-colors bg-white rounded-lg"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
