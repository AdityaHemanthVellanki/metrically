"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function TestimonialsWaitlist() {
  const testimonials = [
    {
      quote: "We've been using the beta version of Metrically for our SaaS startup and the AI-generated KPIs have been spot on. Can't wait for the full launch!",
      name: "Alex Chen",
      title: "CTO, TechStart",
      avatar: "AC"
    },
    {
      quote: "The ability to generate SQL queries directly from our KPIs will save our analytics team countless hours. This is exactly what we've been looking for.",
      name: "Sophia Rodriguez",
      title: "Head of Analytics, DataFlow",
      avatar: "SR"
    },
    {
      quote: "As a non-technical founder, I've struggled with setting up the right metrics. Metrically makes it easy to track what truly matters for our growth.",
      name: "Michael Park",
      title: "Founder, GrowthLabs",
      avatar: "MP"
    }
  ];

  return (
    <section className="py-20" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Early Testers Are Saying</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We've shared early access with select startups who are already seeing the value of AI-driven KPI architecture.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-md mb-6 italic">"{testimonial.quote}"</p>
                <Separator className="mb-4" />
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
