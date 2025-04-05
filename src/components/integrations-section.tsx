"use client"

import Image from "next/image"

const integrations = [
  {
    name: "Stripe",
    image: "/images/integrations/stripe.svg"
  },
  {
    name: "Firebase",
    image: "/images/integrations/firebase.svg"
  },
  {
    name: "Supabase",
    image: "/images/integrations/supabase.svg"
  },
  {
    name: "Mixpanel",
    image: "/images/integrations/mixpanel.svg"
  },
  {
    name: "PostgreSQL",
    image: "/images/integrations/postgresql.svg"
  }
]

export function IntegrationsSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h3 className="text-xl font-medium text-muted-foreground">Works with your favorite tools</h3>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {integrations.map((integration) => (
            <div key={integration.name} className="flex flex-col items-center">
              <div className="relative h-12 w-32 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <Image 
                  src={integration.image} 
                  alt={`${integration.name} logo`}
                  width={128}
                  height={48}
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
