import Image from "next/image"

interface Logo {
  name: string
  logo: string
}

interface LogoGridProps {
  logos: Logo[]
}

export function LogoGrid({ logos }: LogoGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
      {logos.map((client, index) => (
        <div
          key={index}
          className="flex items-center justify-center p-6 bg-secondary rounded-xl hover:shadow-md transition-shadow"
        >
          <Image
            src={client.logo || "/placeholder.svg"}
            alt={client.name}
            width={160}
            height={80}
            className="max-h-16 w-auto opacity-70 hover:opacity-100 transition-opacity"
          />
        </div>
      ))}
    </div>
  )
}
