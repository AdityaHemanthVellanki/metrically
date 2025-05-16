"use client"

import { Button } from "@/components/ui/button"
import { CheckIcon } from "lucide-react"
import { useEffect, useState } from "react"

export function PricingSection() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  // Don't render anything during SSR or initial render
  if (!isClient) {
    return <div className="h-[800px] w-full" /> // Reserve space
  }

  return (
    <section id="pricing" className="py-20 bg-muted/30" suppressHydrationWarning>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start for free. Scale when ready.</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get your first KPI system for free. Upgrade to unlock Slack sync, PDF exports, and dashboard integrations.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-card/50 backdrop-blur-sm border border-muted rounded-xl p-8 flex flex-col h-full hover:border-primary/20 transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-muted-foreground">Perfect for exploring</p>
            </div>
            
            <div className="mb-6">
              <div className="text-4xl font-bold">$0</div>
              <p className="text-muted-foreground">Free forever</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <CheckIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>1 KPI system generation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Basic SQL query generation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Simple visualization templates</span>
              </li>
            </ul>
            
            <div className="mt-auto">
              <Button variant="outline" className="w-full">Get Started</Button>
            </div>
          </div>
          
          {/* Pro Plan */}
          <div className="bg-card border-2 border-primary rounded-xl p-8 flex flex-col h-full relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium rounded-bl-lg">
              Popular
            </div>
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-muted-foreground">For growing startups</p>
            </div>
            
            <div className="mb-6">
              <div className="text-4xl font-bold">$19</div>
              <p className="text-muted-foreground">per month</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <CheckIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Unlimited KPI system generations</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Advanced SQL for any data source</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Interactive dashboard exports</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Slack notifications & updates</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>PDF exports & sharing</span>
              </li>
            </ul>
            
            <div className="mt-auto">
              <Button className="w-full bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700">
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
